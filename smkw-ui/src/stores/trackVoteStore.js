import { createSelectionStore } from './createSelectionStore'
import { useRaceFlowStore } from './raceFlowStore'

// Vote du circuit suivant : même système de sélection que les autres écrans, un choix par
// joueur local ; les circuits proposés changent à chaque vote (raceFlowStore.options).
const getOptions = () => useRaceFlowStore.getState().options

export const useTrackVoteStore = createSelectionStore({
  itemIds: getOptions,
  unique: false,
  defaultFor: () => getOptions()[0] ?? null,
})
