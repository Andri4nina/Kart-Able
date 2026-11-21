import { getTrack } from './tracks'

// Coupes : 4 circuits chacune, dans l'ordre de la coupe. Ajouter une coupe = une entrée ici,
// ses circuits dans config/tracks.js et les textes cups.<id>.name dans chaque locale.
export const TRACKS_PER_CUP = 4

export const CUPS = Object.freeze([{ id: 'kairos', trackIds: ['kairosMeadow', 'mirrorLake', 'echoWoods', 'turquoiseCoast'] }])

// Tous les circuits sélectionnables, coupe par coupe (une rangée de la grille par coupe).
export const CUP_TRACK_IDS = Object.freeze(CUPS.flatMap((cup) => cup.trackIds))

export function getCup(cupId) {
  return CUPS.find((cup) => cup.id === cupId) ?? null
}

export function getTrackCup(trackId) {
  return CUPS.find((cup) => cup.trackIds.includes(trackId)) ?? null
}

export function getCupTracks(cupId) {
  return (getCup(cupId)?.trackIds ?? []).map(getTrack).filter(Boolean)
}
