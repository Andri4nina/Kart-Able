import { BlobShadow } from './BlobShadow'
import { GEOMETRIES, MATERIALS } from './demoResources'

const TIRE_HEIGHT = 0.36
const FLAT = -Math.PI / 2

export function TireStack({ position, count = 2 }) {
  return (
    <group position={position} userData={{ kind: 'tireStack' }}>
      {Array.from({ length: count }, (_, index) => (
        <mesh
          key={index}
          geometry={GEOMETRIES.tire}
          material={index % 2 === 0 ? MATERIALS.rubber : MATERIALS.red}
          rotation-x={FLAT}
          position-y={TIRE_HEIGHT / 2 + index * TIRE_HEIGHT}
        />
      ))}
      <BlobShadow scale={0.8} />
    </group>
  )
}
