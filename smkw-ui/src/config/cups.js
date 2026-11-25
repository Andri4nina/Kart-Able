import { getTrack } from './tracks'

// Coupes : 4 circuits chacune, dans l'ordre de la coupe. Ajouter une coupe = une entrée ici,
// ses circuits dans config/tracks.js et les textes cups.<id>.name dans chaque locale.
export const TRACKS_PER_CUP = 4

export const CUPS = Object.freeze([
  { id: 'kairos', trackIds: ['kairosMeadow', 'mirrorLake', 'echoWoods', 'turquoiseCoast'] },
  // Coupe des hauteurs : montées, descentes et crêtes qui font décoller.
  { id: 'summit', trackIds: ['sunsetCanyon', 'alpinePass', 'cloudRidge', 'duneRun'] },
])

// Tous les circuits, coupe par coupe.
export const CUP_TRACK_IDS = Object.freeze(CUPS.flatMap((cup) => cup.trackIds))

// Écran de choix : une rangée par coupe, la coupe entière en premier (ses 4 circuits à la
// suite) puis chacun de ses circuits (une seule course). Identifiant d'une coupe entière :
// `cup:<id>`.
const CUP_ITEM_PREFIX = 'cup:'
export const TRACK_SELECT_COLUMNS = TRACKS_PER_CUP + 1
export const cupItemId = (cupId) => `${CUP_ITEM_PREFIX}${cupId}`
export const TRACK_SELECT_IDS = Object.freeze(CUPS.flatMap((cup) => [cupItemId(cup.id), ...cup.trackIds]))

export function getCupFromItem(itemId) {
  return typeof itemId === 'string' && itemId.startsWith(CUP_ITEM_PREFIX) ? getCup(itemId.slice(CUP_ITEM_PREFIX.length)) : null
}

// Programme d'un choix : { cupId, trackIds } (coupe entière : ses 4 circuits ; circuit seul :
// une course, cupId null), ou null si le choix n'existe pas.
export function resolveCourse(itemId) {
  const cup = getCupFromItem(itemId)
  if (cup) return { cupId: cup.id, trackIds: [...cup.trackIds] }
  return getTrack(itemId) ? { cupId: null, trackIds: [itemId] } : null
}

export function getCup(cupId) {
  return CUPS.find((cup) => cup.id === cupId) ?? null
}

export function getTrackCup(trackId) {
  return CUPS.find((cup) => cup.trackIds.includes(trackId)) ?? null
}

export function getCupTracks(cupId) {
  return (getCup(cupId)?.trackIds ?? []).map(getTrack).filter(Boolean)
}
