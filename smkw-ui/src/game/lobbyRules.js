// Règles pures du lobby local (`ready` : { [playerId]: true }).

export function getUnreadyPlayerIds(playerIds, ready) {
  return playerIds.filter((id) => !ready[id])
}

export function areAllReady(playerIds, ready) {
  return playerIds.length > 0 && getUnreadyPlayerIds(playerIds, ready).length === 0
}
