import { PLAY_TYPES } from '../config/gameModes'
import { resolveCourse } from '../config/cups'
import { getTrack } from '../config/tracks'
import { buildRaceBots } from './race/raceRoster'
import { getGameMode, getPlayerLimit, NO_PICKS } from './matchRules'
import { getConfirmedId } from './selection/selectionRules'

// Configuration figée transmise aux systèmes de jeu (sessionStore.match) : mode, joueurs avec
// leur personnage et leur véhicule, circuit et nombre de tours (modes de course), pilotes
// ordinateur (mode course), coupe et programme des circuits. `seed` : graine des tirages de la
// partie (bots).
export function buildMatchConfig(setup, localSlots = [], picks = NO_PICKS, seed = 1) {
  const mode = getGameMode(setup.modeId)
  const course = mode.tracks ? resolveCourse(picks.trackId) : null
  const track = course ? getTrack(course.trackIds[0]) : null
  const players =
    setup.playType === PLAY_TYPES.LOCAL
      ? localSlots.map(({ id, index, deviceId, deviceKind }) => ({
          id,
          index,
          deviceId,
          deviceKind,
          characterId: getConfirmedId(picks.characters, id),
          vehicleId: getConfirmedId(picks.vehicles, id),
        }))
      : []
  return Object.freeze({
    modeId: mode.id,
    playType: setup.playType,
    maxPlayers: getPlayerLimit(mode, setup.playType),
    teams: mode.teams,
    trackId: track?.id ?? null,
    laps: track?.laps ?? null,
    // Coupe : programme des circuits (un seul pour une course simple), course en cours (0..),
    // points de coupe cumulés par pilote (game/raceSequence.js).
    cupId: course?.cupId ?? null,
    playlist: course?.trackIds ?? [],
    round: 0,
    cupPoints: {},
    seed,
    players,
    bots: track ? buildRaceBots(mode, players, seed) : [],
    online: setup.playType === PLAY_TYPES.ONLINE ? { ...setup.online } : null,
  })
}
