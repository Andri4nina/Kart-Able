import { Grid } from '@react-three/drei'
import { PALETTE } from './palette'

export function Ground() {
  return (
    <group userData={{ kind: 'ground' }}>
      <mesh rotation-x={-Math.PI / 2}>
        <circleGeometry args={[120, 48]} />
        <meshStandardMaterial color={PALETTE.grass} roughness={1} />
      </mesh>
      <Grid
        position={[0, 0.005, 0]}
        infiniteGrid
        cellSize={1}
        cellThickness={0.6}
        cellColor={PALETTE.gridCell}
        sectionSize={6}
        sectionThickness={1.1}
        sectionColor={PALETTE.gridSection}
        fadeDistance={60}
        fadeStrength={1.5}
      />
    </group>
  )
}
