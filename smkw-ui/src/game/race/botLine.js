// Trajectoire latérale visée par un pilote ordinateur (calcul pur) : sa voie préférée, déviée
// pour contourner un rocher devant lui, ou pour passer sur un pad d'accélération proche.
const OBSTACLE_LOOK = 38 // m devant
const PAD_LOOK = 45
const PAD_PULL = 5 // m : écart latéral maximal pour aller chercher un pad
const CLEARANCE = 2.2 // m entre le kart et un rocher

function aheadDistance(path, kart, feature) {
  let d = feature.distance - kart.trackDistance
  d -= Math.floor(d / path.length) * path.length
  return d
}

export function chooseBotLateral(geometry, kart, lane, half) {
  const { path, obstacles, pads } = geometry
  let lateral = lane
  for (const pad of pads) {
    const d = aheadDistance(path, kart, pad)
    if (d > 2 && d < PAD_LOOK && Math.abs(pad.lateral - lane) < PAD_PULL) lateral = pad.lateral
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
  return lateral
}
