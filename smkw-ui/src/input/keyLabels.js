import { getProfileIdForDevice } from './bindingDefaults'

// Noms affichables des touches et boutons. Renvoie { labelKey, params } (texte traduit) ou
// { text } (caractère de la touche). `layout` : carte event.code -> caractère de la
// disposition réelle du clavier (AZERTY : KeyW -> z), quand le navigateur la fournit.
const NAMED_KEYS = {
  Enter: 'keys.enter',
  NumpadEnter: 'keys.numpadEnter',
  Space: 'keys.space',
  Backspace: 'keys.backspace',
  ShiftLeft: 'keys.shiftLeft',
  ShiftRight: 'keys.shiftRight',
  ControlLeft: 'keys.controlLeft',
  ControlRight: 'keys.controlRight',
  AltLeft: 'keys.altLeft',
  AltRight: 'keys.altRight',
  CapsLock: 'keys.capsLock',
  Delete: 'keys.delete',
  Insert: 'keys.insert',
  Home: 'keys.home',
  End: 'keys.end',
  PageUp: 'keys.pageUp',
  PageDown: 'keys.pageDown',
  ArrowUp: 'keys.arrowUp',
  ArrowDown: 'keys.arrowDown',
  ArrowLeft: 'keys.arrowLeft',
  ArrowRight: 'keys.arrowRight',
}

export function describeKey(code, layout) {
  if (NAMED_KEYS[code]) return { labelKey: NAMED_KEYS[code] }
  if (code.startsWith('Numpad')) return { labelKey: 'keys.numpad', params: { key: code.slice(6) } }
  const character = layout?.get(code)
  if (character && character.trim()) return { text: character.toUpperCase() }
  if (/^Key[A-Z]$/.test(code)) return { text: code.slice(3) }
  if (/^Digit\d$/.test(code)) return { text: code.slice(5) }
  return { text: code }
}

// Boutons de la disposition standard (0 = A / Croix ... 16 = Home).
export function describeButton(index) {
  return index >= 0 && index <= 16 ? { labelKey: `buttons.b${index}` } : { labelKey: 'buttons.other', params: { number: index } }
}

export function describeInput(kind, entry, layout) {
  return kind === 'gamepad' ? describeButton(entry) : describeKey(entry, layout)
}

const ARROW_KEYS = ['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight']
const DPAD_BUTTONS = [12, 14, 13, 15]

// Touches d'un périphérique pour les aides à l'écran : START, RETOUR et déplacements, d'après
// l'assignation. Renvoie null pour un périphérique sans touches (tactile).
export function getDeviceKeys(device, bindings) {
  const profileId = getProfileIdForDevice(device)
  if (!profileId) return null
  const entries = bindings[profileId]
  const kind = device.kind === 'gamepad' ? 'gamepad' : 'keyboard'
  const move = [entries.up[0], entries.left[0], entries.down[0], entries.right[0]]
  const grouped = (kind === 'gamepad' ? DPAD_BUTTONS : ARROW_KEYS).every((entry, index) => move[index] === entry)
  return { kind, start: entries.start[0], back: entries.back[0], move, moveLabelKey: grouped ? (kind === 'gamepad' ? 'input.dpad' : 'keys.arrows') : null }
}
