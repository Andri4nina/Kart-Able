// Jeu en réseau (net/) : serveur de jeu smkw-api.
// - Réseau local : l'hôte lance l'application de bureau (ou smkw-api) sur LAN_PORT.
// - Internet : serveur public (ex. Fly.io, voir docs/HOSTING.md), adresse WebSocket sécurisée
//   fixée au build par la variable VITE_ONLINE_SERVER_URL, sinon le serveur Fly.io du projet
//   (DEFAULT_ONLINE_SERVER) : le site, la version servie par Fly et l'application de bureau se
//   retrouvent tous sur le même serveur sans réglage. `none` : aucun serveur en ligne.
export const LAN_PORT = 2567
const DEFAULT_ONLINE_SERVER = 'wss://kart-able-server.fly.dev/ws'
const configured = String(import.meta.env?.VITE_ONLINE_SERVER_URL ?? '').trim()
export const ONLINE_SERVER_URL = configured === 'none' ? '' : configured || DEFAULT_ONLINE_SERVER

// Chat vocal des parties en réseau (net/voiceChat.js) : audio direct entre machines (WebRTC),
// négocié par le serveur de jeu. Serveur STUN public pour traverser les box Internet ; sur un
// même réseau local, il n'est pas nécessaire. Le micro exige une page sécurisée (https ou
// localhost) : sur une adresse http du réseau local, le navigateur le refuse.
export const VOICE = Object.freeze({
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
})
