import { CUP_IDS, getCup } from '../config/cups'
import { INPUT_ACTIONS } from '../input/actions'
import { usePauseStore } from '../stores/pauseStore'
import { useRaceStore } from '../stores/raceStore'
import { changeTrack } from './raceFlow'
import { exitMatch } from './session'

// Menu pause en course : START (n'importe quel joueur) ou Échap l'ouvre et le ferme.
// - menu : Reprendre, Changer de circuit, Quitter ;
// - changer de circuit : choix de la coupe, puis du circuit ; la course en cours est abandonnée
//   (sans points) et la nouvelle part aussitôt (game/raceFlow.js changeTrack).
// Haut / bas : élément ; A ou START : valider ; RETOUR : vue précédente (ou fermer).
export const PAUSE_OPTIONS = Object.freeze(['resume', 'changeTrack', 'quit'])

export const canPause = () => {
  const { phase } = useRaceStore.getState()
  return phase === 'countdown' || phase === 'racing'
}

export function openPause() {
  if (!canPause()) return false
  usePauseStore.getState().set({ open: true, view: 'menu', index: 0 })
  return true
}

export const closePause = () => usePauseStore.getState().reset()

export function togglePause() {
  return usePauseStore.getState().open ? (closePause(), true) : openPause()
}

// Éléments de la vue affichée (options du menu, coupes, ou circuits de la coupe choisie).
export function getPauseItems({ view, cupId }) {
  if (view === 'cups') return CUP_IDS
  if (view === 'tracks') return getCup(cupId)?.trackIds ?? []
  return PAUSE_OPTIONS
}

export function choosePauseItem(item) {
  const pause = usePauseStore.getState()
  if (pause.view === 'cups') return pause.set({ view: 'tracks', cupId: item, index: 0 })
  if (pause.view === 'tracks') {
    closePause()
    return changeTrack(item)
  }
  if (item === 'resume') return closePause()
  if (item === 'changeTrack') return pause.set({ view: 'cups', index: 0 })
  closePause()
  return exitMatch()
}

function goBack() {
  const pause = usePauseStore.getState()
  if (pause.view === 'tracks') pause.set({ view: 'cups', index: Math.max(0, CUP_IDS.indexOf(pause.cupId)) })
  else if (pause.view === 'cups') pause.set({ view: 'menu', index: 1 })
  else closePause()
}

export function handlePauseInput(input) {
  const pause = usePauseStore.getState()
  if (!pause.open) return input.action === INPUT_ACTIONS.START && Boolean(input.playerId) && openPause()
  const items = getPauseItems(pause)
  const step = { [INPUT_ACTIONS.UP]: -1, [INPUT_ACTIONS.LEFT]: -1, [INPUT_ACTIONS.DOWN]: 1, [INPUT_ACTIONS.RIGHT]: 1 }[input.action]
  if (step) {
    pause.set({ index: (pause.index + step + items.length) % items.length })
    return true
  }
  if (input.action === INPUT_ACTIONS.CONFIRM || (input.action === INPUT_ACTIONS.START && pause.view !== 'menu')) {
    choosePauseItem(items[pause.index])
    return true
  }
  if (input.action === INPUT_ACTIONS.START) {
    closePause()
    return true
  }
  if (input.action === INPUT_ACTIONS.BACK) {
    goBack()
    return true
  }
  return false
}
