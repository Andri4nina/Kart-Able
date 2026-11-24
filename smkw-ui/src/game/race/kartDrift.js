import { DRIFT } from '../../config/kartTuning'
import { applyBoost } from './kartBoost'

// Dérapage façon kart arcade (calcul pur, aucune allocation), comme dans les jeux du genre :
// 1. appui sur Drift en roulant : petit saut (hop), le drift est « armé » tant qu'il est tenu ;
// 2. dès que le kart touche le sol avec une direction braquée (pendant le saut ou à n'importe
//    quel moment ensuite, Drift toujours tenu), le dérapage part de ce côté avec une petite
//    poussée vers l'extérieur ;
// 3. le kart tourne toujours vers l'intérieur : la direction resserre ou élargit l'arc ;
// 4. la jauge se charge selon la qualité : braquer vers l'intérieur charge plus vite, vers
//    l'extérieur plus lentement ; vitesse basse ou hors-piste : pas de charge ;
// 5. relâcher Drift : mini-turbo du palier atteint (bleu, orange, violet).
// Freiner, ralentir trop ou subir un choc fort annule le dérapage sans turbo ; il faut alors
// relâcher puis réappuyer pour en relancer un.

export function getDriftTier(charge) {
  let tier = 0
  for (const step of DRIFT.tiers) if (charge >= step.charge) tier += 1
  return tier
}

// Fraction 0..1 de la jauge vers le palier suivant (affichage).
export function getDriftGauge(charge) {
  const last = DRIFT.tiers[DRIFT.tiers.length - 1].charge
  return Math.min(1, charge / last)
}

export function cancelDrift(kart) {
  kart.driftDir = 0
  kart.driftCharge = 0
  kart.driftTier = 0
  kart.driftArmed = false
}

function chargeQuality(kart, controls) {
  const inward = controls.steer * kart.driftDir // -1 extérieur .. 1 intérieur
  const quality = inward >= 0
    ? 1 + (DRIFT.chargeInside - 1) * inward
    : 1 + (1 - DRIFT.chargeOutside) * inward
  const speedFactor = Math.min(1, kart.speed / (kart.stats.maxSpeed * 0.7))
  const surface = kart.offRoad && kart.stats.offRoad < 1 ? 0 : 1
  return quality * speedFactor * surface
}

function tryStart(kart, controls) {
  if (Math.abs(controls.steer) < DRIFT.steerThreshold) return
  kart.driftDir = Math.sign(controls.steer)
  kart.driftCharge = 0
  kart.driftTier = 0
  // Petite poussée vers l'extérieur du virage : le kart « décroche » en entrant en drift.
  const kick = kart.speed * DRIFT.entryKick * kart.driftDir
  kart.vx += Math.cos(kart.yaw) * kick
  kart.vz -= Math.sin(kart.yaw) * kick
}

export function updateDrift(kart, controls, dt) {
  const pressed = controls.drift && !kart.driftHeld
  kart.driftHeld = controls.drift
  if (pressed && !kart.driftDir && kart.hop === 0 && kart.speed > kart.stats.maxSpeed * 0.15) {
    kart.hop = DRIFT.hopTime
    kart.driftArmed = true
  }
  if (kart.hop > 0) kart.hop = Math.max(0, kart.hop - dt)
  if (!controls.drift && !kart.driftDir) kart.driftArmed = false

  if (!kart.driftDir) {
    const fastEnough = kart.speed > kart.stats.maxSpeed * DRIFT.minSpeed
    if (kart.driftArmed && kart.hop === 0 && !kart.airborne && fastEnough) tryStart(kart, controls)
    return
  }
  if (controls.brake > 0.5 || kart.speed < kart.stats.maxSpeed * DRIFT.cancelSpeed) {
    cancelDrift(kart)
    return
  }
  if (controls.drift) {
    kart.driftCharge += dt * kart.stats.driftCharge * chargeQuality(kart, controls)
    kart.driftTier = getDriftTier(kart.driftCharge)
    return
  }
  // Relâché : mini-turbo du palier atteint.
  if (kart.driftTier > 0) applyBoost(kart, DRIFT.tiers[kart.driftTier - 1].boost)
  cancelDrift(kart)
}

// Vitesse de rotation pendant le dérapage : toujours vers l'intérieur, plus ou moins serrée.
export function driftTurnRate(kart, controls) {
  const inward = controls.steer * kart.driftDir
  const factor = inward >= 0
    ? DRIFT.turnNeutral + (DRIFT.turnInside - DRIFT.turnNeutral) * inward
    : DRIFT.turnNeutral + (DRIFT.turnNeutral - DRIFT.turnOutside) * inward
  return kart.driftDir * kart.stats.turnRate * DRIFT.fullSpeedTurn * factor
}
