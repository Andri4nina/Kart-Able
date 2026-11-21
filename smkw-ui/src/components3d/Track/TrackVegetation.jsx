import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'
import { InstancedParts } from './InstancedParts'
import { BUSH_NODES, getVegetationPart, TREE_PACK_URL } from './treeAssets'
import { scatterVegetation } from './vegetationScatter'

// Arbres et buissons du circuit, en instances (un maillage instancié par essence).
export function TrackVegetation({ track, path, field, theme }) {
  const { scene } = useGLTF(TREE_PACK_URL)
  const groups = useMemo(() => {
    const { trees, bushes } = scatterVegetation({ track, path, field, theme })
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
  }, [scene, track, path, field, theme])

  return (
    <group name="track-vegetation">
      {groups.map((group) => (
        <InstancedParts key={group.id} name={`vegetation-${group.id}`} parts={[group.part]} transforms={group.transforms} />
      ))}
    </group>
  )
}
