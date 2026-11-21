// Conduite arcade d'un kart sur le plan du sol (calcul pur, pas fixe `dt`).
// Repère : avant = (sin yaw, cos yaw), droite = (-cos yaw, sin yaw) ; braquer à droite
// (steer > 0) fait décroître yaw. La vitesse est un vecteur monde : en tournant, sa part
// latérale est amortie par l'adhérence (glisse en drift, adhérence faible).
//
// `controls` : { throttle 0..1, brake 0..1, steer -1..1, drift bool }.

const BOOST_SPEED = 1.3
const BOOST_ACCELERATION = 2
const OVER_SPEED_DRAG = 22 // m/s² pour revenir à la vitesse maximale (hors-piste, fin de turbo)
const DRIFT_MIN_SPEED = 0.45 // fraction de la vitesse maximale pour lancer un drift
// Paliers de charge du drift (secondes chargées) et durée du turbo obtenu.
export const DRIFT_TIERS = Object.freeze([
  { charge: 1, boost: 0.55 },
  { charge: 2.1, boost: 1.1 },
])

export function getDriftTier(charge) {
  let tier = 0
  for (const step of DRIFT_TIERS) if (charge >= step.charge) tier += 1
  return tier
}

function steerRate(kart, controls, forward) {
  const { stats } = kart
  const speed = Math.abs(forward)
  // À l'arrêt on ne tourne pas ; à pleine vitesse on tourne un peu moins vite.
  const grip = Math.min(1, speed / 5) * (1 - 0.3 * Math.min(1, speed / stats.maxSpeed))
  if (!kart.driftDir) return controls.steer * stats.turnRate * grip * (forward < 0 ? -1 : 1)
  // En drift : on tourne toujours du côté du drift, plus ou moins serré selon la direction.
  return kart.driftDir * stats.turnRate * (0.95 + 0.45 * controls.steer * kart.driftDir)
}

function updateDrift(kart, controls, forward, dt) {
  const { stats } = kart
  if (!kart.driftDir) {
    if (controls.drift && Math.abs(controls.steer) > 0.3 && forward > stats.maxSpeed * DRIFT_MIN_SPEED) {
      kart.driftDir = Math.sign(controls.steer)
      kart.driftCharge = 0
    }
    return
  }
  if (controls.drift && forward > stats.maxSpeed * 0.3) {
    kart.driftCharge += dt * stats.driftCharge * (0.6 + 0.4 * Math.abs(controls.steer))
    return
  }
  // Drift relâché : turbo selon le palier atteint.
  const tier = getDriftTier(kart.driftCharge)
  if (tier > 0) kart.boost = Math.max(kart.boost, DRIFT_TIERS[tier - 1].boost)
  kart.driftDir = 0
  kart.driftCharge = 0
}

function updateForward(kart, controls, forward, dt) {
  const { stats } = kart
  const boosting = kart.boost > 0
  const surface = kart.offRoad && !boosting ? stats.offRoad : 1
  const top = stats.maxSpeed * kart.topFactor * surface * (boosting ? BOOST_SPEED : 1)
  let next = forward
  if (controls.throttle > 0) {
    const falloff = 1 - 0.55 * Math.max(0, next) / top
    next += stats.acceleration * (boosting ? BOOST_ACCELERATION : 1) * falloff * controls.throttle * dt
  }
  if (controls.brake > 0) {
    if (next > 0.5) next -= stats.brake * controls.brake * dt
    else next = Math.max(-stats.reverseSpeed, next - stats.acceleration * 0.5 * controls.brake * dt)
  }
  if (controls.throttle === 0 && controls.brake === 0) next -= Math.sign(next) * Math.min(Math.abs(next), stats.coast * dt)
  if (next > top) next = Math.max(top, next - OVER_SPEED_DRAG * dt)
  return next
}

export function stepKartPhysics(kart, controls, dt) {
  updateDrift(kart, controls, kart.speed, dt)
  kart.yaw -= steerRate(kart, controls, kart.speed) * dt

  const forwardX = Math.sin(kart.yaw)
  const forwardZ = Math.cos(kart.yaw)
  const forward = kart.vx * forwardX + kart.vz * forwardZ
  const side = (kart.vx * -forwardZ + kart.vz * forwardX) * Math.exp(-(kart.driftDir ? kart.stats.driftGrip : kart.stats.grip) * dt)
  const nextForward = updateForward(kart, controls, forward, dt)

  kart.vx = forwardX * nextForward - forwardZ * side
  kart.vz = forwardZ * nextForward + forwardX * side
  kart.x += kart.vx * dt
  kart.z += kart.vz * dt
  kart.speed = nextForward
  kart.boost = Math.max(0, kart.boost - dt)
}
