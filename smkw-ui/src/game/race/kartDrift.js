import { DRIFT } from '../../config/kartTuning'
import { startTrick } from './kartAir'
import { applyBoost } from './kartBoost'
import { chargeQuality } from './kartDriftRates'

export { driftTurnRate } from './kartDriftRates'

// Dérapage manuel façon kart arcade (calcul pur, aucune allocation ; règles : DRIFT dans
// config/kartTuning.js). Appui = saut ; tant que Drift reste enfoncé, le premier sens braqué
// (en l'air ou au sol) fixe le drift ; relâcher = mini-turbo du palier atteint. Freiner,
// ralentir ou un choc fort l'annulent (relâcher puis réappuyer pour en relancer un).
// État : hop, driftPick (sens choisi en l'air), driftArmed, driftDir, driftCharge, driftTier.

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
  kart.driftPick = 0
}

function startDrift(kart, dir) {
  kart.driftDir = dir
  kart.driftCharge = 0
  kart.driftTier = 0
  kart.driftArmed = false
  kart.driftPick = 0
  // Petite poussée vers l'extérieur du virage : le kart « décroche » en entrant en drift.
  const kick = kart.speed * DRIFT.entryKick * dir
  kart.vx += Math.cos(kart.yaw) * kick
  kart.vz -= Math.sin(kart.yaw) * kick
}

const steerSide = (controls) => (Math.abs(controls.steer) >= DRIFT.steerThreshold ? Math.sign(controls.steer) : 0)

// Saut en cours, ou Drift tenu au sol sans sens encore choisi : le premier sens braqué lance
// le dérapage (dès l'atterrissage, s'il a été choisi en l'air).
function updateHop(kart, controls, dt) {
  if (kart.hop > 0) {
    const side = steerSide(controls)
    if (side) kart.driftPick = side
    kart.hop = Math.max(0, kart.hop - dt)
    return
  }
  if (kart.airborne) return
  const side = kart.driftPick || steerSide(controls)
  if (side && kart.speed > kart.stats.maxSpeed * DRIFT.minSpeed) startDrift(kart, side)
}

export function updateDrift(kart, controls, dt) {
  const pressed = controls.drift && !kart.driftHeld
  kart.driftHeld = controls.drift
  // En l'air juste après un décollage : l'appui fait une figure (kartAir.js), pas un saut.
  if (pressed && kart.trickWindow > 0 && !kart.trickPending) {
    startTrick(kart)
    return
  }
  if (pressed && !kart.driftDir && kart.hop === 0 && !kart.airborne && !kart.gliding && kart.speed > kart.stats.maxSpeed * 0.15) {
    kart.hop = DRIFT.hopTime
    kart.driftArmed = true
    kart.driftPick = 0
  }
  if (!kart.driftDir) {
    if (!controls.drift) {
      kart.driftArmed = false
      kart.driftPick = 0
    }
    if (kart.driftArmed) updateHop(kart, controls, dt)
    else if (kart.hop > 0) kart.hop = Math.max(0, kart.hop - dt)
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
