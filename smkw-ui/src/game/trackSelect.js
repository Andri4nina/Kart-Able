import { CUP_IDS, getCupFromItem, TRACK_SELECT_COLUMNS } from '../config/cups'
import { INPUT_ACTIONS } from '../input/actions'
import { SCREENS } from '../navigation/screens'
import { useCourseStore } from '../stores/courseStore'
import { useLocalPlayersStore } from '../stores/localPlayersStore'
import { useNavigationStore } from '../stores/navigationStore'
import { useCupSelectionStore, useTrackSelectionStore } from '../stores/trackSelectionStore'
import { beginLobby } from './lobbyReady'
import { getDisplayedId } from './selection/selectionRules'

// Écran des circuits (après les véhicules, modes de course) : P1 choisit pour tout le monde.
// 1. Coupes : gauche / droite, A ou START ouvre la coupe.
// 2. Circuits de la coupe : A ajoute ou retire le circuit du programme (première carte : toute
//    la coupe) ; RETOUR revient aux coupes en gardant le programme (on peut y ajouter des
//    circuits d'une autre coupe) ; START passe au lobby. Programme vide : toute la coupe ouverte.
const getLeader = () => useLocalPlayersStore.getState().slots[0] ?? null
const leaders = () => (getLeader() ? [getLeader()] : [])
const TRACK_MOVES = { [INPUT_ACTIONS.LEFT]: -1, [INPUT_ACTIONS.RIGHT]: 1, [INPUT_ACTIONS.UP]: -TRACK_SELECT_COLUMNS, [INPUT_ACTIONS.DOWN]: TRACK_SELECT_COLUMNS }
const CUP_MOVES = { [INPUT_ACTIONS.LEFT]: -1, [INPUT_ACTIONS.RIGHT]: 1, [INPUT_ACTIONS.UP]: -1, [INPUT_ACTIONS.DOWN]: 1 }

export function openCup(cupId) {
  if (!CUP_IDS.includes(cupId)) return false
  useCourseStore.getState().openCup(cupId)
  const tracks = useTrackSelectionStore.getState()
  tracks.reset()
  tracks.begin(leaders())
  return true
}

export function beginTrackSelect() {
  const course = useCourseStore.getState()
  course.begin()
  useCupSelectionStore.getState().begin(leaders())
  if (course.cupId) openCup(course.cupId)
}

// Carte choisie dans une coupe : toute la coupe, ou un circuit (ajouté ou retiré).
export function pickCourseItem(itemId) {
  const cup = getCupFromItem(itemId)
  if (cup) useCourseStore.getState().toggleCup(cup.id)
  else if (itemId) useCourseStore.getState().toggleTrack(itemId)
}

export function continueFromTrackSelect() {
  const { cupId, playlist } = useCourseStore.getState()
  if (!cupId && !playlist.length) return false
  beginLobby()
  useNavigationStore.getState().navigate(SCREENS.LOBBY)
  return true
}

export function handleTrackInput(input) {
  const leader = getLeader()
  if (!leader || input.playerId !== leader.id) return false
  const course = useCourseStore.getState()
  const onCups = course.step === 'cups'
  const store = (onCups ? useCupSelectionStore : useTrackSelectionStore).getState()
  const moves = onCups ? CUP_MOVES : TRACK_MOVES
  if (input.action in moves) {
    store.move(leader.id, moves[input.action])
    return true
  }
  const itemId = getDisplayedId(store.selections[leader.id])
  if (input.action === INPUT_ACTIONS.CONFIRM || (onCups && input.action === INPUT_ACTIONS.START)) {
    if (onCups) openCup(itemId)
    else pickCourseItem(itemId)
    return true
  }
  if (input.action === INPUT_ACTIONS.START) return continueFromTrackSelect()
  if (input.action === INPUT_ACTIONS.BACK && !onCups) {
    course.backToCups()
    return true
  }
  return false
}
