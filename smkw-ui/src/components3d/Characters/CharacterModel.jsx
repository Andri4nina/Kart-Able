import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import { MAX_FRAME_DELTA } from '../../config/gameConfig'
import { getCharacterColor } from '../../config/characters'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { getCharacterAsset } from './characterAssets'
import { prepareCharacter } from './prepareCharacter'

function LoadedCharacter({ characterId, asset, height, animate, driver }) {
  const gltf = useGLTF(asset.url)
  const reducedMotion = useReducedMotion()
  const isDriver = Boolean(driver)
  const prepared = useMemo(
    () =>
      prepareCharacter(gltf, asset, {
        name: `character-${characterId}`,
        height,
        color: getCharacterColor(characterId),
        driver: isDriver,
      }),
    [gltf, asset, characterId, height, isDriver],
  )

  useEffect(() => () => prepared.dispose(), [prepared])

  // Animation d'attente en boucle (si le modèle en a une, sinon attente procédurale idleMotion) ;
  // pose fixe en mouvement réduit.
  // Au volant : gestes du pilote (driverRig) d'après `driver`, écrit chaque frame par le kart ;
  // en mouvement réduit, les gestes suivent sans amorti.
  useFrame((_, delta) => {
    const step = Math.min(delta, MAX_FRAME_DELTA)
    if (driver && prepared.rig) prepared.rig.update(driver, reducedMotion ? 1 : step, reducedMotion)
    if (animate && !reducedMotion) prepared.mixer?.update(step)
    if (animate && !reducedMotion) prepared.idle?.update(step)
  })

  return <primitive object={prepared.object} />
}

// Personnage GLB à la hauteur demandée (selon son gabarit), regard vers +Z, pieds à y = 0.
// Suspend pendant le chargement (Suspense chez l'appelant). `driver` (objet stable
// { steer, cheer, panic }) : pose assise au volant, bassin à l'origine.
export function CharacterModel({ characterId, height, animate = true, driver = null }) {
  const asset = getCharacterAsset(characterId)
  if (!asset) return null
  return <LoadedCharacter characterId={characterId} asset={asset} height={height} animate={animate} driver={driver} />
}
