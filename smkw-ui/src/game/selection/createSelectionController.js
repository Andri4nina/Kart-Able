import { INPUT_ACTIONS } from '../../input/actions'
import { SELECTION_STATUS } from './selectionRules'

// Fabrique du contrôleur d'un écran de sélection : traduit les PlayerInput en actions du store.
// Gauche / droite = élément voisin, haut / bas = rangée (±colonnes), START ou A = confirmer,
// RETOUR = annuler. Quand tout le monde a confirmé, START appelle `onComplete`.
export function createSelectionController({ useStore, columns, onComplete }) {
  const moves = {
    [INPUT_ACTIONS.LEFT]: -1,
    [INPUT_ACTIONS.RIGHT]: 1,
    [INPUT_ACTIONS.UP]: -columns,
    [INPUT_ACTIONS.DOWN]: columns,
  }

  return function handleSelectionInput(input) {
    // Les périphériques qui n'ont pas rejoint ne pilotent rien ici.
    if (!input.playerId) return false
    const store = useStore.getState()
    const selection = store.selections[input.playerId]
    if (!selection) return false

    if (input.action in moves) {
      store.move(input.playerId, moves[input.action])
      return true
    }

    if (input.action === INPUT_ACTIONS.CONFIRM || input.action === INPUT_ACTIONS.START) {
      if (selection.status === SELECTION_STATUS.SELECTING) store.confirm(input.playerId)
      else if (input.action === INPUT_ACTIONS.START) onComplete()
      return true
    }

    if (input.action === INPUT_ACTIONS.BACK) {
      store.cancel(input.playerId)
      return true
    }

    return false
  }
}
