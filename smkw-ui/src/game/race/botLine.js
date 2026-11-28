import { islandAhead } from '../track/trackSplits'

// Trajectoire latérale visée par un pilote ordinateur (calcul pur) : sa voie préférée, déviée
// pour contourner un rocher devant lui, ou pour passer sur un pad d'accélération proche. Avant
// un embranchement, il prend la voie de son côté (`kart.splitSide` : la moitié des pilotes de
// chaque côté) et n'en sort plus jusqu'à la fin du terre-plein.
const OBSTACLE_LOOK = 38 // m devant
const PAD_LOOK = 45
const PAD_PULL = 5 // m : écart latéral maximal pour aller chercher un pad
const CLEARANCE = 2.2 // m entre le kart et un rocher
const SPLIT_LOOK = 55 // m : on choisit sa voie avant le terre-plein
const ISLAND_CLEARANCE = 2.6 // m entre le kart et le terre-plein

function aheadDistance(path, kart, feature) {
  let d = feature.distance - kart.trackDistance
  d -= Math.floor(d / path.length) * path.length
  return d
}

export function chooseBotLateral(geometry, kart, lane, half) {
  const { path, obstacles, pads, island } = geometry
  const split = islandAhead(path, island, kart.trackIndex, SPLIT_LOOK)
  // Déjà le long du terre-plein : on reste dans la voie où l'on est (on ne le traverse pas).
  const side = island[kart.trackIndex] > 1 ? Math.sign(kart.lateral) || kart.splitSide : kart.splitSide
  const inner = split + ISLAND_CLEARANCE
  // Voie de son côté : milieu de la voie, puis rochers et pads de cette voie seulement.
  let lateral = split > 0 ? side * (inner + Math.max(inner, half)) / 2 : lane
  for (const pad of pads) {
    const d = aheadDistance(path, kart, pad)
    if (d > 2 && d < PAD_LOOK && Math.abs(pad.lateral - lateral) < PAD_PULL) lateral = pad.lateral
  }
  for (const obstacle of obstacles) {
    const d = aheadDistance(path, kart, obstacle)
    if (d < 1 || d > OBSTACLE_LOOK) continue
    const gap = obstacle.radius + CLEARANCE
    if (Math.abs(lateral - obstacle.lateral) >= gap) continue
    // Contourner par le côté le plus large (ou celui où l'on se trouve déjà).
    const toRight = obstacle.lateral + gap <= half ? obstacle.lateral + gap : null
    const toLeft = obstacle.lateral - gap >= -half ? obstacle.lateral - gap : null
    if (toRight === null) lateral = toLeft ?? lateral
    else if (toLeft === null) lateral = toRight
    else lateral = kart.lateral >= obstacle.lateral ? toRight : toLeft
  }
  if (split > 0) lateral = side * Math.max(inner, Math.min(half, lateral * side))
  return lateral
}
