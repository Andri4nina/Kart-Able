import { SHRINK } from '../../config/items'
import { OVER_SPEED_DRAG } from '../../config/kartTuning'

// Vitesse le long de la direction de conduite (calcul pur), commune à la conduite normale
// (kartPhysics.js) et au drift (kartDriftMotion.js).

// Vitesse permise : stats, rythme, surface (hors-piste), orage (SHRINK.speed), turbo.
export function topSpeed(kart) {
  const boosting = kart.boost > 0
  const surface = kart.offRoad && !boosting ? kart.stats.offRoad : 1
  const small = kart.shrink > 0 ? SHRINK.speed : 1
  return kart.stats.maxSpeed * kart.topFactor * surface * small * (boosting ? kart.boostSpeed : 1)
}

export function updateForward(kart, controls, forward, dt) {
  const { stats } = kart
  const boosting = kart.boost > 0
  const top = topSpeed(kart)
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
