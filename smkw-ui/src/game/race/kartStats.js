import { getCharacterClass } from '../../config/characters'
import { getVehicle } from '../../config/vehicles'

// Caractéristiques physiques d'un kart : statistiques du véhicule (60 %) et de l'archétype du
// pilote (40 %), sur 10, converties en unités physiques (m/s, m/s², rad/s). Calcul pur.
const VEHICLE_SHARE = 0.6
const NEUTRAL = { topSpeed: 6, acceleration: 6, weight: 5, handling: 6, drift: 6, toughness: 5 }

function blendStats(vehicle, characterClass) {
  const a = vehicle?.stats ?? NEUTRAL
  const b = characterClass?.stats ?? NEUTRAL
  const blended = {}
  for (const key of Object.keys(NEUTRAL)) blended[key] = a[key] * VEHICLE_SHARE + b[key] * (1 - VEHICLE_SHARE)
  return blended
}

export function buildKartStats(characterId, vehicleId) {
  const characterClass = getCharacterClass(characterId)
  const s = blendStats(getVehicle(vehicleId), characterClass)
  return Object.freeze({
    maxSpeed: 24 + s.topSpeed * 0.9, // ~29 m/s (105 km/h) pour un kart moyen
    acceleration: 7 + s.acceleration * 1.3,
    reverseSpeed: 7,
    brake: 26,
    coast: 5, // ralentissement sans accélérer
    turnRate: 1.6 + s.handling * 0.12, // rad/s à vitesse moyenne
    grip: 6 + s.handling * 0.5, // amortissement de la glisse latérale (1/s)
    driftGrip: 1.6 + s.drift * 0.12,
    driftCharge: 0.75 + s.drift * 0.05, // vitesse de charge du turbo de drift
    mass: 1 + s.weight * 0.15,
    toughness: s.toughness,
    // Hors-piste : vitesse maximale réduite (l'aéroglisseur n'est pas ralenti).
    offRoad: characterClass?.mechanic?.ignoresOffRoad ? 1 : 0.5,
  })
}
