import { forwardRef, useEffect, useMemo } from 'react'
import { BoxGeometry, BufferAttribute, BufferGeometry, CylinderGeometry, DoubleSide, MeshStandardMaterial } from 'three'

// Deltaplane d'un kart : aile delta à la couleur du personnage, armature sombre, deux haubans
// vers le kart. Replié (échelle 0) hors vol ; déployé par kartAirPose.js.
function sailGeometry() {
  // Nez, bout d'aile gauche, queue, bout d'aile droit (repère du kart, avant = +Z).
  const nose = [0, 0.05, 1.2]
  const left = [-1.8, -0.2, -0.7]
  const tail = [0, 0.12, -0.35]
  const right = [1.8, -0.2, -0.7]
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(new Float32Array([...nose, ...left, ...tail, ...nose, ...tail, ...right]), 3))
  geometry.computeVertexNormals()
  return geometry
}

const SAIL = sailGeometry()
const KEEL = new BoxGeometry(0.07, 0.07, 1.7).translate(0, 0.02, 0.35)
const SPAR = new BoxGeometry(3.1, 0.06, 0.06).translate(0, -0.08, -0.35)
const STRUT = new CylinderGeometry(0.025, 0.025, 1.25, 5).translate(0, -0.62, 0)
const FRAME = new MeshStandardMaterial({ color: '#2a2e36', roughness: 0.5, metalness: 0.4 })

export const KartGlider = forwardRef(function KartGlider({ color }, ref) {
  const sail = useMemo(() => new MeshStandardMaterial({ color, side: DoubleSide, roughness: 0.7 }), [color])
  useEffect(() => () => sail.dispose(), [sail])
  return (
    <group ref={ref} name="kart-glider" position={[0, 2.1, -0.1]} scale={0} visible={false}>
      <mesh geometry={SAIL} material={sail} castShadow />
      <mesh geometry={KEEL} material={FRAME} />
      <mesh geometry={SPAR} material={FRAME} />
      <mesh geometry={STRUT} material={FRAME} position={[-0.55, -0.05, -0.3]} rotation-z={-0.35} />
      <mesh geometry={STRUT} material={FRAME} position={[0.55, -0.05, -0.3]} rotation-z={0.35} />
    </group>
  )
})
