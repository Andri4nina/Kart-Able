import { useEffect, useMemo } from 'react'
import { DoubleSide, MeshStandardMaterial } from 'three'
import { buildIslandGeometry } from './islandGeometry'

// Terre-plein des embranchements (Duet Cup) : dessus en herbe aux couleurs du circuit, flancs en
// bordure claire. Rien si le circuit n'a pas d'embranchement.
const SIDE_COLOR = '#e9e2cf'

export function TrackIslands({ geometry, theme }) {
  const island = useMemo(() => {
    const built = buildIslandGeometry(geometry.path, geometry.island)
    if (!built) return null
    return {
      ...built,
      topMaterial: new MeshStandardMaterial({ color: theme.ground[1], roughness: 0.9 }),
      sideMaterial: new MeshStandardMaterial({ color: SIDE_COLOR, roughness: 0.7, side: DoubleSide }),
    }
  }, [geometry, theme])

  useEffect(
    () => () => {
      if (!island) return
      island.top.dispose()
      island.sides.dispose()
      island.topMaterial.dispose()
      island.sideMaterial.dispose()
    },
    [island],
  )

  if (!island) return null
  return (
    <group name="track-islands">
      <mesh geometry={island.top} material={island.topMaterial} receiveShadow />
      <mesh geometry={island.sides} material={island.sideMaterial} receiveShadow />
    </group>
  )
}
