import { useLayoutEffect, useMemo, useRef } from 'react'
import { BoxGeometry, Color, Matrix4, MeshStandardMaterial, Quaternion, Vector3 } from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { PALETTE } from '../World/palette'
import { placeBarriers } from './barrierPlacement'

// Limites visibles du circuit (barrierPlacement.js), en deux maillages instanciés : murets
// rouge et blanc anti-raccourci, clôture basse (poteau et deux lisses) au bout du hors-piste.
// Elles coïncident avec les limites de la course (game/race/trackTracking.js applyFence).
const WALL_GEOMETRY = new BoxGeometry(0.5, 0.95, 2.05).translate(0, 0.47, 0)
const FENCE_GEOMETRY = mergeGeometries([
  new BoxGeometry(0.14, 1.1, 0.14).translate(0, 0.55, 0),
  new BoxGeometry(0.06, 0.1, 3.25).translate(0, 0.85, 0),
  new BoxGeometry(0.06, 0.1, 3.25).translate(0, 0.45, 0),
])
const WALL_MATERIAL = new MeshStandardMaterial({ roughness: 0.6 })
const FENCE_MATERIAL = new MeshStandardMaterial({ color: '#f2efe6', roughness: 0.8 })
const WALL_COLORS = [new Color(PALETTE.red), new Color(PALETTE.white)]

const matrix = new Matrix4()
const position = new Vector3()
const rotation = new Quaternion()
const ONE = new Vector3(1, 1, 1)
const UP = new Vector3(0, 1, 0)

function Pieces({ name, geometry, material, pieces, colors }) {
  const meshRef = useRef(null)
  useLayoutEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    pieces.forEach((piece, index) => {
      mesh.setMatrixAt(index, matrix.compose(position.set(piece.x, piece.y, piece.z), rotation.setFromAxisAngle(UP, piece.yaw), ONE))
      if (colors) mesh.setColorAt(index, colors[piece.color])
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    mesh.computeBoundingSphere()
  }, [pieces, colors])
  if (!pieces.length) return null
  return <instancedMesh ref={meshRef} name={name} args={[geometry, material, pieces.length]} castShadow receiveShadow />
}

export function TrackBarriers({ geometry }) {
  const { walls, posts } = useMemo(() => placeBarriers(geometry), [geometry])
  return (
    <group name="track-barriers">
      <Pieces key={`walls-${walls.length}`} name="shortcut-walls" geometry={WALL_GEOMETRY} material={WALL_MATERIAL} pieces={walls} colors={WALL_COLORS} />
      <Pieces key={`posts-${posts.length}`} name="offroad-fence" geometry={FENCE_GEOMETRY} material={FENCE_MATERIAL} pieces={posts} />
    </group>
  )
}
