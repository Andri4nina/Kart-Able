import { CHARACTERS } from '../config/characters'
import { getConfirmedId, getSelectionBlocker } from './selection/selectionRules'

// Règles propres aux personnages, au-dessus des règles génériques de sélection :
// un personnage confirmé est UNIQUE (réservé à son joueur).

export { areAllConfirmed, getReservationOwner, SELECTION_STATUS } from './selection/selectionRules'

export const CHARACTER_IDS = Object.freeze(CHARACTERS.map((character) => character.id))

// Curseur de départ : chaque joueur commence sur un personnage différent.
export function defaultCharacterId(playerIndex) {
  return CHARACTER_IDS[playerIndex % CHARACTER_IDS.length]
}

// Validation finale : 'charactersPending', 'duplicateCharacters' ou null.
export function getCharacterSelectionBlocker(playerIds, selections) {
  const blocker = getSelectionBlocker(playerIds, selections, true)
  if (blocker === 'pending') return 'charactersPending'
  if (blocker === 'duplicate') return 'duplicateCharacters'
  return null
}

export const getConfirmedCharacterId = getConfirmedId
