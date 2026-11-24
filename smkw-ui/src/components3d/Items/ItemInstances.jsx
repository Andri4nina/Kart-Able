import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { Matrix4, Quaternion, Vector3 } from 'three'
import { getRace } from '../../game/race/raceSession'
import { getGroundHeight } from '../../game/track/trackHeight'

// Une famille d'objets en course dessinée en instances (un seul appel de rendu) : `pool` lit la
// liste dans le monde de course, `write(entry, time, out)` remplit { visible, y, yaw, scale }.
// Les instances inutilisées sont réduites à zéro. Aucune allocation par frame.
const matrix = new Matrix4()
const position = new Vector3()
const rotation = new Quaternion()
const scale = new Vector3()
const UP = new Vector3(0, 1, 0)
const pose = { visible: false, y: 0, yaw: 0, scale: 1 }

export function ItemInstances({ name, geometry, material, capacity, pool, write }) {
  const meshRef = useRef(null)

  useFrame(() => {
    const mesh = meshRef.current
    const world = getRace()
    if (!mesh) return
    const entries = world ? pool(world) : null
    for (let i = 0; i < capacity; i += 1) {
      const entry = entries?.[i]
      pose.visible = false
      if (entry) write(entry, world.time, pose)
      if (pose.visible) {
        position.set(entry.x, getGroundHeight(world.geometry, entry.x, entry.z, entry.index) + pose.y, entry.z)
        rotation.setFromAxisAngle(UP, pose.yaw)
        scale.setScalar(pose.scale)
      } else {
        position.set(0, -1000, 0)
        scale.setScalar(0)
      }
      matrix.compose(position, rotation, scale)
      mesh.setMatrixAt(i, matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  })

  return <instancedMesh ref={meshRef} name={name} args={[geometry, material, capacity]} frustumCulled={false} />
}
