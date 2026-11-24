// Plans d'eau elliptiques des circuits (calcul pur).

// Distance signée entre le bord d'une ellipse (lac) et un point (négative dans l'eau) : approximation
// suffisante pour les marges et la chute dans l'eau (rayon local de l'ellipse vers le point).
export function distanceToLakeEdge(lake, x, z) {
  const dx = x - lake.x
  const dz = z - lake.z
  const cos = Math.cos(-lake.angle)
  const sin = Math.sin(-lake.angle)
  const lx = dx * cos - dz * sin
  const lz = dx * sin + dz * cos
  const angle = Math.atan2(lz / lake.rz, lx / lake.rx)
  const edge = Math.hypot(lake.rx * Math.cos(angle), lake.rz * Math.sin(angle))
  return Math.hypot(lx, lz) - edge
}
