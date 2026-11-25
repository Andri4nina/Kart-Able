import { TRACK_SELECT_COLUMNS } from '../config/cups'
import { SCREENS } from '../navigation/screens'
import { useLocalPlayersStore } from '../stores/localPlayersStore'
import { useNavigationStore } from '../stores/navigationStore'
import { useTrackSelectionStore } from '../stores/trackSelectionStore'
import { beginLobby } from './lobbyReady'
import { createSelectionController } from './selection/createSelectionController'
import { getConfirmedId } from './selection/selectionRules'

// Choix de la coupe et du circuit (après les véhicules, modes de course) : P1 choisit pour
// tout le monde. Une rangée par coupe : la coupe entière (ses 4 circuits à la suite) puis ses
// circuits (une course). Gauche / droite : élément voisin ; haut / bas : coupe voisine ;
// START ou A : confirmer ; START une fois confirmé : lobby.

const getLeader = () => useLocalPlayersStore.getState().slots[0] ?? null

export function beginTrackSelect() {
  const leader = getLeader()
  useTrackSelectionStore.getState().begin(leader ? [leader] : [])
}

// Choix confirmé par le joueur qui choisit (coupe `cup:<id>` ou circuit), ou null.
export function getChosenTrackId(selections) {
  const leader = getLeader()
  return leader ? getConfirmedId(selections, leader.id) : null
}

export function continueFromTrackSelect() {
  if (!getChosenTrackId(useTrackSelectionStore.getState().selections)) return false
  beginLobby()
  useNavigationStore.getState().navigate(SCREENS.LOBBY)
  return true
}

export const handleTrackInput = createSelectionController({
  useStore: useTrackSelectionStore,
  columns: TRACK_SELECT_COLUMNS,
  onComplete: continueFromTrackSelect,
})
