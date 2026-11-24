// Géométrie des capsules de kart (calcul pur, aucune allocation) : voir kartCollisions.js.
const clamp01 = (value) => Math.min(1, Math.max(0, value))

// Points les plus proches entre les segments avant-arrière de deux karts (demi-longueur `h`),
// écrits dans `out` { ax, az, bx, bz }.
export function closestCapsulePoints(a, b, h, out) {
  const ux = Math.sin(a.yaw) * h
  const uz = Math.cos(a.yaw) * h
  const vx = Math.sin(b.yaw) * h
  const vz = Math.cos(b.yaw) * h
  // Segments a0 + s * d1 et b0 + t * d2, s et t dans 0..1.
  const a0x = a.x - ux
  const a0z = a.z - uz
  const b0x = b.x - vx
  const b0z = b.z - vz
  const d1x = ux * 2
  const d1z = uz * 2
  const d2x = vx * 2
  const d2z = vz * 2
  const rx = a0x - b0x
  const rz = a0z - b0z
  const aa = d1x * d1x + d1z * d1z
  const ee = d2x * d2x + d2z * d2z
  const ff = d2x * rx + d2z * rz
  const cc = d1x * rx + d1z * rz
  const bb = d1x * d2x + d1z * d2z
  const denominator = aa * ee - bb * bb
  let s = denominator > 1e-8 ? clamp01((bb * ff - cc * ee) / denominator) : 0
  let t = (bb * s + ff) / ee
  if (t < 0) {
    t = 0
    s = clamp01(-cc / aa)
  } else if (t > 1) {
    t = 1
    s = clamp01((bb - cc) / aa)
  }
  out.ax = a0x + d1x * s
  out.az = a0z + d1z * s
  out.bx = b0x + d2x * t
  out.bz = b0z + d2z * t
}
