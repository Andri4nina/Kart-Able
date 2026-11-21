import { PLAYER_IDS, PLAYER_STATUS } from '../config/players'

// PlayerSlot : un joueur local lié à un périphérique.
// Son personnage est géré à part (characterSelectionStore).
//
// @typedef {Object} PlayerSlot
// @property {string} id            'P1' ... 'P8'
// @property {number} index         0 ... 7 (position dans la grille, couleur)
// @property {number} number        1 ... 8
// @property {string} deviceId      InputDevice.id qui contrôle ce joueur
// @property {string} deviceKind
// @property {'joining'|'ready'} status
// @property {number} joinToken     distingue deux entrées successives sur le même slot

let nextJoinToken = 1

export function createPlayerSlot(index, device) {
  return {
    id: PLAYER_IDS[index],
    index,
    number: index + 1,
    deviceId: device.id,
    deviceKind: device.kind,
    status: PLAYER_STATUS.JOINING,
    joinToken: nextJoinToken++,
  }
}

export function firstFreeIndex(slots, limit) {
  const used = new Set(slots.map((slot) => slot.index))
  for (let index = 0; index < limit; index += 1) if (!used.has(index)) return index
  return -1
}
