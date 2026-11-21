import { useInputDevicesStore } from '../stores/inputDevicesStore'
import { ACTION_LIST } from './actions'
import { findKeyboardBindings } from './bindingLookup'
import { createGamepadDevice, POINTER_DEVICE } from './devices'
import { startGamepads, stopGamepads } from './gamepadPolling'

// Gestionnaire d'entrées unique. Il n'écoute rien tant qu'aucun écran ne s'est abonné :
// - claviers : un listener keydown, touches lues dans l'assignation (bindingLookup) ;
// - manettes : gamepadPolling (seulement si une manette est connectée) ;
// - tactile / souris : émis par les contrôles à l'écran (emitPointerInput).
//
// Chaque entrée est émise sous la forme { device, action } (voir actions.js / devices.js).
// Un abonné renvoie true s'il a utilisé l'entrée : la touche est alors neutralisée
// (pas d'activation de bouton ni de défilement).

const listeners = new Set()

const TEXT_INPUT_TYPES = new Set(['text', 'search', 'email', 'password', 'number', 'url', 'tel'])

export function isTextField(target) {
  if (!(target instanceof HTMLElement)) return false
  if (target.isContentEditable || target.tagName === 'TEXTAREA') return true
  return target.tagName === 'INPUT' && TEXT_INPUT_TYPES.has(target.type)
}

// Un bouton atteint au clavier (Tab) garde son activation native par Entrée / Espace.
// Un bouton simplement cliqué à la souris ne capte pas ces touches.
function isKeyboardFocusedControl(target) {
  return target instanceof HTMLElement && target.matches('button, a, select, input') && target.matches(':focus-visible')
}

function emit(input) {
  let handled = false
  for (const listener of listeners) handled = listener(input) === true || handled
  return handled
}

// Une touche peut porter plusieurs actions (ex. Haut dans les menus, Accélérer en course) :
// toutes sont émises, chaque écran ne retient que celles qu'il connaît.
function onKeyDown(event) {
  if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return
  if (isTextField(event.target)) return
  const bindings = findKeyboardBindings(event.code)
  if (bindings.length === 0) return
  if ((event.code === 'Enter' || event.code === 'Space' || event.code === 'NumpadEnter') && isKeyboardFocusedControl(event.target)) return
  let handled = false
  for (const binding of bindings) handled = emit(binding) || handled
  if (handled) event.preventDefault()
}

function attach() {
  window.addEventListener('keydown', onKeyDown)
  startGamepads(emit)
}

function detach() {
  window.removeEventListener('keydown', onKeyDown)
  stopGamepads()
}

export function subscribeToInput(listener) {
  listeners.add(listener)
  if (listeners.size === 1) attach()
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) detach()
  }
}

// Contrôles à l'écran (clic / toucher) : le périphérique "tactile" appuie sur une action.
export function emitPointerInput(action) {
  return emit({ device: POINTER_DEVICE, action })
}

// Tests uniquement : simule une action d'un périphérique (manette virtuelle si inconnue).
export function injectDeviceInput(deviceId, action) {
  const devices = useInputDevicesStore.getState().devices
  let device = devices[deviceId]
  const gamepadMatch = /^gamepad-(\d+)$/.exec(deviceId)
  if (!device && gamepadMatch) {
    device = createGamepadDevice(Number(gamepadMatch[1]), 'virtual')
    useInputDevicesStore.getState().upsertDevice(device)
  }
  if (!device || !ACTION_LIST.includes(action)) return false
  return emit({ device, action })
}
