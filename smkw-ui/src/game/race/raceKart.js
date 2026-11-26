import { createItemFields } from '../items/itemRules'
import { createLapProgress } from '../track/lapRules'
import { buildKartStats, scaleKartStats } from './kartStats'
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

export function createRaceKart(racer, slot, geometry, { device, random, speedClass }) {
  const skill = (racer.skill ?? 1) + (racer.isBot ? speedClass.botSkill : 0)
  const kart = {
    id: racer.id,
    isBot: racer.isBot,
    // Piloté par une autre machine (réseau local) : état reçu dans `net` (remoteKart.js).
    remote: Boolean(racer.remote),
    net: null,
    playerIndex: racer.isBot ? null : racer.index,
    characterId: racer.characterId,
    vehicleId: racer.vehicleId,
    device: device ?? null,
    stats: scaleKartStats(buildKartStats(racer.characterId, racer.vehicleId), speedClass),
    skill,
    lane: racer.lane ?? 0,
    reaction: racer.isBot ? BOT_REACTION.min + random() * (BOT_REACTION.max - BOT_REACTION.min) : 0,
    autopilot: false,
    controls: { throttle: 0, brake: 0, steer: 0, drift: false, item: false },
    throttleBefore: false,
    launched: false,
    // Mouvement
    x: slot.x,
    y: slot.y ?? 0,
    vy: 0,
    airborne: false,
    slope: 0,
    z: slot.z,
    yaw: slot.yaw,
    vx: 0,
    vz: 0,
    speed: 0,
    topFactor: skill,
    // Dérapage (kartDrift.js) : saut, sens, charge, palier, saut armé, sens choisi en l'air,
    // touche tenue. En l'air (kartAir.js) : deltaplane, figure en cours, fenêtre pour figurer,
    // figure à récompenser, style de figure.
    hop: 0,
    driftDir: 0,
    driftCharge: 0,
    driftTier: 0,
    driftArmed: false,
    driftPick: 0,
    driftHeld: false,
    gliding: false,
    trick: 0,
    trickWindow: 0,
    trickPending: false,
    trickStyle: 0,
    rampGlide: false,
    // Turbo (kartBoost.js) et chocs (kartCollisions.js) : secousse restante, nombre de chocs.
    boost: 0,
    boostSpeed: 1,
    boostAccel: 1,
    boostSource: null,
    bump: 0,
    hits: 0,
    // Aspiration et sens interdit (kartDraft.js) ; faux départ : moteur calé (s restantes).
    draft: 0,
    draftCooldown: 0,
    drafting: false,
    wrongWay: false,
    wrongWayTime: 0,
    falseStart: false,
    startPress: 0,
    stall: 0,
    padCooldown: 0,
    // Objets (game/items/itemRules.js) : objet en main, tirage, objet tenu, bulle, effets.
    ...createItemFields(),
    botItemWait: -1, botDriftTime: 0, botOffRoad: 0, botOverturn: 0,
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
