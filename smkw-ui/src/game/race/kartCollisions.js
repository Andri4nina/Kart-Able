import { COLLISION } from '../../config/kartTuning'
import { closestCapsulePoints } from './kartCapsule'
import { cancelDrift } from './kartDrift'

// Chocs entre karts (calcul pur, aucune allocation). Chaque kart est une capsule alignée sur
// son axe (segment avant-arrière + rayon) : le contact suit la vraie silhouette du kart.
// Les karts qui se chevauchent sont écartés selon leur masse, rebondissent, et reçoivent une
// poussée latérale (knockback) : un lourd bouscule un léger. Un choc franc secoue le kart
// (braquage réduit un instant), lui fait perdre de la vitesse selon sa résistance et peut
// casser le drift d'un kart léger.
const MIN_DISTANCE = COLLISION.radius * 2
const closest = { ax: 0, az: 0, bx: 0, bz: 0 }

function bumpKart(kart, closing, otherMass) {
  kart.bump = COLLISION.bumpTime
  const keep = kart.stats.toughness + (1 - kart.stats.toughness) * Math.min(1, kart.stats.mass / otherMass)
  const factor = 0.88 + 0.12 * keep
  kart.vx *= factor
  kart.vz *= factor
  if (kart.driftDir && closing * (otherMass / kart.stats.mass) > COLLISION.driftBreak) cancelDrift(kart)
}

function separate(a, b) {
  closestCapsulePoints(a, b, COLLISION.halfLength, closest)
  let nx = closest.bx - closest.ax
  let nz = closest.bz - closest.az
  let distanceSquared = nx * nx + nz * nz
  if (distanceSquared >= MIN_DISTANCE * MIN_DISTANCE) return
  if (distanceSquared < 1e-8) {
    nx = -Math.cos(a.yaw) * 0.01
    nz = Math.sin(a.yaw) * 0.01
    distanceSquared = 1e-4
  }
  const distance = Math.sqrt(distanceSquared)
  nx /= distance
  nz /= distance
  const inverseA = 1 / a.stats.mass
  const inverseB = 1 / b.stats.mass
  const share = (MIN_DISTANCE - distance) / (inverseA + inverseB)
  a.x -= nx * share * inverseA
  a.z -= nz * share * inverseA
  b.x += nx * share * inverseB
  b.z += nz * share * inverseB

  const closing = -((b.vx - a.vx) * nx + (b.vz - a.vz) * nz)
  if (closing <= 0) return
  // Rebond et poussée seulement pour la part latérale du choc : un choc par l'arrière égalise
  // les vitesses (inélastique), il ne propulse pas le kart percuté.
  const lateral = Math.abs(nx * Math.cos(a.yaw) - nz * Math.sin(a.yaw))
  const impulse = ((1 + (COLLISION.bounce + COLLISION.knockback) * lateral) * closing) / (inverseA + inverseB)
  a.vx -= impulse * nx * inverseA
  a.vz -= impulse * nz * inverseA
  b.vx += impulse * nx * inverseB
  b.vz += impulse * nz * inverseB
  if (closing < COLLISION.bumpSpeed) return
  bumpKart(a, closing, b.stats.mass)
  bumpKart(b, closing, a.stats.mass)
  a.hits += 1
  b.hits += 1
}

export function resolveKartCollisions(karts) {
  for (let i = 0; i < karts.length; i += 1) {
    const a = karts[i]
    if (a.sinking > 0) continue
    for (let j = i + 1; j < karts.length; j += 1) {
      const b = karts[j]
      if (b.sinking > 0) continue
      // Test grossier avant les capsules (karts éloignés : rien à faire).
      const dx = b.x - a.x
      const dz = b.z - a.z
      const reach = MIN_DISTANCE + COLLISION.halfLength * 2
      if (dx * dx + dz * dz < reach * reach) separate(a, b)
    }
  }
}
