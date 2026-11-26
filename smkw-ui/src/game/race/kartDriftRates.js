import { DRIFT } from '../../config/driftTuning'

// Taux du dérapage (calcul pur), selon le braquage relatif au drift `inward`
// (-1 contre-braquage .. 0 neutre .. 1 vers l'intérieur) : tables de config/driftTuning.js.
const mix = (table, inward) =>
  inward >= 0 ? table.neutral + (table.inside - table.neutral) * inward : table.neutral + (table.neutral - table.outside) * inward

export const driftInward = (kart) => Math.max(-1, Math.min(1, kart.driftSteer * kart.driftDir))

// Charge de la jauge par seconde : plus rapide dedans, ralentie (jamais nulle) en contre-braquage.
// Hors-piste (sauf karts tout-terrain), elle ne charge pas.
export function chargeRate(kart, inward) {
  const quality = kart.isBot ? DRIFT.botCharge : mix(DRIFT.charge, inward)
  const speedFactor = Math.min(1, kart.speed / (kart.stats.maxSpeed * 0.7))
  const surface = kart.offRoad && kart.stats.offRoad < 1 ? 0 : 1
  return quality * kart.stats.driftCharge * speedFactor * surface
}

// Vitesse de rotation visée du kart (rad/s, signée : > 0 vers la droite pour driftDir = 1),
// toujours vers l'intérieur ; majorée à l'entrée (attaque du virage), faible en l'air.
export function driftYawTarget(kart, inward) {
  const entry = 1 + DRIFT.entryKick * Math.max(0, 1 - kart.driftTime / DRIFT.entryTime)
  const air = kart.airborne ? DRIFT.airTurn : 1
  return kart.driftDir * kart.stats.driftTurn * mix(DRIFT.turn, inward) * entry * air
}

// Adhérence latérale (1/s) : moindre à haute vitesse et pendant le saut, plus forte en
// contre-braquage.
export function driftGrip(kart, inward) {
  const ratio = Math.min(1, Math.max(0, kart.speed) / kart.stats.maxSpeed)
  const speedShape = 1 - (1 - DRIFT.highSpeedGrip) * ratio
  const counter = 1 + DRIFT.counterGrip * Math.max(0, -inward)
  const hop = kart.hop > 0 || kart.airborne ? DRIFT.hopGrip : 1
  return kart.stats.driftGrip * speedShape * counter * hop
}
