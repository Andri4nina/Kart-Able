import { useEffect, useMemo } from 'react'
import { BoxGeometry, DoubleSide, MeshBasicMaterial, MeshLambertMaterial } from 'three'
import { buildCrossingGeometry } from './crossingGeometry'
import { createRoadMaterial } from './surfaceMaterials'

// Croisements (Duet Cup) : voie du pont et voie de la tranchée (même revêtement que la route),
// garde-corps, tablier et murs en béton, piles du pont. Rien si le circuit n'a pas de croisement.
const PILLAR_GEOMETRY = new BoxGeometry(1.2, 1, 1.2).translate(0, 0.5, 0)
const CONCRETE = '#c9c4b8'
// Dessous du tablier : béton à l'ombre, sans éclairage (la lumière d'ambiance venue du sol le
// teinterait de vert).
const DECK_SHADE = '#6e6a62'

export function TrackCrossings({ geometry, theme }) {
  const built = useMemo(() => {
    const parts = buildCrossingGeometry(geometry.path, geometry)
    if (!parts) return null
    return { ...parts, road: createRoadMaterial(theme), concrete: new MeshLambertMaterial({ color: CONCRETE, side: DoubleSide }), shade: new MeshBasicMaterial({ color: DECK_SHADE, side: DoubleSide }) }
  }, [geometry, theme])

  useEffect(
    () => () => {
      if (!built) return
      built.lanes.dispose()
      built.walls.dispose()
      built.decks.dispose()
      built.shade.dispose()
      built.road.dispose()
      built.concrete.dispose()
    },
    [built],
  )

  if (!built) return null
  return (
    <group name="track-crossings">
      <mesh geometry={built.lanes} material={built.road} receiveShadow />
      <mesh geometry={built.walls} material={built.concrete} castShadow receiveShadow />
      <mesh geometry={built.decks} material={built.shade} />
      {built.pillars.map(([x, y, z, height]) => (
        <mesh key={`${x}-${z}`} geometry={PILLAR_GEOMETRY} material={built.concrete} position={[x, y, z]} scale={[1, height, 1]} castShadow />
      ))}
    </group>
  )
}
