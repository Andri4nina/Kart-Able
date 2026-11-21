import { AnimatePresence } from 'motion/react'
import { SCREENS } from '../../navigation/screens'
import { selectCurrentScreen, useNavigationStore } from '../../stores/navigationStore'
import { CharacterSelect } from '../menu/CharacterSelect'
import { GameModeMenu } from '../menu/GameModeMenu'
import { Lobby } from '../menu/Lobby'
import { LocalMultiplayer } from '../menu/LocalMultiplayer'
import { MainMenu } from '../menu/MainMenu'
import { OnlineMultiplayer } from '../menu/OnlineMultiplayer'
import { PlayTypeMenu } from '../menu/PlayTypeMenu'
import { TrackSelect } from '../menu/TrackSelect'
import { VehicleSelect } from '../menu/VehicleSelect'
import { GameScreen } from '../screens/GameScreen'
import { SettingsDialog } from '../screens/SettingsDialog'
import { ScreenWipe } from './ScreenWipe'

// Association écran -> composant. Ajouter un écran : SCREENS + SCREEN_META (navigation/screens.js) + une ligne ici.
const SCREEN_COMPONENTS = {
  [SCREENS.MAIN_MENU]: MainMenu,
  [SCREENS.MODE_SELECT]: GameModeMenu,
  [SCREENS.PLAY_TYPE]: PlayTypeMenu,
  [SCREENS.LOCAL_SETUP]: LocalMultiplayer,
  [SCREENS.CHARACTER_SELECT]: CharacterSelect,
  [SCREENS.VEHICLE_SELECT]: VehicleSelect,
  [SCREENS.TRACK_SELECT]: TrackSelect,
  [SCREENS.ONLINE_SETUP]: OnlineMultiplayer,
  [SCREENS.LOBBY]: Lobby,
  [SCREENS.GAME]: GameScreen,
}

// Calque DOM au-dessus du Canvas. Il laisse passer le pointeur vers la scène :
// seuls les éléments interactifs réactivent pointer-events.
export function UILayer() {
  const screen = useNavigationStore(selectCurrentScreen)
  const direction = useNavigationStore((state) => state.direction)
  const settingsOpen = useNavigationStore((state) => state.settingsOpen)
  const Screen = SCREEN_COMPONENTS[screen] ?? MainMenu

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <AnimatePresence mode="wait" custom={direction}>
        <Screen key={screen} />
      </AnimatePresence>
      <AnimatePresence>{settingsOpen ? <SettingsDialog key="settings" /> : null}</AnimatePresence>
      <ScreenWipe />
    </div>
  )
}
