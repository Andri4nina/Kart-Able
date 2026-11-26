import { getCharacterClass } from '../../config/characters'
import { STAT_CURVES } from '../../config/kartTuning'
import { getVehicle } from '../../config/vehicles'

// Caractéristiques physiques d'un kart : statistiques du véhicule et de l'archétype du pilote
// (sur 10, mélangées selon STAT_CURVES.vehicleShare), converties en unités physiques par les
// courbes de config/kartTuning.js. Calcul pur.
const NEUTRAL = { topSpeed: 6, acceleration: 6, weight: 5, handling: 6, drift: 6, toughness: 5 }

function blendStats(vehicle, characterClass) {
  const a = vehicle?.stats ?? NEUTRAL
  const b = characterClass?.stats ?? NEUTRAL
  const share = STAT_CURVES.vehicleShare
  const blended = {}
  for (const key of Object.keys(NEUTRAL)) blended[key] = a[key] * share + b[key] * (1 - share)
  return blended
}

const curve = (name, stat) => STAT_CURVES[name].base + (stat - 6) * STAT_CURVES[name].perPoint

export function buildKartStats(characterId, vehicleId) {
  const characterClass = getCharacterClass(characterId)
  const vehicle = getVehicle(vehicleId)
  const s = blendStats(vehicle, characterClass)
  return Object.freeze({
    maxSpeed: curve('maxSpeed', s.topSpeed),
    // Un kart lourd démarre un peu moins vite (en plus de sa statistique d'accélération).
    acceleration: curve('acceleration', s.acceleration) - (s.weight - 5) * 0.15,
    reverseSpeed: STAT_CURVES.reverseSpeed,
    brake: STAT_CURVES.brake,
    coast: STAT_CURVES.coast,
    turnRate: curve('turnRate', s.handling),
    grip: curve('grip', s.handling),
    driftTurn: curve('driftTurn', s.handling),
    driftGrip: curve('driftGrip', s.drift),
    driftResponse: curve('driftResponse', s.weight + 1),
    driftRecover: curve('driftRecover', s.handling),
    driftCharge: curve('driftCharge', s.drift),
    mass: curve('mass', s.weight),
    toughness: Math.min(0.95, curve('toughness', s.toughness)),
    offRoad: characterClass?.mechanic?.ignoresOffRoad ? 1 : (vehicle?.offRoad ?? STAT_CURVES.offRoad),
  })
}

// Cylindrée (config/raceFeel.js SPEED_CLASSES) : vitesse de pointe et accélération.
export function scaleKartStats(stats, speedClass) {
  if (!speedClass || (speedClass.speed === 1 && speedClass.accel === 1)) return stats
  return Object.freeze({ ...stats, maxSpeed: stats.maxSpeed * speedClass.speed, acceleration: stats.acceleration * speedClass.accel })
}
