import { useGLTF } from '@react-three/drei'
import { useEffect } from 'react'
import { SCREENS } from '../../navigation/screens'
import { selectCurrentScreen, useNavigationStore } from '../../stores/navigationStore'
import { DECOR_MODELS } from './decorAssets'
import { TREE_PACK_URL } from './treeAssets'

const PRELOAD_SCREENS = new Set([SCREENS.TRACK_SELECT, SCREENS.LOBBY])

// Les modèles des circuits (arbres, décor de course) se téléchargent pendant le choix du
// circuit et le lobby : ils sont prêts au départ (cache partagé avec useGLTF).
export function TrackAssetsPreload() {
  const active = useNavigationStore((state) => PRELOAD_SCREENS.has(selectCurrentScreen(state)))

  useEffect(() => {
    if (!active) return
    useGLTF.preload(TREE_PACK_URL)
    for (const { url } of Object.values(DECOR_MODELS)) useGLTF.preload(url)
  }, [active])

  return null
}
