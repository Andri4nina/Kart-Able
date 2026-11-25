import { useFrame } from '@react-three/fiber'
import { getGroundHeight } from '../../game/track/trackHeight'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { FEATURE_GEOMETRIES, FEATURE_MATERIALS, getRockMaterial } from './featureResources'

// Éléments de route d'un circuit (game/track/trackFeatures.js) : pads d'accélération posés sur
// l'asphalte (chevrons qui pulsent vers l'avant) et rochers à contourner. Quelques maillages
// seulement par circuit : pas d'instances.
const CHEVRONS = [-1.6, -0.3, 1]
const DEFAULT_ROCK = '#8f8a84'

function slopeAt(geometry, feature) {
  const { path } = geometry
  const a = (feature.index - 3 + path.count) % path.count
  const b = (feature.index + 3) % path.count
  return Math.atan2(path.y[b] - path.y[a], 6 * path.step)
}

function Pad({ geometry, pad }) {
  const y = getGroundHeight(geometry, pad.x, pad.z) + 0.03
  return (
    <group position={[pad.x, y, pad.z]} rotation={[-slopeAt(geometry, pad), Math.atan2(pad.tx, pad.tz), 0]} rotation-order="YXZ">
      <mesh geometry={FEATURE_GEOMETRIES.padPlate} material={FEATURE_MATERIALS.padPlate} />
      {CHEVRONS.map((z) => (
        <mesh key={z} geometry={FEATURE_GEOMETRIES.chevron} material={FEATURE_MATERIALS.chevron} position={[0, 0.02, z]} />
      ))}
    </group>
  )
}

function Rock({ geometry, obstacle, color }) {
  const y = getGroundHeight(geometry, obstacle.x, obstacle.z)
  const r = obstacle.radius
  return (
    <mesh
      geometry={FEATURE_GEOMETRIES.rock}
      material={getRockMaterial(color)}
      position={[obstacle.x, y + r * 0.45, obstacle.z]}
      rotation={[obstacle.x * 0.7, obstacle.z * 0.3, obstacle.x * 0.2]}
      scale={[r * 1.05, r * 0.95, r * 1.05]}
      castShadow
    />
  )
}

export function TrackFeatures({ geometry, theme }) {
  const reducedMotion = useReducedMotion()
  useFrame(({ clock }) => {
    FEATURE_MATERIALS.chevron.emissiveIntensity = reducedMotion ? 1.2 : 0.9 + 0.6 * Math.abs(Math.sin(clock.elapsedTime * 4))
  })
  return (
    <group name="track-features">
      {geometry.pads.map((pad) => (
        <Pad key={`pad-${pad.distance}-${pad.lateral}`} geometry={geometry} pad={pad} />
      ))}
      {geometry.obstacles.map((obstacle) => (
        <Rock key={`rock-${obstacle.distance}-${obstacle.lateral}`} geometry={geometry} obstacle={obstacle} color={theme.rock ?? DEFAULT_ROCK} />
      ))}
    </group>
  )
}
