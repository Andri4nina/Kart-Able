import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'
import { getGroundHeight } from '../../game/track/trackHeight'
import { InstancedParts } from './InstancedParts'
import { BUSH_NODES, getVegetationPart, TREE_PACK_URL } from './treeAssets'
import { scatterVegetation } from './vegetationScatter'

// Arbres et buissons du circuit, en instances (un maillage instancié par essence).
// Chaque instance est posée sur le relief.
export function TrackVegetation({ geometry, field, theme }) {
  const { track, path } = geometry
  const { scene } = useGLTF(TREE_PACK_URL)
  const groups = useMemo(() => {
    const scattered = scatterVegetation({ track, path, field, theme })
    const ground = (item) => ({ ...item, y: getGroundHeight(geometry, item.x, item.z) - 0.1 })
    const trees = scattered.trees.map(ground)
    const bushes = scattered.bushes.map(ground)
    const bySpecies = theme.trees.map((species) => ({
      id: species,
      part: getVegetationPart(scene, species),
      transforms: trees.filter((tree) => tree.species === species),
    }))
    const byBush = BUSH_NODES.map((node, kind) => ({
      id: node,
      part: getVegetationPart(scene, node),
      transforms: bushes.filter((bush) => bush.kind === kind),
    }))
    return [...bySpecies, ...byBush].filter((group) => group.part)
  }, [scene, geometry, track, path, field, theme])

  return (
    <group name="track-vegetation">
      {groups.map((group) => (
        <InstancedParts key={group.id} name={`vegetation-${group.id}`} parts={[group.part]} transforms={group.transforms} />
      ))}
    </group>
  )
}
