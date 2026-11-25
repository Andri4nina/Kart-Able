import { CUP_TRACK_IDS } from '../config/cups'
import { CUP_POINTS } from '../config/race'
import { getTrack } from '../config/tracks'

// Enchaînement des courses (règles pures, aucun store) : coupe de 4 circuits avec points
// cumulés, puis vote des joueurs pour le circuit suivant. La configuration de partie
// (sessionStore.match) est recréée à chaque course, figée.

export function pointsForPosition(position) {
  return CUP_POINTS[position - 1] ?? 0
}

// Points cumulés après une course (`results` : classement final, racePublish.buildResults).
export function addRacePoints(cupPoints, results) {
  const next = { ...cupPoints }
  for (const entry of results) next[entry.id] = (next[entry.id] ?? 0) + pointsForPosition(entry.position)
  return next
}

// Classement de coupe après cette course : points de la course et total, du meilleur au moins bon
// (à égalité de total, la place de cette course départage).
export function getCupStandings(match, results) {
  const totals = addRacePoints(match.cupPoints ?? {}, results)
  return results
    .map((entry) => ({ ...entry, points: pointsForPosition(entry.position), total: totals[entry.id] }))
    .sort((a, b) => b.total - a.total || a.position - b.position)
}

export function hasNextCupRace(match) {
  return Boolean(match?.cupId) && match.round < match.playlist.length - 1
}

// Course suivante de la coupe : circuit suivant du programme, points reportés.
export function buildNextCupMatch(match, results, seed) {
  const trackId = match.playlist[match.round + 1]
  return Object.freeze({
    ...match,
    trackId,
    laps: getTrack(trackId)?.laps ?? match.laps,
    round: match.round + 1,
    cupPoints: addRacePoints(match.cupPoints ?? {}, results),
    seed,
  })
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

// Course simple sur le circuit élu (hors coupe), mêmes pilotes.
export function buildVotedMatch(match, trackId, seed) {
  return Object.freeze({
    ...match,
    trackId,
    laps: getTrack(trackId)?.laps ?? match.laps,
    cupId: null,
    playlist: [trackId],
    round: 0,
    cupPoints: {},
    seed,
  })
}
