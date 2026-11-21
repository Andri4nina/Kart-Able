import { INPUT_ACTIONS } from '../input/actions'
import { useLobbyReadyStore } from '../stores/lobbyReadyStore'
import { useLocalPlayersStore } from '../stores/localPlayersStore'
import { useMatchSetupStore } from '../stores/matchSetupStore'
import { areAllReady } from './lobbyRules'
import { getStartBlocker } from './matchRules'
import { getCurrentPicks, startMatch } from './session'

// Lobby local : chaque joueur se déclare prêt avec son périphérique (START ou A) ou son
// bouton à l'écran ; RETOUR annule. Dès que tout le monde est prêt, la course démarre
// (écran partagé, une case par joueur).

const currentPlayerIds = () => useLocalPlayersStore.getState().slots.map((slot) => slot.id)

export function beginLobby() {
  useLobbyReadyStore.getState().begin()
}

// Renvoie true si l'état du joueur a changé. Refusé si la partie ne peut pas démarrer
// (sélections incomplètes) : personne ne peut se déclarer prêt pour rien.
export function setPlayerReady(playerId, ready) {
  const slots = useLocalPlayersStore.getState().slots
  if (!slots.some((slot) => slot.id === playerId)) return false
  if (ready && getStartBlocker(useMatchSetupStore.getState(), slots, getCurrentPicks())) return false

  const store = useLobbyReadyStore.getState()
  if (Boolean(store.ready[playerId]) === ready) return false
  store.setReady(playerId, ready)
  if (ready && areAllReady(currentPlayerIds(), useLobbyReadyStore.getState().ready)) startMatch()
  return true
}

export function handleLobbyInput(input) {
  // Les périphériques qui n'ont pas rejoint ne pilotent rien ici.
  if (!input.playerId) return false
  if (input.action === INPUT_ACTIONS.START || input.action === INPUT_ACTIONS.CONFIRM) {
    setPlayerReady(input.playerId, true)
    return true
  }
  if (input.action === INPUT_ACTIONS.BACK) {
    setPlayerReady(input.playerId, false)
    return true
  }
  return false
}
