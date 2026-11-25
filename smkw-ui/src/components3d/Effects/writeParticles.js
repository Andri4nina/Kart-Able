import { Color, Matrix4, Quaternion, Vector3 } from 'three'

// Écrit une réserve de particules dans un InstancedMesh (aucune allocation) :
// - 'glow'  (mélange additif) : la couleur s'éteint avec l'âge, la taille reste ;
// - 'puff'  (fumée, gerbes) : la taille évolue de size à size * grow puis disparaît ;
// - `stretch` : la particule s'allonge dans le sens de sa vitesse (étincelles).
const matrix = new Matrix4()
const position = new Vector3()
const rotation = new Quaternion()
const scale = new Vector3()
const direction = new Vector3()
const color = new Color()
const AXIS = new Vector3(0, 0, 1)
const IDENTITY = new Quaternion()

export function writeParticles(mesh, pool, mode, stretch = 0) {
  for (let i = 0; i < pool.capacity; i += 1) {
    const t = pool.life[i] > 0 ? pool.age[i] / pool.life[i] : 1
    if (t >= 1) {
      // Particule éteinte : cachée une seule fois, puis ignorée.
      if (pool.hidden[i]) continue
      pool.hidden[i] = 1
      scale.setScalar(0)
      position.set(0, -1000, 0)
      matrix.compose(position, IDENTITY, scale)
      mesh.setMatrixAt(i, matrix)
      continue
    }
    pool.hidden[i] = 0
    position.set(pool.x[i], pool.y[i], pool.z[i])
    const size = pool.size[i] * (1 + (pool.grow[i] - 1) * t) * (mode === 'puff' ? 1 - t * t : 1)
    if (stretch > 0) {
      direction.set(pool.vx[i], pool.vy[i], pool.vz[i])
      const speed = direction.length()
      rotation.setFromUnitVectors(AXIS, speed > 1e-3 ? direction.divideScalar(speed) : AXIS)
      scale.set(size, size, size * (1 + speed * stretch))
    } else {
      rotation.copy(IDENTITY)
      scale.setScalar(size)
    }
    matrix.compose(position, rotation, scale)
    mesh.setMatrixAt(i, matrix)
    const fade = mode === 'glow' ? 1 - t : 1
    color.setRGB(pool.r[i] * fade, pool.g[i] * fade, pool.b[i] * fade)
    mesh.setColorAt(i, color)
  }
  mesh.instanceMatrix.needsUpdate = true
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
}
