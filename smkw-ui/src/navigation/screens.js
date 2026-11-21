// Registre des écrans : données pures, sans composant React.
// L'UI associe chaque id à un composant (UILayer), la 3D à un plan caméra (CameraRig).

export const SCREENS = Object.freeze({
  MAIN_MENU: 'mainMenu',
  MODE_SELECT: 'modeSelect',
  PLAY_TYPE: 'playType',
  LOCAL_SETUP: 'localSetup',
  CHARACTER_SELECT: 'characterSelect',
  VEHICLE_SELECT: 'vehicleSelect',
  TRACK_SELECT: 'trackSelect',
  ONLINE_SETUP: 'onlineSetup',
  LOBBY: 'lobby',
  GAME: 'game',
})

// camera : plan caméra de la scène décorative (voir components3d/Camera/cameraBehaviors.js)
// step   : étape du parcours (voir MENU_FLOWS), null = hors parcours
// Les écrans au plan `selection` affichent la rangée de previews 3D (components3d/SelectionPreview).
export const SCREEN_META = Object.freeze({
  [SCREENS.MAIN_MENU]: { camera: 'menu', step: null },
  [SCREENS.MODE_SELECT]: { camera: 'menuWide', step: 'mode' },
  [SCREENS.PLAY_TYPE]: { camera: 'menuWide', step: 'type' },
  [SCREENS.LOCAL_SETUP]: { camera: 'menuWide', step: 'players' },
  [SCREENS.CHARACTER_SELECT]: { camera: 'selection', step: 'characters' },
  [SCREENS.VEHICLE_SELECT]: { camera: 'selection', step: 'vehicles' },
  [SCREENS.TRACK_SELECT]: { camera: 'menuWide', step: 'tracks' },
  [SCREENS.ONLINE_SETUP]: { camera: 'menuWide', step: 'connection' },
  [SCREENS.LOBBY]: { camera: 'lobby', step: 'lobby' },
  [SCREENS.GAME]: { camera: 'game', step: null },
})

// Parcours affichés par le stepper, selon le type de partie. L'étape « circuits » n'existe que
// pour les modes qui se courent sur un circuit (config/gameModes.js, `tracks`).
export const MENU_FLOWS = Object.freeze({
  local: Object.freeze(['mode', 'type', 'players', 'characters', 'vehicles', 'tracks', 'lobby']),
  online: Object.freeze(['mode', 'type', 'connection', 'lobby']),
})

export function getMenuFlow(playType, usesTracks = true) {
  const flow = MENU_FLOWS[playType] ?? MENU_FLOWS.local
  return usesTracks ? flow : flow.filter((step) => step !== 'tracks')
}

export function getScreenMeta(screenId) {
  return SCREEN_META[screenId] ?? SCREEN_META[SCREENS.MAIN_MENU]
}

export function isSelectionScreen(screenId) {
  return getScreenMeta(screenId).camera === 'selection'
}

// Écrans où les personnages (modèles 3D, portraits) doivent être prêts.
const CHARACTER_SCREENS = new Set([SCREENS.LOCAL_SETUP, SCREENS.CHARACTER_SELECT, SCREENS.VEHICLE_SELECT, SCREENS.TRACK_SELECT, SCREENS.LOBBY, SCREENS.GAME])

export function needsCharacters(screenId) {
  return CHARACTER_SCREENS.has(screenId)
}
