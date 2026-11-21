// Chocs entre karts (calcul pur) : chaque kart est un disque ; les karts qui se chevauchent
// sont écartés et échangent de la vitesse selon leur masse (un lourd pousse un léger).
const RADIUS = 0.95
const MIN_DISTANCE = RADIUS * 2
const BOUNCE = 0.35

function separate(a, b) {
  let dx = b.x - a.x
  let dz = b.z - a.z
  let distanceSquared = dx * dx + dz * dz
  if (distanceSquared >= MIN_DISTANCE * MIN_DISTANCE) return
  if (distanceSquared < 1e-8) {
    // Superposés : on les écarte sur le côté.
    dx = 0.01
    dz = 0
    distanceSquared = dx * dx
  }
  const distance = Math.sqrt(distanceSquared)
  const nx = dx / distance
  const nz = dz / distance
  const inverseA = 1 / a.stats.mass
  const inverseB = 1 / b.stats.mass
  const share = (MIN_DISTANCE - distance) / (inverseA + inverseB)
  a.x -= nx * share * inverseA
  a.z -= nz * share * inverseA
  b.x += nx * share * inverseB
  b.z += nz * share * inverseB

  const closing = (b.vx - a.vx) * nx + (b.vz - a.vz) * nz
  if (closing >= 0) return
  const impulse = (-(1 + BOUNCE) * closing) / (inverseA + inverseB)
  a.vx -= impulse * nx * inverseA
  a.vz -= impulse * nz * inverseA
  b.vx += impulse * nx * inverseB
  b.vz += impulse * nz * inverseB
}

export function resolveKartCollisions(karts) {
  for (let i = 0; i < karts.length; i += 1) {
    if (karts[i].sinking > 0) continue
    for (let j = i + 1; j < karts.length; j += 1) {
      if (karts[j].sinking <= 0) separate(karts[i], karts[j])
    }
  }
}
