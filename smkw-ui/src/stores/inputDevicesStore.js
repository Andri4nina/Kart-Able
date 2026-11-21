import { create } from 'zustand'
import { KEYBOARD_DEVICES, POINTER_DEVICE } from '../input/devices'

const initialDevices = Object.fromEntries(
  [...KEYBOARD_DEVICES, POINTER_DEVICE].map((device) => [device.id, { ...device, connected: true }]),
)

// Périphériques connus (claviers logiques, tactile, manettes détectées) et leur état de connexion.
// Mis à jour uniquement à la connexion / déconnexion, jamais par frame.
export const useInputDevicesStore = create((set) => ({
  devices: initialDevices,

  upsertDevice: (device) =>
    set((state) => ({ devices: { ...state.devices, [device.id]: { ...device, connected: true } } })),

  setConnected: (deviceId, connected) =>
    set((state) => {
      const device = state.devices[deviceId]
      if (!device || device.connected === connected) return state
      return { devices: { ...state.devices, [deviceId]: { ...device, connected } } }
    }),
}))
