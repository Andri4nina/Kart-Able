import { ROSTER_COLUMNS } from '../config/characters'
import { SCREENS } from '../navigation/screens'
import { useCharacterSelectionStore } from '../stores/characterSelectionStore'
import { useLocalPlayersStore } from '../stores/localPlayersStore'
import { useNavigationStore } from '../stores/navigationStore'
import { createSelectionController } from './selection/createSelectionController'
import { areAllConfirmed } from './selection/selectionRules'
import { beginVehicleSelect } from './vehicleSelect'

// Sélection des personnages : chaque joueur présélectionne puis confirme indépendamment
// (personnages réservés sautés). Quand tout le monde a confirmé, START ou Continuer passe
// à la sélection des véhicules.

const currentPlayerIds = () => useLocalPlayersStore.getState().slots.map((slot) => slot.id)

export function beginCharacterSelect() {
  useCharacterSelectionStore.getState().begin(useLocalPlayersStore.getState().slots)
}

export function continueToVehicleSelect() {
  if (!areAllConfirmed(currentPlayerIds(), useCharacterSelectionStore.getState().selections)) return false
  beginVehicleSelect()
  useNavigationStore.getState().navigate(SCREENS.VEHICLE_SELECT)
  return true
}

export const handleCharacterInput = createSelectionController({
  useStore: useCharacterSelectionStore,
  columns: ROSTER_COLUMNS,
  onComplete: continueToVehicleSelect,
})
