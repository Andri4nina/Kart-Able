import { GEOMETRIES, MATERIALS } from './demoResources'

const FLAT = -Math.PI / 2

export function BlobShadow({ ref, y = 0.015, scale = 1 }) {
  return (
    <mesh
      ref={ref}
      geometry={GEOMETRIES.blob}
      material={MATERIALS.blob}
      rotation-x={FLAT}
      position-y={y}
      scale={scale}
      renderOrder={1}
    />
  )
}
