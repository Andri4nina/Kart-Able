import { useGLTF } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { Suspense, useEffect } from 'react'
import { CHARACTERS, getCharacterColor } from '../../config/characters'
import { needsCharacters } from '../../navigation/screens'
import { selectCurrentScreen, useNavigationStore } from '../../stores/navigationStore'
import { usePortraitStore } from '../../stores/portraitStore'
import { getCharacterAsset } from './characterAssets'
import { prepareCharacter } from './prepareCharacter'
import { renderPortrait } from './renderPortrait'

// Une prise de vue : dès que le modèle est chargé, un rendu hors écran, puis plus rien.
function PortraitShot({ characterId }) {
  const asset = getCharacterAsset(characterId)
  const gltf = useGLTF(asset.url)
  const gl = useThree((state) => state.gl)
  const done = usePortraitStore((state) => Boolean(state.portraits[characterId]))

  useEffect(() => {
    if (done) return
    const prepared = prepareCharacter(gltf, asset, { name: `portrait-${characterId}`, height: 1, color: getCharacterColor(characterId) })
    try {
      usePortraitStore.getState().setPortrait(characterId, renderPortrait(gl, prepared.object, 1, asset.portrait))
    } finally {
      prepared.dispose()
    }
  }, [done, gltf, asset, gl, characterId])

  return null
}

// Studio de portraits : charge les modèles des personnages et rend le visage de chacun une
// fois (roster, avatars). Monté dès l'écran des joueurs locaux, pour que tout soit prêt à la
// sélection ; les portraits restent ensuite dans portraitStore.
export function PortraitStudio() {
  const active = useNavigationStore((state) => needsCharacters(selectCurrentScreen(state)))
  if (!active) return null

  return CHARACTERS.filter((character) => getCharacterAsset(character.id)).map((character) => (
    <Suspense key={character.id} fallback={null}>
      <PortraitShot characterId={character.id} />
    </Suspense>
  ))
}
