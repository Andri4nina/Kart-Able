// Règles pures d'une sélection par joueur (personnages, véhicules...), sans React ni store.
// `unique` : un élément CONFIRMÉ est réservé à son joueur (personnages) ; sinon partageable
// (véhicules). Une simple présélection ne réserve jamais rien.

export const SELECTION_STATUS = Object.freeze({
  SELECTING: 'selecting',
  CONFIRMED: 'confirmed',
})

export function createSelection(preselectedId) {
  return { status: SELECTION_STATUS.SELECTING, preselectedId, confirmedId: null, lastMove: 1, rejections: 0 }
}

// Joueur qui a confirmé cet élément, ou null.
export function getReservationOwner(selections, itemId) {
  for (const [playerId, selection] of Object.entries(selections)) {
    if (selection.status === SELECTION_STATUS.CONFIRMED && selection.confirmedId === itemId) return playerId
  }
  return null
}

export function isAvailableFor(selections, itemId, playerId, unique) {
  if (!unique) return true
  const owner = getReservationOwner(selections, itemId)
  return owner === null || owner === playerId
}

// Pourquoi ce joueur ne peut pas confirmer (null = il peut).
export function getConfirmBlocker(selections, playerId, unique) {
  const selection = selections[playerId]
  if (!selection) return 'unknownPlayer'
  if (selection.status === SELECTION_STATUS.CONFIRMED) return 'alreadyConfirmed'
  if (!selection.preselectedId) return 'noPreselection'
  if (!isAvailableFor(selections, selection.preselectedId, playerId, unique)) return 'reserved'
  return null
}

// Prochain élément disponible dans le sens `delta` (±1 ou ±colonnes) parmi `itemIds`,
// en sautant ceux réservés par d'autres. Reste sur place si aucun n'est libre dans ce sens.
export function findNextAvailable(selections, playerId, fromId, delta, itemIds, unique) {
  const count = itemIds.length
  const start = Math.max(0, itemIds.indexOf(fromId))
  for (let step = 1; step < count; step += 1) {
    const index = (((start + delta * step) % count) + count) % count
    if (index === start) break
    if (isAvailableFor(selections, itemIds[index], playerId, unique)) return itemIds[index]
  }
  return fromId
}

export function areAllConfirmed(playerIds, selections) {
  return (
    playerIds.length > 0 &&
    playerIds.every((playerId) => selections[playerId]?.status === SELECTION_STATUS.CONFIRMED)
  )
}

// Validation finale : 'pending' (un joueur n'a pas confirmé), 'duplicate' (élément unique
// confirmé deux fois), ou null.
export function getSelectionBlocker(playerIds, selections, unique) {
  if (!areAllConfirmed(playerIds, selections)) return 'pending'
  if (!unique) return null
  const confirmed = playerIds.map((playerId) => selections[playerId].confirmedId)
  return new Set(confirmed).size === confirmed.length ? null : 'duplicate'
}

export function getConfirmedId(selections, playerId) {
  const selection = selections[playerId]
  return selection?.status === SELECTION_STATUS.CONFIRMED ? selection.confirmedId : null
}

// Élément affiché pour un joueur (confirmé, sinon présélectionné).
export function getDisplayedId(selection) {
  return selection?.confirmedId ?? selection?.preselectedId ?? null
}
