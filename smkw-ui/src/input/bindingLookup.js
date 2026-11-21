import { useBindingsStore } from '../stores/bindingsStore'
import { BINDING_PROFILES } from './bindingDefaults'
import { KEYBOARD_DEVICES } from './devices'

// Tables de lecture des assignations, reconstruites seulement quand elles changent (jamais
// par touche ni par frame) :
// - clavier : event.code -> [{ device, action }] (une touche peut servir menus ET course) ;
// - manettes : [[indice de bouton, action]] (disposition commune à toutes les manettes).

const NONE = Object.freeze([])
let keyboardIndex = new Map()
let gamepadButtons = []

function rebuild(bindings) {
  keyboardIndex = new Map()
  gamepadButtons = []
  for (const profile of BINDING_PROFILES) {
    const device = KEYBOARD_DEVICES.find((candidate) => candidate.id === profile.deviceId)
    for (const [action, entries] of Object.entries(bindings[profile.id])) {
      for (const entry of entries) {
        if (profile.kind === 'gamepad') gamepadButtons.push([entry, action])
        else if (device) keyboardIndex.set(entry, [...(keyboardIndex.get(entry) ?? NONE), { device, action }])
      }
    }
  }
}

rebuild(useBindingsStore.getState().bindings)
useBindingsStore.subscribe((state, previous) => {
  if (state.bindings !== previous.bindings) rebuild(state.bindings)
})

export function findKeyboardBindings(code) {
  return keyboardIndex.get(code) ?? NONE
}

export function getGamepadButtonBindings() {
  return gamepadButtons
}
