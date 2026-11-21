import { RACE, START_LIGHTS } from '../../config/race'
import { createRandom } from '../track/noise'
import { getTrackGeometry } from '../track/trackGeometry'
import { getStartSlot } from '../track/trackLayout'
import { driveBot } from './botDriver'
import { resolveKartCollisions } from './kartCollisions'
import { stepKartPhysics } from './kartPhysics'
import { createRaceKart } from './raceKart'
import { updateProgress, updateRanking } from './raceProgress'
import { getRaceRoster } from './raceRoster'
import { createStartSequence, getStartBoost } from './startLights'
import { applyFence, isInWater, respawnOnTrack, updateTrackIndex } from './trackTracking'

// Monde d'une course (calcul pur, sans React ni Three) : départ, conduite, chocs, tours,
// classement, fin. `raceTime` est négatif pendant les feux, 0 à leur extinction.
export const RACE_PHASES = Object.freeze({ COUNTDOWN: 'countdown', RACING: 'racing', RESULTS: 'results' })

export function createRaceWorld(match, seed, resolveDevice) {
  const geometry = getTrackGeometry(match.trackId)
  const random = createRandom(seed)
  const karts = getRaceRoster(match).map((racer, order) =>
    createRaceKart(racer, getStartSlot(geometry.path, order), geometry, { device: resolveDevice(racer), random }),
  )
  const world = {
    geometry,
    laps: match.laps,
    seed,
    karts,
    humans: karts.filter((kart) => !kart.isBot),
    kartsById: new Map(karts.map((kart) => [kart.id, kart])),
    ranking: [...karts],
    start: createStartSequence(random),
    time: 0,
    raceTime: 0,
    phase: RACE_PHASES.COUNTDOWN,
    finishCount: 0,
    resultsAt: null,
  }
  world.raceTime = -world.start.goAt
  updateRanking(world)
  return world
}

function chooseControls(world, kart, readControls) {
  if (kart.isBot || kart.finished || kart.autopilot) driveBot(kart, world.geometry.path, kart.controls)
  else readControls(kart, kart.controls)
  if (kart.isBot && world.raceTime < kart.reaction) kart.controls.throttle = 0
  // Départ turbo : nouvel appui sur l'accélérateur juste après l'extinction des feux.
  const pressed = kart.controls.throttle > 0
  if (!kart.launched && world.raceTime >= 0) {
    kart.boost = Math.max(kart.boost, getStartBoost(world.raceTime, pressed, kart.throttleBefore))
    kart.launched = pressed || world.raceTime > START_LIGHTS.perfectWindow
  }
  kart.throttleBefore = pressed
}

// Rythme des pilotes : un bot loin devant le meilleur joueur ralentit un peu, loin derrière il
// accélère un peu (course serrée). Après l'arrivée, le pilote automatique roule tranquillement.
function updatePace(world) {
  let lead = -Infinity
  for (const kart of world.humans) lead = Math.max(lead, kart.finished ? Infinity : kart.raceDistance)
  for (const kart of world.karts) {
    if (!kart.isBot) kart.topFactor = kart.finished ? 0.85 : kart.autopilot ? 0.97 : 1
    else if (Number.isFinite(lead)) kart.topFactor = kart.skill * Math.min(1.07, Math.max(0.93, 1 - (kart.raceDistance - lead) / 2500))
    else kart.topFactor = kart.skill
  }
}

function moveKart(world, kart, dt) {
  const { path, track } = world.geometry
  if (kart.sinking > 0) {
    kart.sinking = Math.max(0, kart.sinking - dt)
    if (kart.sinking === 0) respawnOnTrack(path, kart)
    return
  }
  const fromX = kart.x
  const fromZ = kart.z
  stepKartPhysics(kart, kart.controls, dt)
  updateTrackIndex(path, kart)
  applyFence(path, kart)
  if (kart.offRoad && isInWater(track.lakes, kart.x, kart.z)) {
    kart.sinking = RACE.respawnDelay
    kart.vx = 0
    kart.vz = 0
    kart.speed = 0
  }
  if (!kart.finished) updateProgress(kart, world, fromX, fromZ)
}

function updateEnd(world) {
  if (world.phase !== RACE_PHASES.RACING) return
  if (world.resultsAt === null && world.humans.every((kart) => kart.finished)) world.resultsAt = world.time + RACE.resultsDelay
  if (world.resultsAt !== null && world.time >= world.resultsAt) world.phase = RACE_PHASES.RESULTS
}

// Une frame de `delta` secondes, découpée en pas fixes. `readControls(kart, out)` lit les
// commandes d'un joueur.
export function stepRaceWorld(world, delta, readControls) {
  world.time += delta
  world.raceTime = world.time - world.start.goAt
  if (world.phase === RACE_PHASES.COUNTDOWN && world.raceTime >= 0) world.phase = RACE_PHASES.RACING
  for (const kart of world.karts) chooseControls(world, kart, readControls)
  if (world.phase === RACE_PHASES.COUNTDOWN) return

  updatePace(world)
  const steps = Math.max(1, Math.ceil(delta / RACE.step - 1e-6))
  for (let step = 0; step < steps; step += 1) {
    for (const kart of world.karts) moveKart(world, kart, delta / steps)
    resolveKartCollisions(world.karts)
  }
  updateRanking(world)
  updateEnd(world)
}
