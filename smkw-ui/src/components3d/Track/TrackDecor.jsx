import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'
import { DECOR_MODELS, getModelParts } from './decorAssets'
import { placeDecor } from './decorPlacement'
import { InstancedParts } from './InstancedParts'

// Une famille de décor (un modèle Kenney, toutes ses copies en instances).
function DecorFamily({ id, transforms }) {
  const model = DECOR_MODELS[id]
  const { scene } = useGLTF(model.url)
  const parts = useMemo(() => getModelParts(scene), [scene])
  const scaled = useMemo(() => transforms.map((transform) => ({ scale: model.scale, ...transform })), [transforms, model.scale])
  return <InstancedParts name={`decor-${id}`} parts={parts} transforms={scaled} />
}

// Décor de course placé d'après le chemin (decorPlacement.js).
export function TrackDecor({ path, bounds }) {
  const decor = useMemo(() => placeDecor(path, bounds), [path, bounds])
  return (
    <group name="track-decor">
      {Object.entries(decor).map(([id, transforms]) => (
        <DecorFamily key={id} id={id} transforms={transforms} />
      ))}
    </group>
  )
}
