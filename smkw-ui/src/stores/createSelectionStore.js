import { create } from 'zustand'
import {
  createSelection,
  findNextAvailable,
  getConfirmBlocker,
  SELECTION_STATUS,
} from '../game/selection/selectionRules'

const update = (selections, playerId, patch) =>
  selections[playerId] ? { ...selections, [playerId]: { ...selections[playerId], ...patch } } : selections

// Fabrique d'un store de sélection par joueur, indépendant pour chaque joueur :
// selections[playerId] = { status: 'selecting' | 'confirmed', preselectedId, confirmedId, lastMove, rejections }
// `itemIds` : éléments sélectionnables, `unique` : un élément confirmé est réservé (règle
// appliquée ici, pas seulement à l'écran), `defaultFor(playerIndex)` : présélection initiale.
export function createSelectionStore({ itemIds, unique, defaultFor }) {
  return create((set, get) => ({
    selections: {},

    // Entrée dans l'écran : une sélection par joueur présent, confirmations remises à zéro,
    // présélection mémorisée. Les joueurs partis disparaissent (réservations libérées).
    begin: (players) =>
      set((state) => ({
        selections: Object.fromEntries(
          players.map(({ id, index }) => {
            const previous = state.selections[id]
            return [id, createSelection(previous?.confirmedId ?? previous?.preselectedId ?? defaultFor(index))]
          }),
        ),
      })),

    // Changer de présélection : impossible une fois confirmé ; saute les éléments réservés.
    move: (playerId, delta) =>
      set((state) => {
        const selection = state.selections[playerId]
        if (!selection || selection.status === SELECTION_STATUS.CONFIRMED) return state
        const next = findNextAvailable(state.selections, playerId, selection.preselectedId, delta, itemIds, unique)
        if (next === selection.preselectedId) return state
        return { selections: update(state.selections, playerId, { preselectedId: next, lastMove: Math.sign(delta) }) }
      }),

    // Renvoie null si confirmé, sinon la raison du refus (comptée pour le feedback UI).
    confirm: (playerId) => {
      const { selections } = get()
      const blocker = getConfirmBlocker(selections, playerId, unique)
      if (blocker) {
        if (selections[playerId]) {
          set({ selections: update(selections, playerId, { rejections: selections[playerId].rejections + 1 }) })
        }
        return blocker
      }
      const { preselectedId } = selections[playerId]
      set({ selections: update(selections, playerId, { status: SELECTION_STATUS.CONFIRMED, confirmedId: preselectedId }) })
      return null
    },

    // Revenir sur un choix confirmé est autorisé : l'élément est libéré immédiatement.
    cancel: (playerId) =>
      set((state) => {
        const selection = state.selections[playerId]
        if (selection?.status !== SELECTION_STATUS.CONFIRMED) return state
        return { selections: update(state.selections, playerId, { status: SELECTION_STATUS.SELECTING, confirmedId: null }) }
      }),

    reset: () => set({ selections: {} }),
  }))
}
