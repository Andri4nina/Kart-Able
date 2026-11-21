// PlayerInput : entrée d'un périphérique rattachée (ou non) à un joueur.
//
// @typedef {Object} PlayerInput
// @property {string} action          voir INPUT_ACTIONS
// @property {import('./devices').InputDevice} device
// @property {string|null} playerId   'P1'...'P8', ou null si le périphérique n'a pas encore rejoint
//
// C'est la seule forme d'entrée que voient les écrans et les systèmes de jeu.

export function toPlayerInput({ device, action }, slots) {
  const slot = slots.find((candidate) => candidate.deviceId === device.id)
  return { action, device, playerId: slot?.id ?? null }
}
