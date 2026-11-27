// Jeu en réseau (net/) : serveur de jeu smkw-api.
// - Réseau local : l'hôte lance l'application de bureau (ou smkw-api) sur LAN_PORT.
// - Internet : serveur public (ex. Fly.io, voir docs/HOSTING.md), adresse WebSocket sécurisée
//   fixée au build par la variable VITE_ONLINE_SERVER_URL (ex. wss://kart-able.fly.dev/ws) ;
//   vide = pas de serveur en ligne configuré (on peut toujours saisir une adresse).
export const LAN_PORT = 2567
export const ONLINE_SERVER_URL = String(import.meta.env?.VITE_ONLINE_SERVER_URL ?? '').trim()
