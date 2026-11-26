import { Color, Matrix4, Quaternion, Vector3 } from 'three'

// Traînées posées au sol (calcul pur, tableaux typés, aucune allocation après création) :
// segments plats orientés (marques de pneus, traînées lumineuses du drift). Anneau de
// `capacity` segments, le plus ancien est réutilisé. Chaque segment : centre, cap, longueur,
// largeur, durée de vie, couleur.
export function createTrailPool(capacity) {
  const floats = () => new Float32Array(capacity)
  return {
    capacity,
    next: 0,
    x: floats(), y: floats(), z: floats(), yaw: floats(), length: floats(), width: floats(),
    age: floats(), life: floats(), r: floats(), g: floats(), b: floats(),
    hidden: new Uint8Array(capacity),
  }
}

// Segment du point (ax, az) au point (bx, bz), à la hauteur y.
export function emitTrail(pool, ax, az, bx, bz, y, width, life, color) {
  const i = pool.next
  pool.next = (i + 1) % pool.capacity
  const dx = bx - ax
  const dz = bz - az
  pool.x[i] = (ax + bx) / 2
  pool.y[i] = y
  pool.z[i] = (az + bz) / 2
  pool.yaw[i] = Math.atan2(dx, dz)
  pool.length[i] = Math.hypot(dx, dz) + 0.06
  pool.width[i] = width
  pool.age[i] = 0
  pool.life[i] = life
  pool.r[i] = color.r
  pool.g[i] = color.g
  pool.b[i] = color.b
}

export function updateTrailPool(pool, dt) {
  for (let i = 0; i < pool.capacity; i += 1) if (pool.age[i] < pool.life[i]) pool.age[i] += dt
}

export function clearTrailPool(pool) {
  pool.age.fill(0)
  pool.life.fill(0)
}

const matrix = new Matrix4()
const position = new Vector3()
const rotation = new Quaternion()
const scale = new Vector3()
const color = new Color()
const UP = new Vector3(0, 1, 0)

// Écrit les segments dans un InstancedMesh (plan unité couché, long selon Z). 'skid' : la marque
// s'amincit puis disparaît ; 'glow' (additif) : la couleur s'éteint.
export function writeTrails(mesh, pool, mode) {
  for (let i = 0; i < pool.capacity; i += 1) {
    const t = pool.life[i] > 0 ? pool.age[i] / pool.life[i] : 1
    if (t >= 1) {
      if (pool.hidden[i]) continue
      pool.hidden[i] = 1
      position.set(0, -1000, 0)
      scale.setScalar(0)
      mesh.setMatrixAt(i, matrix.compose(position, rotation.identity(), scale))
      continue
    }
    pool.hidden[i] = 0
    position.set(pool.x[i], pool.y[i], pool.z[i])
    rotation.setFromAxisAngle(UP, pool.yaw[i])
    scale.set(pool.width[i] * (mode === 'skid' ? 1 - t * t : 1 - t * 0.5), 1, pool.length[i])
    mesh.setMatrixAt(i, matrix.compose(position, rotation, scale))
    const fade = mode === 'glow' ? 1 - t : 1
    mesh.setColorAt(i, color.setRGB(pool.r[i] * fade, pool.g[i] * fade, pool.b[i] * fade))
  }
  mesh.instanceMatrix.needsUpdate = true
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
}
