// Profils d'assignation et touches par défaut. Touches clavier = event.code (position physique,
// identique en QWERTY et AZERTY : KeyW est le Z d'un clavier français). Boutons manette =
// indices de la disposition standard de la Gamepad API (0 = A / Croix, 9 = Start...).

export const BINDING_SLOTS = 2 // deux touches possibles par action

export const BINDING_PROFILES = Object.freeze([
  { id: 'keyboard1', kind: 'keyboard', deviceId: 'keyboard-1', labelKey: 'input.keyboard1' },
  { id: 'keyboard2', kind: 'keyboard', deviceId: 'keyboard-2', labelKey: 'input.keyboard2' },
  { id: 'gamepad', kind: 'gamepad', deviceId: null, labelKey: 'settings.controls.gamepads' },
])

export function getBindingProfile(profileId) {
  return BINDING_PROFILES.find((profile) => profile.id === profileId) ?? null
}

// Profil d'un périphérique : son clavier logique, ou la disposition commune des manettes.
export function getProfileIdForDevice(device) {
  if (device?.kind === 'gamepad') return 'gamepad'
  return BINDING_PROFILES.find((profile) => profile.deviceId === device?.id)?.id ?? null
}

// Réservées : navigation globale (Échap), plein écran (F), focus (Tab), touches système.
export const RESERVED_CODES = Object.freeze(
  new Set(['Escape', 'KeyF', 'Tab', 'MetaLeft', 'MetaRight', 'ContextMenu', ...Array.from({ length: 12 }, (_, i) => `F${i + 1}`)]),
)

export const DEFAULT_BINDINGS = Object.freeze({
  keyboard1: {
    start: ['Enter', 'NumpadEnter'],
    confirm: [],
    back: ['Backspace'],
    up: ['ArrowUp'],
    down: ['ArrowDown'],
    left: ['ArrowLeft'],
    right: ['ArrowRight'],
    accelerate: ['ArrowUp'],
    brake: ['ArrowDown'],
    steerLeft: ['ArrowLeft'],
    steerRight: ['ArrowRight'],
    drift: ['ShiftRight'],
    item: ['ControlRight'],
  },
  keyboard2: {
    start: ['Space'],
    confirm: [],
    back: ['ShiftLeft'],
    up: ['KeyW'],
    down: ['KeyS'],
    left: ['KeyA'],
    right: ['KeyD'],
    accelerate: ['KeyW'],
    brake: ['KeyS'],
    steerLeft: ['KeyA'],
    steerRight: ['KeyD'],
    drift: ['KeyQ'],
    item: ['KeyE'],
  },
  gamepad: {
    start: [9],
    confirm: [0],
    back: [1, 8],
    up: [12],
    down: [13],
    left: [14],
    right: [15],
    accelerate: [0],
    brake: [1],
    steerLeft: [14],
    steerRight: [15],
    drift: [5, 7],
    item: [4, 6],
  },
})
