import { CUP_IDS, cupItemId, getCup } from '../config/cups'
import { useCourseStore } from './courseStore'
import { createSelectionStore } from './createSelectionStore'

// Curseurs de l'écran des circuits (même système de sélection que les personnages et les
// véhicules, un seul joueur inscrit : P1, qui choisit pour tout le monde en local) :
// - useCupSelectionStore : les coupes ;
// - useTrackSelectionStore : la carte « toute la coupe » puis les circuits de la coupe ouverte
//   (courseStore.cupId), qui changent d'une coupe à l'autre.
// Le programme choisi lui-même est dans courseStore.
export const useCupSelectionStore = createSelectionStore({
  itemIds: CUP_IDS,
  unique: false,
  defaultFor: () => CUP_IDS[0],
})

export function getOpenCupItems() {
  const cup = getCup(useCourseStore.getState().cupId)
  return cup ? [cupItemId(cup.id), ...cup.trackIds] : []
}

export const useTrackSelectionStore = createSelectionStore({
  itemIds: getOpenCupItems,
  unique: false,
  defaultFor: () => getOpenCupItems()[0] ?? null,
})
