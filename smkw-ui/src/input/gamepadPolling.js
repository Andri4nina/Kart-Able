import { useInputDevicesStore } from '../stores/inputDevicesStore'
import { ACTION_BITS, ACTION_LIST } from './actions'
import { createGamepadDevice } from './devices'
import { readGamepadMask } from './gamepadMapping'

// Lecture des manettes (Gamepad API), à chaque frame UNIQUEMENT si une manette est connectée :
// l'API ne fournit pas d'événement par bouton. Chaque nouvel appui devient une action émise.

const previousMasks = new Map()
const gamepadDevices = new Map()
let emitInput = null
let pollHandle = 0

export function getGamepadDevice(pad) {
  let device = gamepadDevices.get(pad.index)
  if (!device) {
    device = createGamepadDevice(pad.index, pad.id)
    gamepadDevices.set(pad.index, device)
    useInputDevicesStore.getState().upsertDevice(device)
  }
  return device
}

function poll() {
  pollHandle = 0
  let connected = 0
  for (const pad of navigator.getGamepads?.() ?? []) {
    if (!pad?.connected) continue
    connected += 1
    const device = getGamepadDevice(pad)
    const mask = readGamepadMask(pad)
    const previous = previousMasks.get(pad.index) ?? 0
    if (mask !== previous) {
      for (const action of ACTION_LIST) {
        const bit = ACTION_BITS[action]
        if (mask & bit && !(previous & bit)) emitInput({ device, action })
      }
      previousMasks.set(pad.index, mask)
    }
  }
  // Plus aucune manette : on arrête la boucle, un événement gamepadconnected la relancera.
  if (connected > 0 && emitInput) pollHandle = requestAnimationFrame(poll)
}

function onConnected() {
  // On relit la liste plutôt que event.gamepad : plus robuste selon les navigateurs.
  for (const pad of navigator.getGamepads?.() ?? []) {
    if (pad?.connected) useInputDevicesStore.getState().upsertDevice(getGamepadDevice(pad))
  }
  if (emitInput && !pollHandle) pollHandle = requestAnimationFrame(poll)
}

function onDisconnected(event) {
  const index = event.gamepad?.index
  if (typeof index !== 'number') return
  previousMasks.delete(index)
  const device = gamepadDevices.get(index)
  if (device) useInputDevicesStore.getState().setConnected(device.id, false)
}

export function startGamepads(emit) {
  emitInput = emit
  window.addEventListener('gamepadconnected', onConnected)
  window.addEventListener('gamepaddisconnected', onDisconnected)
  onConnected()
}

export function stopGamepads() {
  emitInput = null
  window.removeEventListener('gamepadconnected', onConnected)
  window.removeEventListener('gamepaddisconnected', onDisconnected)
  if (pollHandle) cancelAnimationFrame(pollHandle)
  pollHandle = 0
  previousMasks.clear()
}
