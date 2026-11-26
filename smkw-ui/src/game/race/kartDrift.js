import { DRIFT } from '../../config/driftTuning'
import { startTrick } from './kartAir'
import { applyBoost } from './kartBoost'
import { chargeRate, driftInward } from './kartDriftRates'

// Dérapage manuel façon kart arcade : états et charge (calcul pur, aucune allocation ; réglages
// config/driftTuning.js ; mouvement : kartDriftMotion.js). États :
// - conduite normale : driftDir 0 (sortie de drift : `slip` se résorbe, kartPhysics.js) ;
// - entrée : appui sur Drift en roulant = petit saut ; le sens braqué (dès l'appui, pendant le
//   saut ou ensuite, Drift tenu) lance le drift et ne change plus ;
// - drift : la jauge charge au sol, paliers bleu puis orange (driftTier) ;
// - relâchement : mini-turbo du palier atteint, aussitôt. Freiner, trop ralentir, s'envoler en
//   deltaplane ou un choc fort l'annulent sans turbo.

export function getDriftTier(charge) {
  let tier = 0
  for (const step of DRIFT.tiers) if (charge >= step.charge) tier += 1
  return tier
}

// Fraction 0..1 de la jauge vers le dernier palier (affichage).
export function getDriftGauge(charge) {
  const last = DRIFT.tiers[DRIFT.tiers.length - 1].charge
  return Math.min(1, charge / last)
}

// Fin du drift. L'angle de glisse (slip) est gardé : il se résorbe en douceur (kartPhysics.js).
export function cancelDrift(kart) {
  kart.driftDir = 0
  kart.driftCharge = 0
  kart.driftTier = 0
  kart.driftArmed = false
}

function startDrift(kart, dir, controls) {
  kart.driftDir = dir
  kart.driftTime = 0
  kart.driftCharge = 0
  kart.driftTier = 0
  kart.driftArmed = false
  kart.driftSteer = controls.steer
}

const steerSide = (controls) => (Math.abs(controls.steer) >= DRIFT.steerThreshold ? Math.sign(controls.steer) : 0)
const fastEnough = (kart, share) => kart.speed > kart.stats.maxSpeed * share

export function updateDrift(kart, controls, dt) {
  const pressed = controls.drift && !kart.driftHeld
  kart.driftHeld = controls.drift
  // En l'air juste après un décollage : l'appui fait une figure (kartAir.js), pas un saut.
  if (pressed && kart.trickWindow > 0 && !kart.trickPending) {
    startTrick(kart)
    return
  }
  if (kart.hop > 0) kart.hop = Math.max(0, kart.hop - dt)
  if (pressed && !kart.driftDir && kart.hop === 0 && !kart.airborne && !kart.gliding && fastEnough(kart, DRIFT.startSpeed)) {
    kart.hop = DRIFT.hopTime
    kart.driftArmed = true
  }
  if (!kart.driftDir) {
    if (!controls.drift) kart.driftArmed = false
    const side = kart.driftArmed ? steerSide(controls) : 0
    if (side && !kart.airborne && fastEnough(kart, DRIFT.minSpeed)) startDrift(kart, side, controls)
    return
  }
  if (controls.brake > 0.5 || kart.gliding || !fastEnough(kart, DRIFT.cancelSpeed)) {
    cancelDrift(kart)
    return
  }
  if (controls.drift) {
    kart.driftTime += dt
    // La charge commence à l'atterrissage du saut, au sol seulement.
    if (kart.hop === 0 && !kart.airborne) kart.driftCharge += dt * chargeRate(kart, driftInward(kart))
    kart.driftTier = getDriftTier(kart.driftCharge)
    return
  }
  // Relâché : mini-turbo du palier atteint, sans délai.
  if (kart.driftTier > 0) applyBoost(kart, DRIFT.tiers[kart.driftTier - 1].boost)
  cancelDrift(kart)
}
