import { VEHICLE_COLUMNS } from '../config/vehicles'
import { SCREENS } from '../navigation/screens'
import { useLocalPlayersStore } from '../stores/localPlayersStore'
import { useMatchSetupStore } from '../stores/matchSetupStore'
import { useNavigationStore } from '../stores/navigationStore'
import { useVehicleSelectionStore } from '../stores/vehicleSelectionStore'
import { beginLobby } from './lobbyReady'
import { modeUsesTracks } from './matchRules'
import { createSelectionController } from './selection/createSelectionController'
import { areAllConfirmed } from './selection/selectionRules'
import { beginTrackSelect } from './trackSelect'

// Sélection des véhicules (après les personnages) : chaque joueur choisit et confirme
// indépendamment ; quand tout le monde a confirmé, START ou Continuer passe au choix du
// circuit (modes de course) ou directement au lobby.

const currentPlayerIds = () => useLocalPlayersStore.getState().slots.map((slot) => slot.id)

export function beginVehicleSelect() {
  useVehicleSelectionStore.getState().begin(useLocalPlayersStore.getState().slots)
}

export function continueFromVehicleSelect() {
  if (!areAllConfirmed(currentPlayerIds(), useVehicleSelectionStore.getState().selections)) return false
  if (modeUsesTracks(useMatchSetupStore.getState().modeId)) {
    beginTrackSelect()
    useNavigationStore.getState().navigate(SCREENS.TRACK_SELECT)
  } else {
    beginLobby()
    useNavigationStore.getState().navigate(SCREENS.LOBBY)
  }
  return true
}

export const handleVehicleInput = createSelectionController({
  useStore: useVehicleSelectionStore,
  columns: VEHICLE_COLUMNS,
  onComplete: continueFromVehicleSelect,
})
