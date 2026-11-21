import { SCREENS } from '../navigation/screens'
import { useCharacterSelectionStore } from '../stores/characterSelectionStore'
import { useLocalPlayersStore } from '../stores/localPlayersStore'
import { useMatchSetupStore } from '../stores/matchSetupStore'
import { useNavigationStore } from '../stores/navigationStore'
import { useSessionStore } from '../stores/sessionStore'
import { useTrackSelectionStore } from '../stores/trackSelectionStore'
import { useVehicleSelectionStore } from '../stores/vehicleSelectionStore'
import { buildMatchConfig } from './matchConfig'
import { getStartBlocker } from './matchRules'
import { startRace, stopRace } from './race/raceSession'
import { getConfirmedId } from './selection/selectionRules'

// Frontière entre le menu et les systèmes de jeu : on fige la configuration (avec une graine
// pour les tirages de la partie), on lance la course et on bascule sur l'écran de jeu.

// Choix des écrans de sélection (personnages, véhicules, circuit choisi par P1) pour la
// validation finale.
export function getCurrentPicks() {
  const leader = useLocalPlayersStore.getState().slots[0]
  return {
    characters: useCharacterSelectionStore.getState().selections,
    vehicles: useVehicleSelectionStore.getState().selections,
    trackId: leader ? getConfirmedId(useTrackSelectionStore.getState().selections, leader.id) : null,
  }
}

export function startMatch() {
  const setup = useMatchSetupStore.getState()
  const slots = useLocalPlayersStore.getState().slots
  const picks = getCurrentPicks()
  if (getStartBlocker(setup, slots, picks)) return false
  const match = buildMatchConfig(setup, slots, picks, Math.floor(Math.random() * 2 ** 31))
  useSessionStore.getState().begin(match)
  startRace(match)
  useNavigationStore.getState().navigate(SCREENS.GAME)
  return true
}

// Les joueurs locaux restent inscrits : une nouvelle partie les retrouve prêts.
export function exitMatch() {
  stopRace()
  useSessionStore.getState().end()
  useNavigationStore.getState().resetTo(SCREENS.MAIN_MENU)
}
