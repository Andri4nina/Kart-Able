import { LAN_PORT } from '../config/network'

// Connexion WebSocket au serveur de jeu (smkw-api) : une seule à la fois. Messages JSON
// (champ `t`), voir smkw-api/src/protocol.rs. Aucune logique de jeu ici.
const listeners = new Set()
let socket = null

// Adresse WebSocket :
// - vide : le serveur qui a servi la page (application de bureau, jeu ouvert depuis l'adresse
//   d'un hôte du réseau local, ou serveur en ligne qui sert aussi le jeu) ;
// - « ws(s)://... » : telle quelle ; « https://nom » : wss://nom/ws ;
// - IP, localhost, nom de machine sans point ou « hôte:port » : réseau local, ws://hôte:port (LAN_PORT par défaut) ;
// - nom de domaine seul (ex. kart-able.fly.dev) : serveur en ligne, wss://nom/ws.
const LOCAL_HOST = /^(localhost|\d{1,3}(\.\d{1,3}){3}|\[[0-9a-f:]+\])$/i

export function toSocketUrl(address) {
  const value = String(address ?? '').trim()
  if (!value) return `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`
  if (/^wss?:\/\//.test(value)) return value
  const secure = value.startsWith('https://')
  const host = value.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
  const domain = host.includes('.') && !host.includes(':') && !LOCAL_HOST.test(host)
  if (secure || domain) return `wss://${host}/ws`
  return `ws://${host.includes(':') ? host : `${host}:${LAN_PORT}`}/ws`
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
