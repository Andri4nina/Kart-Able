import { GLIDE } from '../../config/airTuning'
import { SHRINK } from '../../config/items'
import { COLLISION, OVER_SPEED_DRAG, STAT_CURVES } from '../../config/kartTuning'
import { tickBoost } from './kartBoost'
import { driftTurnRate, updateDrift } from './kartDrift'

// Conduite arcade d'un kart sur le plan du sol (calcul pur, pas fixe `dt`).
// Repère : avant = (sin yaw, cos yaw), droite = (-cos yaw, sin yaw) ; braquer à droite
// (steer > 0) fait décroître yaw. La vitesse est un vecteur monde : en tournant, sa part
// latérale est amortie par l'adhérence (glisse en drift, adhérence faible).
// Réglages : config/kartTuning.js ; dérapage : kartDrift.js ; turbo : kartBoost.js.
//
// `controls` : { throttle 0..1, brake 0..1, steer -1..1, drift bool }.
export { getDriftTier } from './kartDrift'

function steerRate(kart, controls, forward) {
  const { stats } = kart
  if (kart.driftDir) return driftTurnRate(kart, controls)
  const speed = Math.abs(forward)
  // À l'arrêt on ne tourne pas ; à pleine vitesse on tourne un peu moins vite. En l'air (saut
  // du drift), le braquage reste possible mais réduit.
  const grip = Math.min(1, speed / 5) * (1 - 0.25 * Math.min(1, speed / stats.maxSpeed))
  const air = kart.gliding ? GLIDE.steer : kart.hop > 0 || kart.airborne ? 0.6 : 1
  // Secousse après un choc : le braquage ne répond qu'en partie.
  const wobble = kart.bump > 0 ? COLLISION.wobbleSteer : 1
  return controls.steer * stats.turnRate * grip * air * wobble * (forward < 0 ? -1 : 1)
}

function updateForward(kart, controls, forward, dt) {
  const { stats } = kart
  const boosting = kart.boost > 0
  const surface = kart.offRoad && !boosting ? stats.offRoad : 1
  // Kart réduit par l'orage : moins rapide (SHRINK.speed).
  const small = kart.shrink > 0 ? SHRINK.speed : 1
  const top = stats.maxSpeed * kart.topFactor * surface * small * (boosting ? kart.boostSpeed : 1)
  let next = forward
  // Un turbo pousse même sans accélérer.
  const throttle = boosting ? Math.max(controls.throttle, 1) : controls.throttle
  if (throttle > 0) {
    const falloff = 1 - 0.6 * Math.max(0, next) / top
    next += stats.acceleration * (boosting ? kart.boostAccel : 1) * falloff * throttle * dt
  }
  if (controls.brake > 0 && !boosting) {
    if (next > 0.5) next -= stats.brake * controls.brake * dt
    else next = Math.max(-stats.reverseSpeed, next - stats.acceleration * 0.5 * controls.brake * dt)
  }
  if (throttle === 0 && controls.brake === 0) next -= Math.sign(next) * Math.min(Math.abs(next), stats.coast * dt)
  if (next > top) next = Math.max(top, next - OVER_SPEED_DRAG * dt)
  return next
}

// Fait tourner le vecteur vitesse avec le kart (part `carry` de la rotation `turn`).
function carryVelocity(kart, turn) {
  const carry = kart.gliding ? STAT_CURVES.carry : kart.hop > 0 || kart.airborne ? STAT_CURVES.carryAir : kart.driftDir ? STAT_CURVES.carryDrift : STAT_CURVES.carry
  const angle = turn * carry
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  const vx = kart.vx
  kart.vx = vx * cos + kart.vz * sin
  kart.vz = -vx * sin + kart.vz * cos
}

export function stepKartPhysics(kart, controls, dt) {
  updateDrift(kart, controls, dt)
  const turn = -steerRate(kart, controls, kart.speed) * dt
  kart.yaw += turn
  carryVelocity(kart, turn)

  const forwardX = Math.sin(kart.yaw)
  const forwardZ = Math.cos(kart.yaw)
  const forward = kart.vx * forwardX + kart.vz * forwardZ
  const loose = (kart.hop > 0 || kart.airborne) && !kart.gliding
  const sideGrip = kart.driftDir ? kart.stats.driftGrip : loose ? kart.stats.grip * 0.5 : kart.stats.grip
  const side = (kart.vx * -forwardZ + kart.vz * forwardX) * Math.exp(-sideGrip * dt)
  const nextForward = updateForward(kart, controls, forward, dt)

  kart.vx = forwardX * nextForward - forwardZ * side
  kart.vz = forwardZ * nextForward + forwardX * side
  kart.x += kart.vx * dt
  kart.z += kart.vz * dt
  kart.speed = nextForward
  kart.bump = Math.max(0, kart.bump - dt)
  tickBoost(kart, dt)
}
