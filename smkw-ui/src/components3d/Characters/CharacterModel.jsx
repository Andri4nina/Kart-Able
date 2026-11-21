import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import { MAX_FRAME_DELTA } from '../../config/gameConfig'
import { getCharacterColor } from '../../config/characters'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { getCharacterAsset } from './characterAssets'
import { prepareCharacter } from './prepareCharacter'

function LoadedCharacter({ characterId, asset, height, animate }) {
  const gltf = useGLTF(asset.url)
  const reducedMotion = useReducedMotion()
  const prepared = useMemo(
    () => prepareCharacter(gltf, asset, { name: `character-${characterId}`, height, color: getCharacterColor(characterId) }),
    [gltf, asset, characterId, height],
  )

  useEffect(() => () => prepared.dispose(), [prepared])

  // Animation d'attente en boucle (si le modèle en a une) ; pose fixe en mouvement réduit.
  useFrame((_, delta) => {
    if (animate && !reducedMotion) prepared.mixer?.update(Math.min(delta, MAX_FRAME_DELTA))
  })

  return <primitive object={prepared.object} />
}

// Personnage GLB à la hauteur demandée (selon son gabarit), regard vers +Z, pieds à y = 0.
// Suspend pendant le chargement (Suspense chez l'appelant).
export function CharacterModel({ characterId, height, animate = true }) {
  const asset = getCharacterAsset(characterId)
  if (!asset) return null
  return <LoadedCharacter characterId={characterId} asset={asset} height={height} animate={animate} />
}
