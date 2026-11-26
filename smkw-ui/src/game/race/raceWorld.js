import { RACE } from '../../config/race'
import { getSpeedClass } from '../../config/raceFeel'
import { createRandom } from '../track/noise'
import { getTrackGeometry } from '../track/trackGeometry'
import { getStartSlot } from '../track/trackLayout'
import { createItemState, updateItems } from '../items/itemSystem'
import { resolveKartCollisions } from './kartCollisions'
import { updateKartAssists } from './kartDraft'
import { chooseControls } from './raceControls'
import { createRaceKart } from './raceKart'
import { moveKart } from './kartMove'
import { updatePace } from './racePace'
import { updateRanking } from './raceProgress'
import { getRaceRoster } from './raceRoster'
import { createStartSequence } from './startLights'

// Monde d'une course (calcul pur, sans React ni Three) : départ, conduite, chocs, tours,
// classement, fin. `raceTime` est négatif pendant les feux, 0 à leur extinction.
export const RACE_PHASES = Object.freeze({ COUNTDOWN: 'countdown', RACING: 'racing', RESULTS: 'results' })

export function createRaceWorld(match, seed, resolveDevice) {
  const geometry = getTrackGeometry(match.trackId)
  const random = createRandom(seed)
  const speedClass = getSpeedClass(match.speedClass)
  const karts = getRaceRoster(match).map((racer, order) =>
    createRaceKart(racer, getStartSlot(geometry.path, order), geometry, { device: resolveDevice(racer), random, speedClass }),
  )
  const world = {
    geometry,
    // Réseau local : { hostId, clientId, host } (net/netMatch.js), sinon null.
    net: match.net ?? null,
    laps: match.laps,
    seed,
    random,
    dt: 0,
    items: createItemState(geometry, random),
    karts,
    humans: karts.filter((kart) => !kart.isBot && !kart.remote),
    kartsById: new Map(karts.map((kart) => [kart.id, kart])),
    ranking: [...karts],
    start: createStartSequence(),
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
  for (const kart of world.karts) if (!kart.remote) chooseControls(world, kart, readControls)
  if (world.phase === RACE_PHASES.COUNTDOWN) return

  updatePace(world)
  const steps = Math.max(1, Math.ceil(delta / RACE.step - 1e-6))
  for (let step = 0; step < steps; step += 1) {
    for (const kart of world.karts) moveKart(world, kart, delta / steps)
    resolveKartCollisions(world.karts)
    updateItems(world, delta / steps)
  }
  updateKartAssists(world, delta)
  updateRanking(world)
  updateEnd(world)
}
