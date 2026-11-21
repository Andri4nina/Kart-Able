import { START_LIGHTS } from '../../config/race'

// Départ façon Formule 1 (calcul pur) : les feux s'allument un par un, puis s'éteignent tous
// après un délai tiré au hasard, connu du jeu seulement : impossible d'anticiper le départ.
export function createStartSequence(random) {
  const lastLightAt = START_LIGHTS.firstAt + (START_LIGHTS.count - 1) * START_LIGHTS.interval
  const hold = START_LIGHTS.holdMin + random() * (START_LIGHTS.holdMax - START_LIGHTS.holdMin)
  return Object.freeze({ goAt: lastLightAt + hold })
}

// Nombre de feux allumés à l'instant `time` (0 avant le premier et après l'extinction).
export function getLightsOn(sequence, time) {
  if (time < START_LIGHTS.firstAt || time >= sequence.goAt) return 0
  return Math.min(START_LIGHTS.count, 1 + Math.floor((time - START_LIGHTS.firstAt) / START_LIGHTS.interval))
}

// Départ turbo : accélérer (nouvel appui) peu après l'extinction des feux. Un appui maintenu
// pendant les feux ne compte pas : seul le réflexe est récompensé.
export function getStartBoost(raceTime, pressedNow, pressedBefore) {
  if (!pressedNow || pressedBefore || raceTime < 0 || raceTime > START_LIGHTS.perfectWindow) return 0
  return START_LIGHTS.perfectBoost
}
