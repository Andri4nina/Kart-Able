import { GLIDE } from '../../config/airTuning'
import { COLLISION, STAT_CURVES } from '../../config/kartTuning'
import { tickBoost } from './kartBoost'
import { updateDrift } from './kartDrift'
import { stepDriftMotion } from './kartDriftMotion'
import { updateForward } from './kartSpeed'

// Conduite arcade d'un kart sur le plan du sol (calcul pur, pas fixe `dt`).
// Repère : avant = (sin yaw, cos yaw), droite = (-cos yaw, sin yaw) ; braquer à droite
// (steer > 0) fait décroître yaw. La vitesse est un vecteur monde : en tournant, sa part
// latérale est amortie par l'adhérence.
// - conduite normale : ici (le kart tourne, la vitesse suit par l'adhérence) ;
// - drift : kartDriftMotion.js (rotation pilotée, vitesse qui suit par l'adhérence : glisse) ;
// - sortie de drift : l'angle de glisse restant (`slip`) se résorbe en douceur, la conduite
//   normale s'applique au cap de la trajectoire : ni à-coup, ni braquage coupé.
// Réglages : config/kartTuning.js, config/driftTuning.js ; turbo : kartBoost.js.
//
// `controls` : { throttle 0..1, brake 0..1, steer -1..1, drift bool }.
export { getDriftTier } from './kartDrift'

function steerRate(kart, controls, forward) {
  const { stats } = kart
  const speed = Math.abs(forward)
  // À l'arrêt on ne tourne pas ; à pleine vitesse on tourne un peu moins vite. En l'air (saut
  // du drift), le braquage reste possible mais réduit.
  const grip = Math.min(1, speed / 5) * (1 - 0.25 * Math.min(1, speed / stats.maxSpeed))
  const air = kart.gliding ? GLIDE.steer : kart.hop > 0 || kart.airborne ? 0.6 : 1
  // Secousse après un choc : le braquage ne répond qu'en partie.
  const wobble = kart.bump > 0 ? COLLISION.wobbleSteer : 1
  return controls.steer * stats.turnRate * grip * air * wobble * (forward < 0 ? -1 : 1)
}

// Fait tourner le vecteur vitesse avec le kart (part `carry` de la rotation `turn`).
function carryVelocity(kart, turn) {
  const carry = kart.gliding ? STAT_CURVES.carry : kart.hop > 0 || kart.airborne ? STAT_CURVES.carryAir : STAT_CURVES.carry
  const angle = turn * carry
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  const vx = kart.vx
  kart.vx = vx * cos + kart.vz * sin
  kart.vz = -vx * sin + kart.vz * cos
}

function stepGripMotion(kart, controls, dt) {
  kart.yawRate = steerRate(kart, controls, kart.speed)
  const turn = -kart.yawRate * dt
  kart.yaw += turn
  carryVelocity(kart, turn)
  const forwardX = Math.sin(kart.yaw)
  const forwardZ = Math.cos(kart.yaw)
  const forward = kart.vx * forwardX + kart.vz * forwardZ
  const loose = (kart.hop > 0 || kart.airborne) && !kart.gliding
  const sideGrip = loose ? kart.stats.grip * 0.5 : kart.stats.grip
  const side = (kart.vx * -forwardZ + kart.vz * forwardX) * Math.exp(-sideGrip * dt)
  const nextForward = updateForward(kart, controls, forward, dt)
  kart.vx = forwardX * nextForward - forwardZ * side
  kart.vz = forwardZ * nextForward + forwardX * side
  return nextForward
}

// Conduite normale sur le cap de la trajectoire (lacet sans l'angle de glisse), puis
// réalignement progressif du nez (driftRecover).
function stepRecovering(kart, controls, dt) {
  kart.yaw -= kart.slip
  const speed = stepGripMotion(kart, controls, dt)
  kart.slip = Math.abs(kart.slip) < 1e-3 ? 0 : kart.slip * Math.exp(-kart.stats.driftRecover * dt)
  kart.yaw += kart.slip
  return speed
}

export function stepKartPhysics(kart, controls, dt) {
  updateDrift(kart, controls, dt)
  const speed = kart.driftDir ? stepDriftMotion(kart, controls, dt) : stepRecovering(kart, controls, dt)
  kart.x += kart.vx * dt
  kart.z += kart.vz * dt
  kart.speed = speed
  kart.bump = Math.max(0, kart.bump - dt)
  tickBoost(kart, dt)
}
