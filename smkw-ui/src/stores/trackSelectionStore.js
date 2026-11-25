import { TRACK_SELECT_IDS } from '../config/cups'
import { createSelectionStore } from './createSelectionStore'

// Choix de la coupe ou du circuit : même système de sélection que les personnages et les
// véhicules, avec un seul joueur inscrit (P1, qui choisit pour tout le monde en local).
// Éléments : coupe entière (`cup:<id>`, présélectionnée par défaut) puis ses circuits.
export const useTrackSelectionStore = createSelectionStore({
  itemIds: TRACK_SELECT_IDS,
  unique: false,
  defaultFor: () => TRACK_SELECT_IDS[0],
})
