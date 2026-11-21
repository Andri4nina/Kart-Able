// InputDevice : description d'un périphérique de contrôle, indépendante de son type.
//
// @typedef {Object} InputDevice
// @property {string} id          identifiant stable ('keyboard-1', 'gamepad-0', 'pointer'...)
// @property {'keyboard'|'gamepad'|'pointer'} kind
// @property {string} labelKey    clé i18n du nom affiché
// @property {Object} [labelParams]
// @property {number} [index]     index Gamepad API (manettes)
// @property {string} [name]      nom matériel renvoyé par le navigateur (manettes)
//
// Les touches de chaque périphérique ne sont pas décrites ici : elles viennent de l'assignation
// (onglet Contrôles des paramètres, voir bindingDefaults.js et bindingLookup.js).
// Ajouter un type de périphérique = une nouvelle fabrique ici + sa lecture dans inputManager.

export const DEVICE_KINDS = Object.freeze({
  KEYBOARD: 'keyboard',
  GAMEPAD: 'gamepad',
  POINTER: 'pointer',
})

// Un clavier physique peut accueillir deux joueurs : deux périphériques logiques.
export const KEYBOARD_1 = Object.freeze({
  id: 'keyboard-1',
  kind: DEVICE_KINDS.KEYBOARD,
  labelKey: 'input.keyboard1',
})

export const KEYBOARD_2 = Object.freeze({
  id: 'keyboard-2',
  kind: DEVICE_KINDS.KEYBOARD,
  labelKey: 'input.keyboard2',
})

export const KEYBOARD_DEVICES = Object.freeze([KEYBOARD_1, KEYBOARD_2])

// Souris / écran tactile : un seul joueur possible, via les contrôles à l'écran.
export const POINTER_DEVICE = Object.freeze({
  id: 'pointer',
  kind: DEVICE_KINDS.POINTER,
  labelKey: 'input.pointer',
})

export function gamepadDeviceId(index) {
  return `gamepad-${index}`
}

export function createGamepadDevice(index, name = '') {
  return Object.freeze({
    id: gamepadDeviceId(index),
    kind: DEVICE_KINDS.GAMEPAD,
    labelKey: 'input.gamepad',
    labelParams: { number: index + 1 },
    index,
    name,
  })
}
