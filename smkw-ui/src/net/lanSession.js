import { PLAY_TYPES } from '../config/gameModes'
import { useCharacterSelectionStore } from '../stores/characterSelectionStore'
import { useLobbyReadyStore } from '../stores/lobbyReadyStore'
import { useLocalPlayersStore } from '../stores/localPlayersStore'
import { useMatchSetupStore } from '../stores/matchSetupStore'
import { useNetStore } from '../stores/netStore'
import { useVehicleSelectionStore } from '../stores/vehicleSelectionStore'
import { getConfirmedId } from '../game/selection/selectionRules'
import { closeSocket, onServerMessage, openSocket, sendMessage, toHttpUrl } from './netClient'

// Session réseau (réseau local ou serveur en ligne) : connexion, salons, profil des joueurs de
// cette machine. Les messages
// de jeu relayés (départ, karts) vont aux abonnés de `onRelay` (net/netMatch.js).
const relayListeners = new Set()
let detach = null

export const onRelay = (listener) => (relayListeners.add(listener), () => relayListeners.delete(listener))
const set = (patch) => useNetStore.getState().set(patch)

function syncSetup(room) {
  const { clientId } = useNetStore.getState()
  const online = room ? { role: room.hostId === clientId ? 'host' : 'guest', code: room.code } : { role: null, code: '' }
  useMatchSetupStore.setState({ online })
}

const HANDLERS = {
  welcome: (message) => {
    set({ status: 'connected', clientId: message.clientId, error: null })
    sendMessage({ t: 'list' })
    // Adresse du serveur sur le réseau local, à communiquer aux autres joueurs ; un serveur qui
    // annonce une adresse publique est un serveur en ligne (salons privés).
    fetch(toHttpUrl(useNetStore.getState().address, '/api/info'))
      .then((response) => response.json())
      .then((info) => set(info.public ? { online: true, lanUrl: null } : { lanUrl: useNetStore.getState().online ? null : (info.lan?.[0] ?? null) }))
      .catch(() => set({ lanUrl: null }))
  },
  rooms: (message) => set({ rooms: message.rooms }),
  room: (message) => {
    set({ room: message.room, error: null })
    syncSetup(message.room)
  },
  closed: () => {
    set({ room: null, error: 'roomClosed' })
    syncSetup(null)
    for (const listener of relayListeners) listener({ kind: 'closed' }, null)
  },
  error: (message) => set({ error: message.reason }),
  relay: (message) => {
    for (const listener of relayListeners) listener(message.data, message.from)
  },
}

// `online` : serveur public sur Internet (salons privés, rejoints par leur code).
export function connectToServer(address = '', { online = false } = {}) {
  detach?.()
  detach = onServerMessage((message) => HANDLERS[message.t]?.(message))
  set({ status: 'connecting', address, online, lanUrl: null, error: null, room: null, rooms: [] })
  openSocket(address, {
    onOpen: () => sendMessage({ t: 'hello', name: navigator.platform ? `Kart Able ${navigator.platform}` : 'Kart Able' }),
    onClose: () => {
      const wasConnected = useNetStore.getState().status === 'connected'
      set({ status: 'error', room: null, error: wasConnected ? 'connectionLost' : 'serverNotFound' })
      syncSetup(null)
    },
  })
}

export function disconnect() {
  detach?.()
  detach = null
  closeSocket()
  useNetStore.getState().reset()
  syncSetup(null)
}

export const refreshRooms = () => sendMessage({ t: 'list' })
export const createRoom = () => sendMessage({ t: 'create', modeId: useMatchSetupStore.getState().modeId, private: useNetStore.getState().online })
export const joinRoom = (code) => sendMessage({ t: 'join', code })
export function leaveRoom() {
  sendMessage({ t: 'leave' })
  set({ room: null })
  syncSetup(null)
  sendMessage({ t: 'list' })
}
export const sendRelay = (data) => sendMessage({ t: 'relay', data })
export const setRoomPhase = (phase) => sendMessage({ t: 'phase', phase })

export const isLanGame = () => useMatchSetupStore.getState().playType === PLAY_TYPES.ONLINE

// Joueurs de cette machine pour les autres : personnage, véhicule, prêt.
export function publishProfile() {
  if (!useNetStore.getState().room) return
  const characters = useCharacterSelectionStore.getState().selections
  const vehicles = useVehicleSelectionStore.getState().selections
  const ready = useLobbyReadyStore.getState().ready
  const players = useLocalPlayersStore.getState().slots.map((slot) => ({
    localId: slot.id,
    characterId: getConfirmedId(characters, slot.id),
    vehicleId: getConfirmedId(vehicles, slot.id),
    ready: Boolean(ready[slot.id]),
  }))
  sendMessage({ t: 'profile', players })
}
