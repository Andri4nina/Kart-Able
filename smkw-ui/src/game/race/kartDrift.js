import { DRIFT } from '../../config/kartTuning'
import { applyBoost } from './kartBoost'
import { chargeQuality } from './kartDriftRates'

export { driftTurnRate } from './kartDriftRates'

// Dérapage manuel façon kart classique (calcul pur, aucune allocation ; règles : DRIFT dans
// config/kartTuning.js). Appui = saut ; le sens braqué pendant le saut (ou dans `landGrace`
// après) fixe le drift ; relâcher = mini-turbo du palier atteint. Freiner, ralentir ou un choc
// fort l'annulent (relâcher puis réappuyer pour en relancer un).
// État : hop, driftPick (sens choisi en l'air), driftGrace, driftArmed, driftDir, driftCharge,
// driftTier.

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
  kart.driftGrace = 0
}

function startDrift(kart, dir) {
  kart.driftDir = dir
  kart.driftCharge = 0
  kart.driftTier = 0
  kart.driftArmed = false
  kart.driftPick = 0
  kart.driftGrace = 0
  // Petite poussée vers l'extérieur du virage : le kart « décroche » en entrant en drift.
  const kick = kart.speed * DRIFT.entryKick * dir
  kart.vx += Math.cos(kart.yaw) * kick
  kart.vz -= Math.sin(kart.yaw) * kick
}

const steerSide = (controls) => (Math.abs(controls.steer) >= DRIFT.steerThreshold ? Math.sign(controls.steer) : 0)

// Saut en cours ou tout juste posé : choix du sens.
function updateHop(kart, controls, dt) {
  if (kart.hop > 0) {
    const side = steerSide(controls)
    if (side) kart.driftPick = side
    kart.hop = Math.max(0, kart.hop - dt)
    if (kart.hop === 0) kart.driftGrace = DRIFT.landGrace
    return
  }
  if (kart.airborne) return
  const fastEnough = kart.speed > kart.stats.maxSpeed * DRIFT.minSpeed
  const side = kart.driftPick || steerSide(controls)
  if (side && fastEnough) {
    startDrift(kart, side)
    return
  }
  kart.driftGrace = Math.max(0, kart.driftGrace - dt)
  if (kart.driftGrace === 0) kart.driftArmed = false
}

export function updateDrift(kart, controls, dt) {
  const pressed = controls.drift && !kart.driftHeld
  kart.driftHeld = controls.drift
  if (pressed && !kart.driftDir && kart.hop === 0 && !kart.airborne && kart.speed > kart.stats.maxSpeed * 0.15) {
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
