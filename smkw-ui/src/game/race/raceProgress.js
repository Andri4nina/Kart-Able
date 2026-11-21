import { crossGate, getGateCrossing, isRaceFinished } from '../track/lapRules'

// Progression des karts (calcul pur) : portes de checkpoint (lapRules), tours, temps au tour,
// distance de course pour le classement, arrivée.

// Franchissement de la prochaine porte (sens de course) ou retour arrière par la dernière.
function crossGates(kart, gates, fromX, fromZ) {
  const progress = kart.progress
  const next = gates[progress.nextGate]
  if (getGateCrossing(next, fromX, fromZ, kart.x, kart.z) > 0) return crossGate(progress, next.index, 1)
  const previous = gates[(progress.nextGate - 1 + gates.length) % gates.length]
  if (getGateCrossing(previous, fromX, fromZ, kart.x, kart.z) < 0) return crossGate(progress, previous.index, -1)
  return progress
}

// Après un déplacement de (fromX, fromZ) à la position du kart. Renvoie true à l'arrivée.
export function updateProgress(kart, world, fromX, fromZ) {
  const progress = crossGates(kart, world.geometry.gates, fromX, fromZ)
  if (progress === kart.progress) return false
  kart.progress = progress
  // Nouveau tour jamais atteint : temps du tour précédent (lapTimes = tours terminés).
  if (progress.lap > kart.lapTimes.length + 1) {
    kart.lapTimes.push(world.raceTime - kart.lapStart)
    kart.lapStart = world.raceTime
  }
  if (!isRaceFinished(progress, world.laps)) return false
  kart.finished = true
  kart.finishTime = world.raceTime
  world.finishCount += 1
  kart.finishOrder = world.finishCount
  return true
}

// Distance parcourue depuis le départ (négative derrière la ligne) : la dernière porte validée
// lève l'ambiguïté du tour, la position sur le tracé donne le reste.
export function getRaceDistance(kart, gates, length) {
  const { lap, nextGate } = kart.progress
  const last = gates[(nextGate - 1 + gates.length) % gates.length]
  const lastDistance = (last.index * length) / gates.length
  let delta = kart.trackDistance - lastDistance
  delta -= Math.round(delta / length) * length
  return (lap - 1) * length + lastDistance + delta
}

function compareKarts(a, b) {
  if (a.finished || b.finished) return (a.finished ? a.finishOrder : Infinity) - (b.finished ? b.finishOrder : Infinity)
  return b.raceDistance - a.raceDistance
}

// Classement : arrivés dans l'ordre d'arrivée, puis les autres selon la distance parcourue.
export function updateRanking(world) {
  const { gates, path } = world.geometry
  for (const kart of world.karts) {
    if (!kart.finished) kart.raceDistance = getRaceDistance(kart, gates, path.length)
  }
  world.ranking.sort(compareKarts)
  world.ranking.forEach((kart, index) => {
    kart.position = index + 1
  })
}

export function getBestLap(kart) {
  return kart.lapTimes.length ? Math.min(...kart.lapTimes) : null
}
