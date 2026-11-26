import { MathUtils } from 'three'
import { SPINOUT } from '../../config/items'
import { DRIFT } from '../../config/kartTuning'
import { RACE } from '../../config/race'

// Attitude d'un kart à l'écran, lue dans l'état de la course (aucune allocation) :
// - hauteur et tangage sur le relief ; saut du drift (parabole, écrasement à l'atterrissage),
//   glisse du corps vers l'intérieur pendant le dérapage, selon le braquage ;
// - roulis vers l'extérieur du virage, nez qui se lève sous turbo ;
// - secousse après un choc, tête-à-queue (deux tours) après un objet, enfoncement dans l'eau ;
// - pilote : penché dans le virage, petite vibration moteur, gestes (driverRig) : volant,
//   bras écartés sur un choc, bras levés à l'arrivée.
// En mouvement réduit : ni secousse ni vibration (saut et glisse restent : c'est de l'information).
const SINK_DEPTH = 1.6
const ROLL = 0.07
const DRIFT_ROLL = 0.13
const DRIVER_LEAN = 0.12
const BOOST_PITCH = -0.05

export function writeKartPose(kart, delta, reducedMotion, visual, { root, body, driver, input }) {
  const sunk = kart.sinking > 0 ? SINK_DEPTH * (1 - kart.sinking / RACE.respawnDelay) : 0
  root.position.set(kart.x, kart.y - sunk, kart.z)
  // Lacet puis tangage (pente du relief : nez levé en montée), ordre YXZ.
  visual.pitch = MathUtils.damp(visual.pitch, kart.airborne ? visual.pitch : -Math.atan(kart.slope), 10, delta)
  root.rotation.order = 'YXZ'
  root.rotation.set(visual.pitch, kart.yaw, 0)

  const turning = kart.driftDir || kart.controls.steer
  const rate = reducedMotion ? 30 : DRIFT.slipRate
  // Glisse du corps : plus profonde en braquant vers l'intérieur du drift, moindre dehors.
  const inward = kart.driftDir ? kart.controls.steer * kart.driftDir : 0
  const slipAngle = inward >= 0 ? DRIFT.slipAngle + (DRIFT.slipInside - DRIFT.slipAngle) * inward : DRIFT.slipAngle + (DRIFT.slipAngle - DRIFT.slipOutside) * inward
  visual.slip = MathUtils.damp(visual.slip, -kart.driftDir * slipAngle, rate, delta)
  // Roulis : vers l'extérieur du virage, plus marqué en drift (le kart s'appuie sur ses roues).
  const lean = kart.driftDir ? DRIFT_ROLL : ROLL
  visual.roll = MathUtils.damp(visual.roll, -turning * lean * Math.min(1, Math.abs(kart.speed) / 15), 8, delta)
  visual.phase += delta * (20 + Math.abs(kart.speed))

  const hopT = kart.hop > 0 ? 1 - kart.hop / DRIFT.hopTime : 0
  const hopY = kart.hop > 0 ? 4 * hopT * (1 - hopT) * DRIFT.hopHeight : 0
  // Atterrissage : petit écrasement qui rebondit (ressorts du kart).
  if (visual.hopping && kart.hop === 0) visual.land = 1
  visual.hopping = kart.hop > 0
  visual.land = Math.max(0, visual.land - delta * 6)
  const squash = reducedMotion ? 0 : Math.sin(visual.land * Math.PI) * 0.09
  const shake = reducedMotion ? 0 : kart.bump * 0.35
  body.position.y = hopY
  body.scale.set(1 + squash * 0.5, 1 - squash, 1 + squash * 0.5)
  // Drift : le kart vibre légèrement sur ses pneus (petite trépidation, pas en mouvement réduit).
  const chatter = kart.driftDir && !reducedMotion ? Math.sin(visual.phase * 3.1) * 0.012 : 0
  body.rotation.set(
    (kart.boost > 0 ? BOOST_PITCH : 0) + Math.sin(visual.phase * 2.3) * shake * 0.3 + chatter,
    visual.slip + Math.sin(visual.phase * 1.7) * shake * 0.4 + (kart.spin > 0 ? (1 - kart.spin / SPINOUT.duration) * Math.PI * 4 : 0),
    visual.roll + Math.sin(visual.phase * 2.9) * shake * 0.3,
  )

  // Pilote : penché vers l'intérieur (contre le roulis du kart), vibration à l'arrêt moteur tournant.
  const idle = reducedMotion ? 0 : Math.sin(visual.phase * 1.3) * 0.006
  driver.rotation.z = turning * DRIVER_LEAN * (kart.driftDir ? 1 : 0.5) - visual.roll
  driver.position.y += idle - visual.idle
  visual.idle = idle

  input.steer = kart.finished ? 0 : kart.driftDir ? kart.driftDir * 0.6 + kart.controls.steer * 0.4 : kart.controls.steer
  input.panic = kart.bump > 0.12 || kart.spin > 0 ? 1 : 0
  input.cheer = kart.finished || kart.trick > 0 ? 1 : 0
}
