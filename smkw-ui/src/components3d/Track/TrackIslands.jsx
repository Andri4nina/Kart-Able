import { useEffect, useMemo } from 'react'
import { DoubleSide, MeshLambertMaterial } from 'three'
import { FEATURE_GEOMETRIES } from './featureResources'
import { buildIslandGeometry } from './islandGeometry'

// Séparations des embranchements (Duet Cup), une par embranchement, selon son style : herbe aux
// couleurs du circuit, haie, muret, canal ou rochers. Rien si le circuit n'en a pas.
const STYLE_COLORS = {
  grass: { side: '#e9e2cf' },
  hedge: { top: '#2f6b2a', side: '#3c7d33' },
  wall: { top: '#d7d9de', side: '#c3c6cc' },
  canal: { top: '#2fa8d8', side: '#b9b2a4' },
  rocks: { side: '#d8cfb6' },
}
const ROCK_COLOR = '#8a8f96'

function materialsFor(style, theme) {
  const colors = STYLE_COLORS[style] ?? STYLE_COLORS.grass
  return {
    topMaterial: new MeshLambertMaterial({ color: colors.top ?? theme.ground[1] }),
    sideMaterial: new MeshLambertMaterial({ color: colors.side, side: DoubleSide }),
  }
}

export function TrackIslands({ geometry, theme }) {
  const parts = useMemo(
    () =>
      geometry.splits
        .map((split) => {
          const built = buildIslandGeometry(geometry.path, geometry.island, split)
          return built ? { key: split.start, ...built, ...materialsFor(split.style, theme) } : null
        })
        .filter(Boolean),
    [geometry, theme],
  )
  const rockMaterial = useMemo(() => new MeshLambertMaterial({ color: ROCK_COLOR, flatShading: true }), [])

  useEffect(
    () => () => {
      for (const part of parts) for (const resource of [part.top, part.sides, part.topMaterial, part.sideMaterial]) resource.dispose()
      rockMaterial.dispose()
    },
    [parts, rockMaterial],
  )

  if (!parts.length) return null
  return (
    <group name="track-islands">
      {parts.map((part) => (
        <group key={part.key}>
          <mesh geometry={part.top} material={part.topMaterial} receiveShadow />
          <mesh geometry={part.sides} material={part.sideMaterial} receiveShadow />
          {part.rocks.map(([x, y, z, size]) => (
            <mesh key={`${x}-${z}`} geometry={FEATURE_GEOMETRIES.rock} material={rockMaterial} position={[x, y + size * 0.4, z]} scale={[size, size * 0.9, size]} castShadow />
          ))}
        </group>
      ))}
    </group>
  )
}
