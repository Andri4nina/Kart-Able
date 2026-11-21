import { createLapProgress } from '../track/lapRules'
import { buildKartStats } from './kartStats'
import { updateTrackIndex } from './trackTracking'

// État d'un kart en course (objet mutable, modifié en place par raceWorld : aucune allocation
// par frame). `device` : périphérique du joueur (null pour un pilote ordinateur).
const BOT_REACTION = { min: 0.12, max: 0.5 } // s après l'extinction des feux

function nearestIndex(path, x, z) {
  let best = 0
  let bestDistance = Infinity
  for (let i = 0; i < path.count; i += 1) {
    const distance = (x - path.x[i]) ** 2 + (z - path.z[i]) ** 2
    if (distance < bestDistance) {
      bestDistance = distance
      best = i
    }
  }
  return best
}

export function createRaceKart(racer, slot, geometry, { device, random }) {
  const kart = {
    id: racer.id,
    isBot: racer.isBot,
    playerIndex: racer.isBot ? null : racer.index,
    characterId: racer.characterId,
    vehicleId: racer.vehicleId,
    device: device ?? null,
    stats: buildKartStats(racer.characterId, racer.vehicleId),
    skill: racer.skill ?? 1,
    lane: racer.lane ?? 0,
    reaction: racer.isBot ? BOT_REACTION.min + random() * (BOT_REACTION.max - BOT_REACTION.min) : 0,
    autopilot: false,
    controls: { throttle: 0, brake: 0, steer: 0, drift: false, item: false },
    throttleBefore: false,
    launched: false,
    // Mouvement
    x: slot.x,
    z: slot.z,
    yaw: slot.yaw,
    vx: 0,
    vz: 0,
    speed: 0,
    topFactor: racer.skill ?? 1,
    driftDir: 0,
    driftCharge: 0,
    boost: 0,
    sinking: 0,
    // Position sur le tracé
    trackIndex: nearestIndex(geometry.path, slot.x, slot.z),
    lateral: 0,
    trackDistance: 0,
    offRoad: false,
    // Course
    progress: createLapProgress(geometry.gates.length),
    lapTimes: [],
    lapStart: 0,
    raceDistance: 0,
    position: 0,
    finished: false,
    finishTime: null,
    finishOrder: 0,
  }
  updateTrackIndex(geometry.path, kart)
  return kart
}
