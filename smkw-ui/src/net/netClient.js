// Connexion WebSocket au serveur de jeu (smkw-api) : une seule à la fois. Messages JSON
// (champ `t`), voir smkw-api/src/protocol.rs. Aucune logique de jeu ici.
const listeners = new Set()
let socket = null

// Adresse WebSocket : vide = le serveur qui a servi la page (application de bureau, ou jeu
// ouvert depuis l'adresse d'un hôte du réseau local) ; sinon « 192.168.1.20:2567 » ou une URL.
export function toSocketUrl(address) {
  const value = String(address ?? '').trim()
  if (!value) return `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`
  if (/^wss?:\/\//.test(value)) return value
  const host = value.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
  return `ws://${host.includes(':') ? host : `${host}:2567`}/ws`
}

// Adresse HTTP du même serveur (fichiers, /api/info).
export function toHttpUrl(address, path) {
  return toSocketUrl(address).replace(/^ws/, 'http').replace(/\/ws$/, path)
}

export function openSocket(address, { onOpen, onClose }) {
  closeSocket()
  const current = new WebSocket(toSocketUrl(address))
  socket = current
  current.onopen = () => onOpen?.()
  current.onclose = () => {
    if (socket === current) socket = null
    onClose?.()
  }
  current.onmessage = (event) => {
    let message = null
    try {
      message = JSON.parse(event.data)
    } catch {
      return
    }
    for (const listener of listeners) listener(message)
  }
}

export function sendMessage(message) {
  if (socket?.readyState !== WebSocket.OPEN) return false
  socket.send(JSON.stringify(message))
  return true
}

export function onServerMessage(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function closeSocket() {
  const current = socket
  socket = null
  current?.close()
}
