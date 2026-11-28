import { getTrack } from './tracks'

// Coupes : 4 circuits chacune, dans l'ordre de la coupe. Ajouter une coupe = une entrée ici,
// ses circuits dans config/tracks.js et les textes cups.<id>.name dans chaque locale.
export const TRACKS_PER_CUP = 4

export const CUPS = Object.freeze([
  { id: 'kairos', trackIds: ['kairosMeadow', 'mirrorLake', 'echoWoods', 'turquoiseCoast'] },
  // Coupe des hauteurs : montées, descentes et crêtes qui font décoller.
  { id: 'summit', trackIds: ['sunsetCanyon', 'alpinePass', 'cloudRidge', 'duneRun'] },
  // Coupe des neiges : routes de neige tassée, lacs glacés, forêts de sapins.
  { id: 'frostbloom', trackIds: ['frostHollow', 'borealPass', 'icefallRun', 'whitePines'] },
  // Coupe de la terre battue : pistes brunes, mesas, carrières, ornières.
  { id: 'dustrail', trackIds: ['rustMesa', 'clayQuarry', 'dustWhirl', 'rutRally'] },
  // Coupe technique : aucun objet, routes étroites, épingles et chicanes ; seul le pilotage compte.
  { id: 'pax', trackIds: ['paxGardens', 'lanternPass', 'stillwaterBend', 'zenithSpiral'] },
  // Coupe des choix : embranchements à deux voies équilibrées, nombreux passages en deltaplane.
  { id: 'duet', trackIds: ['duetMeadows', 'forkCanyon', 'twinIsles', 'skyFork'] },
  // Coupe de l'eau : voies d'eau où les karts flottent et glissent.
  { id: 'water', trackIds: ['lagoonRun', 'riverRapids', 'mangroveMaze', 'harborDash'] },
])

// Tous les circuits, coupe par coupe.
export const CUP_TRACK_IDS = Object.freeze(CUPS.flatMap((cup) => cup.trackIds))

// Écran des circuits : on ouvre une coupe, puis on compose son programme parmi ses circuits ;
// la première carte de la coupe ajoute (ou retire) tous ses circuits d'un coup. Identifiant de
// cette carte : `cup:<id>`.
const CUP_ITEM_PREFIX = 'cup:'
export const CUP_IDS = Object.freeze(CUPS.map((cup) => cup.id))
export const TRACK_SELECT_COLUMNS = TRACKS_PER_CUP + 1
export const cupItemId = (cupId) => `${CUP_ITEM_PREFIX}${cupId}`

export function getCupFromItem(itemId) {
  return typeof itemId === 'string' && itemId.startsWith(CUP_ITEM_PREFIX) ? getCup(itemId.slice(CUP_ITEM_PREFIX.length)) : null
}

// Programme d'une partie : les circuits choisis (`playlist`, dans l'ordre), ou toute la coupe
// ouverte si aucun circuit n'a été choisi. Renvoie { cupId, trackIds } (cupId : la coupe dont
// le programme est exactement les circuits, sinon null), ou null si rien n'est choisi.
export function resolveCourse(playlist = [], openCupId = null) {
  const chosen = playlist.length ? playlist : (getCup(openCupId)?.trackIds ?? [])
  const trackIds = chosen.filter((trackId) => getTrack(trackId))
  if (!trackIds.length) return null
  const cup = CUPS.find((entry) => entry.trackIds.length === trackIds.length && entry.trackIds.every((id, index) => trackIds[index] === id))
  return { cupId: cup?.id ?? null, trackIds }
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
