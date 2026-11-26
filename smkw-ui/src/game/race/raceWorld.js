import { RACE } from '../../config/race'
import { createRandom } from '../track/noise'
import { getTrackGeometry } from '../track/trackGeometry'
import { getStartSlot } from '../track/trackLayout'
import { createItemState, updateItems } from '../items/itemSystem'
import { resolveKartCollisions } from './kartCollisions'
import { stepKartPhysics } from './kartPhysics'
import { chooseControls } from './raceControls'
import { updateTrackFeatures } from './kartFeatures'
import { createRaceKart } from './raceKart'
import { placeOnGround, updateKartVertical } from './kartVertical'
import { updatePace } from './racePace'
import { updateProgress, updateRanking } from './raceProgress'
import { getRaceRoster } from './raceRoster'
import { createStartSequence } from './startLights'
import { applyFence, isInWater, respawnOnTrack, updateTrackIndex } from './trackTracking'

const GAP_WATER = -0.6 // hauteur sous laquelle un kart tombé dans une brèche coule

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
    random,
    dt: 0,
    items: createItemState(geometry, random),
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

function moveKart(world, kart, dt) {
  const { path, track, gaps } = world.geometry
  if (kart.sinking > 0) {
    kart.sinking = Math.max(0, kart.sinking - dt)
    if (kart.sinking === 0) {
      respawnOnTrack(path, kart, gaps)
      placeOnGround(kart, world.geometry)
    }
    return
  }
  const fromX = kart.x
  const fromZ = kart.z
  stepKartPhysics(kart, kart.controls, dt)
  updateKartVertical(kart, world.geometry, dt)
  updateTrackIndex(path, kart)
  applyFence(world.geometry, kart)
  updateTrackFeatures(world.geometry, kart, dt)
  // Dans l'eau : hors de la route sur un lac (au sol), ou tombé dans une brèche du deltaplane.
  const fell = gaps[kart.trackIndex] && kart.y < GAP_WATER
  if (fell || (kart.offRoad && !kart.airborne && isInWater(track.lakes, kart.x, kart.z))) {
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
  world.dt = delta
  world.raceTime = world.time - world.start.goAt
  if (world.phase === RACE_PHASES.COUNTDOWN && world.raceTime >= 0) world.phase = RACE_PHASES.RACING
  for (const kart of world.karts) chooseControls(world, kart, readControls)
  if (world.phase === RACE_PHASES.COUNTDOWN) return

  updatePace(world)
  const steps = Math.max(1, Math.ceil(delta / RACE.step - 1e-6))
  for (let step = 0; step < steps; step += 1) {
    for (const kart of world.karts) moveKart(world, kart, delta / steps)
    resolveKartCollisions(world.karts)
    updateItems(world, delta / steps)
  }
  updateRanking(world)
  updateEnd(world)
}
