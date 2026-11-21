import { GEOMETRIES, MATERIALS } from './demoResources'

export const PODIUM_TOP = 0.4

export function Podium() {
  return (
    <group userData={{ kind: 'podium' }}>
      <mesh geometry={GEOMETRIES.podium} material={MATERIALS.asphalt} position-y={PODIUM_TOP / 2} />
      <mesh geometry={GEOMETRIES.podiumRing} material={MATERIALS.yellow} rotation-x={-Math.PI / 2} position-y={PODIUM_TOP} />
    </group>
  )
}
