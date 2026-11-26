import { GAME_MODES, PLAY_TYPE_LIMITS, PLAY_TYPES, ROOM_CODE_LENGTH } from '../config/gameModes'
import { resolveCourse } from '../config/cups'
import { getCharacterSelectionBlocker } from './characterSelectionRules'
import { getSelectionBlocker } from './selection/selectionRules'

// Choix des écrans de sélection : { characters, vehicles } (sélections par joueur) et course
// (écran des circuits, modes de course : { cupId, playlist }, voir resolveCourse). Configuration
// figée : voir matchConfig.js.
export const NO_PICKS = Object.freeze({ characters: {}, vehicles: {}, course: null })

// Règles pures de configuration d'une partie (aucun React, aucun store).

export function getGameMode(modeId) {
  return GAME_MODES.find((mode) => mode.id === modeId) ?? null
}

export function getPlayerLimit(mode, playType) {
  const cap = PLAY_TYPE_LIMITS[playType] ?? 0
  return Math.min(cap, mode?.players?.[playType] ?? 0)
}

export function isPlayTypeAvailable(mode, playType) {
  return getPlayerLimit(mode, playType) > 0
}

// Le mode se court-il sur un circuit (choix de la coupe et du circuit) ?
export function modeUsesTracks(modeId) {
  return Boolean(getGameMode(modeId)?.tracks)
}

const ROOM_CODE_PATTERN = new RegExp(`^[A-Z0-9]{${ROOM_CODE_LENGTH}}$`)

export function normalizeRoomCode(raw) {
  return raw
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, ROOM_CODE_LENGTH)
}

export function isValidRoomCode(code) {
  return ROOM_CODE_PATTERN.test(code)
}

// Raison empêchant de lancer la partie, ou null si tout est prêt.
// `localSlots` : PlayerSlot[] ; `picks` : voir NO_PICKS.
export function getStartBlocker(setup, localSlots = [], picks = NO_PICKS) {
  const mode = getGameMode(setup.modeId)
  if (!mode) return 'noMode'
  if (!isPlayTypeAvailable(mode, setup.playType)) return 'noPlayType'
  if (setup.playType === PLAY_TYPES.ONLINE && !setup.online?.code) return 'serverRequired'
  if (setup.playType === PLAY_TYPES.LOCAL || setup.playType === PLAY_TYPES.ONLINE) {
    if (localSlots.length === 0) return 'noPlayers'
    if (localSlots.length > getPlayerLimit(mode, PLAY_TYPES.LOCAL)) return 'tooManyPlayers'
    const playerIds = localSlots.map((slot) => slot.id)
    const characterBlocker = getCharacterSelectionBlocker(playerIds, picks.characters)
    if (characterBlocker) return characterBlocker
    if (getSelectionBlocker(playerIds, picks.vehicles, false)) return 'vehiclesPending'
    const choosesTracks = setup.playType === PLAY_TYPES.LOCAL || setup.online?.role === 'host'
    if (mode.tracks && choosesTracks && !resolveCourse(picks.course?.playlist, picks.course?.cupId)) return 'trackPending'
  }
  return null
}
