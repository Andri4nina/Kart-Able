import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useRef } from 'react'
import { Color, Euler, Matrix4, Quaternion, Vector3 } from 'three'
import { getRace } from '../../game/race/raceSession'
import { getGroundHeight } from '../../game/track/trackHeight'

// Une famille d'objets en course dessinée en instances (un seul appel de rendu) : `pool` lit la
// liste dans le monde de course, `write(entry, time, out)` remplit { visible, y, yaw, tilt,
// scale, color? }. `colored` : une couleur par instance (out.color). Les instances inutilisées
// sont réduites à zéro. Aucune allocation par frame.
const matrix = new Matrix4()
const position = new Vector3()
const rotation = new Quaternion()
const euler = new Euler(0, 0, 0, 'YXZ')
const scale = new Vector3()
const white = new Color('#ffffff')
const pose = { visible: false, y: 0, yaw: 0, tilt: 0, scale: 1, color: new Color() }

export function ItemInstances({ name, geometry, material, capacity, pool, write, colored = false }) {
  const meshRef = useRef(null)

  // Couleur par instance créée avant le premier rendu (prise en compte par le shader).
  useLayoutEffect(() => {
    const mesh = meshRef.current
    if (colored && mesh) for (let i = 0; i < capacity; i += 1) mesh.setColorAt(i, white)
  }, [colored, capacity])

  useFrame(() => {
    const mesh = meshRef.current
    const world = getRace()
    if (!mesh) return
    const entries = world ? pool(world) : null
    for (let i = 0; i < capacity; i += 1) {
      const entry = entries?.[i]
      pose.visible = false
      pose.tilt = 0
      if (entry) write(entry, world.time, pose)
      if (pose.visible) {
        position.set(entry.x, getGroundHeight(world.geometry, entry.x, entry.z) + pose.y, entry.z)
        rotation.setFromEuler(euler.set(pose.tilt, pose.yaw, 0))
        scale.setScalar(pose.scale)
        if (colored) mesh.setColorAt(i, pose.color)
      } else {
        position.set(0, -1000, 0)
        scale.setScalar(0)
      }
      matrix.compose(position, rotation, scale)
      mesh.setMatrixAt(i, matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
    if (colored && mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  })

  return <instancedMesh ref={meshRef} name={name} args={[geometry, material, capacity]} frustumCulled={false} />
}
