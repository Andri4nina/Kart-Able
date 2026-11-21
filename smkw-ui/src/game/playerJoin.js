import { PLAY_TYPES } from '../config/gameModes'
import { PLAYER_ENTRY_DURATION_MS, PLAYER_STATUS } from '../config/players'
import { INPUT_ACTIONS } from '../input/actions'
import { SCREENS } from '../navigation/screens'
import { useLocalPlayersStore } from '../stores/localPlayersStore'
import { useMatchSetupStore } from '../stores/matchSetupStore'
import { useNavigationStore } from '../stores/navigationStore'
import { beginCharacterSelect } from './characterSelect'
import { getGameMode, getPlayerLimit } from './matchRules'

// Écran "joueurs locaux" : START rejoint, START (joueur prêt) continue, RETOUR quitte.
// Aucun bouton "ajouter un joueur" : seul un périphérique peut faire entrer un joueur.

export function getLocalPlayerLimit() {
  return getPlayerLimit(getGameMode(useMatchSetupStore.getState().modeId), PLAY_TYPES.LOCAL)
}

export function canContinueFromJoin(slots) {
  return slots.length > 0 && slots.every((slot) => slot.status === PLAYER_STATUS.READY)
}

// Crée le PlayerSlot puis le passe READY à la fin de l'animation d'entrée.
export function joinPlayer(device) {
  const players = useLocalPlayersStore.getState()
  const slot = players.join(device, getLocalPlayerLimit())
  if (!slot) return null
  setTimeout(() => useLocalPlayersStore.getState().markReady(slot.id, slot.joinToken), PLAYER_ENTRY_DURATION_MS)
  return slot
}

export function continueToCharacterSelect() {
  if (!canContinueFromJoin(useLocalPlayersStore.getState().slots)) return false
  beginCharacterSelect()
  useNavigationStore.getState().navigate(SCREENS.CHARACTER_SELECT)
  return true
}

// Traduit une PlayerInput en action de l'écran. Renvoie true si l'entrée est utilisée.
export function handleJoinInput(input) {
  const players = useLocalPlayersStore.getState()

  if (input.action === INPUT_ACTIONS.START) {
    if (!input.playerId) {
      joinPlayer(input.device)
      return true
    }
    const slot = players.slots.find((candidate) => candidate.id === input.playerId)
    if (slot?.status === PLAYER_STATUS.READY) continueToCharacterSelect()
    return true
  }

  if (input.action === INPUT_ACTIONS.BACK && input.playerId) {
    players.leave(input.playerId)
    return true
  }

  return false
}
