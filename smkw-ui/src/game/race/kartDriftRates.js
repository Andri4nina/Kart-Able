import { DRIFT } from '../../config/kartTuning'

// Taux du dérapage (calcul pur) : vitesse de charge de la jauge et vitesse de rotation, selon
// le braquage par rapport au sens du drift (-1 extérieur .. 1 intérieur).

export function chargeQuality(kart, controls) {
  // Minuteur : plus rapide en braquant franchement vers l'intérieur (-1 extérieur .. 1 intérieur).
  // Les pilotes ordinateur dosent leur trajectoire en braquant dehors : ils chargent comme en
  // braquant dedans (sinon ils n'auraient presque jamais de mini-turbo).
  const inward = controls.steer * kart.driftDir
  const quality = kart.isBot || inward > DRIFT.chargeSteer ? DRIFT.chargeInside : 1
  const speedFactor = Math.min(1, kart.speed / (kart.stats.maxSpeed * 0.7))
  const surface = kart.offRoad && kart.stats.offRoad < 1 ? 0 : 1
  return quality * speedFactor * surface
}

// Vitesse de rotation pendant le dérapage : toujours vers l'intérieur, plus ou moins serrée.
export function driftTurnRate(kart, controls) {
  const inward = controls.steer * kart.driftDir
  const factor = inward >= 0
    ? DRIFT.turnNeutral + (DRIFT.turnInside - DRIFT.turnNeutral) * inward
    : DRIFT.turnNeutral + (DRIFT.turnNeutral - DRIFT.turnOutside) * inward
  return kart.driftDir * kart.stats.turnRate * DRIFT.fullSpeedTurn * factor
}
