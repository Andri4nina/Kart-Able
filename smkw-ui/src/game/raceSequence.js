import { CUP_TRACK_IDS } from '../config/cups'
import { RACE_POINTS } from '../config/race'
import { getTrack } from '../config/tracks'

// Enchaînement des courses (règles pures, aucun store) : programme choisi (une coupe, quelques
// circuits ou un seul), points de chaque course additionnés pendant toute la partie, puis vote
// des joueurs pour le circuit suivant. La configuration de partie (sessionStore.match) est
// recréée à chaque course, figée. `match.points` : total de chaque pilote AVANT cette course ;
// `match.racesDone` : courses terminées depuis le début de la partie.

export function pointsForPosition(position) {
  return RACE_POINTS[position - 1] ?? 0
}

// Points cumulés après une course (`results` : classement final, racePublish.buildResults).
export function addRacePoints(points, results) {
  const next = { ...points }
  for (const entry of results) next[entry.id] = (next[entry.id] ?? 0) + pointsForPosition(entry.position)
  return next
}

// Classement après cette course : points de la course et total de la partie, du meilleur total
// au moins bon (à égalité, la place de cette course départage).
export function getStandings(match, results) {
  const totals = addRacePoints(match.points ?? {}, results)
  return results
    .map((entry) => ({ ...entry, points: pointsForPosition(entry.position), total: totals[entry.id] }))
    .sort((a, b) => b.total - a.total || a.position - b.position)
}

export function hasNextRace(match) {
  return Boolean(match) && match.round < match.playlist.length - 1
}

// Nouvelle course sur `trackId` : même partie, mêmes pilotes.
function raceOn(match, trackId, patch, seed) {
  return Object.freeze({ ...match, trackId, laps: getTrack(trackId)?.laps ?? match.laps, seed, ...patch })
}

// Course suivante du programme : points reportés.
export function buildNextMatch(match, results, seed) {
  const patch = { round: match.round + 1, points: addRacePoints(match.points ?? {}, results), racesDone: (match.racesDone ?? 0) + 1 }
  return raceOn(match, match.playlist[match.round + 1], patch, seed)
}

// Circuits proposés au vote : tous, sauf celui qui vient d'être couru.
export function getVoteOptions(match) {
  return CUP_TRACK_IDS.filter((trackId) => trackId !== match?.trackId)
}

// Dépouillement : le circuit le plus choisi ; à égalité, tirage parmi les ex aequo (`roll` dans
// [0, 1[). Sans vote, tirage parmi toutes les options. Renvoie { winner, counts }.
export function tallyVotes(votes, options, roll) {
  const counts = Object.fromEntries(options.map((trackId) => [trackId, 0]))
  for (const vote of votes) if (vote in counts) counts[vote] += 1
  const best = Math.max(...Object.values(counts))
  const leaders = options.filter((trackId) => counts[trackId] === best)
  return { winner: leaders[Math.min(leaders.length - 1, Math.floor(roll * leaders.length))], counts }
}

// Course sur le circuit élu (hors coupe), mêmes pilotes, points de la partie reportés.
export function buildVotedMatch(match, trackId, results, seed) {
  const patch = { cupId: null, playlist: [trackId], round: 0, points: addRacePoints(match.points ?? {}, results), racesDone: (match.racesDone ?? 0) + 1 }
  return raceOn(match, trackId, patch, seed)
}

// Changement de circuit en pleine course (menu pause) : la course en cours est abandonnée sans
// points, remplacée dans le programme par `trackId`.
export function buildChangedMatch(match, trackId, seed) {
  const playlist = match.playlist.map((id, index) => (index === match.round ? trackId : id))
  const cupId = match.cupId && playlist.every((id, index) => match.playlist[index] === id) ? match.cupId : null
  return raceOn(match, trackId, { playlist, cupId }, seed)
}
