import { CHARACTER_IDS, defaultCharacterId } from '../game/characterSelectionRules'
import { createSelectionStore } from './createSelectionStore'

// Sélection des personnages : un personnage confirmé est réservé à un seul joueur.
export const useCharacterSelectionStore = createSelectionStore({
  itemIds: CHARACTER_IDS,
  unique: true,
  defaultFor: defaultCharacterId,
})
