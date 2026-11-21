import { useBindingsStore } from '../stores/bindingsStore'
import { ACTION_CONTEXTS } from './actions'
import { getProfileIdForDevice } from './bindingDefaults'
import { findKeyboardBindings } from './bindingLookup'
import { isTextField } from './inputManager'

// Commandes de conduite : des actions TENUES (accélérer tant que la touche est enfoncée), lues
// à chaque frame par la course, là où inputManager émet des appuis pour les menus.
// Clavier : touches enfoncées (keydown / keyup) ; manettes : boutons (valeur analogique des
// gâchettes) et stick gauche proportionnel. Toujours d'après l'assignation des touches.
const STICK_DEADZONE = 0.15
const held = new Set()
let users = 0
let pads = []

// Une touche de course ne doit ni faire défiler la page ni activer un bouton focalisé.
function isRaceKey(code) {
  for (const binding of findKeyboardBindings(code)) if (ACTION_CONTEXTS[binding.action] === 'race') return true
  return false
}

function onKeyDown(event) {
  if (isTextField(event.target)) return
  held.add(event.code)
  if (isRaceKey(event.code)) event.preventDefault()
}

const onKeyUp = (event) => held.delete(event.code)
const releaseAll = () => held.clear()

// Écoute active seulement pendant une course (compteur d'utilisateurs).
export function attachDriveControls() {
  users += 1
  if (users === 1) {
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', releaseAll)
  }
  return () => {
    users -= 1
    if (users > 0) return
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
    window.removeEventListener('blur', releaseAll)
    held.clear()
  }
}

// Une fois par frame : état des manettes (la Gamepad API ne fournit pas d'événement).
export function pollDriveControls() {
  pads = navigator.getGamepads?.() ?? []
}

function keyValue(entries) {
  for (const code of entries) if (held.has(code)) return 1
  return 0
}

function buttonValue(pad, entries) {
  if (!pad) return keyValue(entries)
  let value = 0
  for (const index of entries) {
    const button = pad.buttons[index]
    if (button) value = Math.max(value, button.pressed ? 1 : 0, button.value ?? 0)
  }
  return value
}

// Remplit `out` ({ throttle, brake, steer, drift, item }) pour le périphérique d'un joueur.
export function readDriveControls(device, out) {
  out.throttle = 0
  out.brake = 0
  out.steer = 0
  out.drift = false
  out.item = false
  const profileId = getProfileIdForDevice(device)
  const bindings = profileId ? useBindingsStore.getState().bindings[profileId] : null
  if (!bindings) return out
  // Manette : ses boutons ; clavier (pad null) : les touches enfoncées.
  const pad = device.kind === 'gamepad' ? pads[device.index] : null
  if (device.kind === 'gamepad' && !pad?.connected) return out
  out.throttle = buttonValue(pad, bindings.accelerate)
  out.brake = buttonValue(pad, bindings.brake)
  out.steer = buttonValue(pad, bindings.steerRight) - buttonValue(pad, bindings.steerLeft)
  out.drift = buttonValue(pad, bindings.drift) > 0.5
  out.item = buttonValue(pad, bindings.item) > 0.5
  const stick = pad?.axes[0] ?? 0
  if (Math.abs(stick) > STICK_DEADZONE && out.steer === 0) {
    out.steer = Math.sign(stick) * Math.min(1, (Math.abs(stick) - STICK_DEADZONE) / (1 - STICK_DEADZONE))
  }
  return out
}
