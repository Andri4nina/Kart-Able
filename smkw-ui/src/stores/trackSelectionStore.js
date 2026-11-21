import { CUP_TRACK_IDS } from '../config/cups'
import { createSelectionStore } from './createSelectionStore'

// Choix du circuit : même système de sélection que les personnages et les véhicules, avec un
// seul joueur inscrit (P1, qui choisit pour tout le monde en local).
export const useTrackSelectionStore = createSelectionStore({
  itemIds: CUP_TRACK_IDS,
  unique: false,
  defaultFor: () => CUP_TRACK_IDS[0],
})
