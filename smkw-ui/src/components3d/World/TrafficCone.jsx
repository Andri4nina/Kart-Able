import { BlobShadow } from './BlobShadow'
import { GEOMETRIES, MATERIALS } from './demoResources'

const BASE_HEIGHT = 0.08
const BODY_HALF_HEIGHT = 0.45

export function TrafficCone({ position }) {
  return (
    <group position={position} userData={{ kind: 'cone' }}>
      <mesh geometry={GEOMETRIES.coneBase} material={MATERIALS.cone} position-y={BASE_HEIGHT / 2} />
      <mesh geometry={GEOMETRIES.coneBody} material={MATERIALS.cone} position-y={BASE_HEIGHT + BODY_HALF_HEIGHT} />
      <mesh geometry={GEOMETRIES.coneBand} material={MATERIALS.white} position-y={BASE_HEIGHT + BODY_HALF_HEIGHT} />
      <BlobShadow scale={0.6} />
    </group>
  )
}
