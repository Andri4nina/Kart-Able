import { useFrame } from '@react-three/fiber'
import { MAX_FRAME_DELTA } from '../../config/gameConfig'
import { stepRace } from '../../game/race/raceSession'
import { SCREENS } from '../../navigation/screens'
import { selectCurrentScreen, useNavigationStore } from '../../stores/navigationStore'
import { usePauseStore } from '../../stores/pauseStore'
import { useSessionStore } from '../../stores/sessionStore'

// Priorité négative : la course avance avant que les karts et les caméras ne la lisent
// (priorité 0 et 1). Une priorité négative ne coupe pas le rendu automatique de R3F.
const RACE_PRIORITY = -1

// Système invisible : avance la course (feux, conduite, bots, tours) pendant le jeu, en pause
// quand les paramètres ou le menu pause sont ouverts. Piloté par la boucle R3F, donc déterministe sous
// window.advanceTime. Sans circuit (modes d'arène), seul le chrono de démonstration avance.
export function RaceSystem() {
  useFrame((_, delta) => {
    const navigation = useNavigationStore.getState()
    // En réseau local, la course des autres continue : la pause ne fige rien.
    const paused = (navigation.settingsOpen || usePauseStore.getState().open) && !useSessionStore.getState().match?.net
    if (selectCurrentScreen(navigation) !== SCREENS.GAME || paused) return
    stepRace(Math.min(delta, MAX_FRAME_DELTA))
  }, RACE_PRIORITY)
  return null
}
