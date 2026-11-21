import { MAX_LOCAL_PLAYERS } from './gameModes'

// Identifiants des joueurs locaux : P1 à P8 (index 0 à 7).
export const PLAYER_IDS = Object.freeze(Array.from({ length: MAX_LOCAL_PLAYERS }, (_, index) => `P${index + 1}`))

export const PLAYER_STATUS = Object.freeze({
  JOINING: 'joining',
  READY: 'ready',
})

// Durée de l'animation d'entrée : le joueur passe READY à la fin (même valeur côté UI).
export const PLAYER_ENTRY_DURATION_MS = 520
