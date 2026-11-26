// Plans caméra de l'écran partagé (vecteurs fournis par l'appelant, aucune allocation).
import { MathUtils } from 'three'

// Décalage de la caméra par rapport au kart (au sol), et point visé devant lui.
const CHASE = { height: 1.45, back: 3.1, lookAhead: 4, lookHeight: 0.75 }
const ARENA_OVERVIEW = { position: [0, 19, 33], target: [0, 0, 11.5] }
const WIDEST_ASPECT = 16 / 9
// Retard de la caméra sur l'orientation du kart (1/s) : on voit le kart tourner et glisser.
const FOLLOW_LAMBDA = 5

export const OVERVIEW_FOV = 50

// Cadrage d'une case : FOV vertical et facteur de recul. Au-delà du 16:9 (ex. deux joueurs l'un
// au-dessus de l'autre), on garde l'angle horizontal du 16:9 (bords non déformés) et on recule
// d'autant : le kart garde la même place dans la case. `out` est réutilisé (aucune allocation).
export function fitCellFraming(fov, aspect, out) {
  if (aspect <= WIDEST_ASPECT) {
    out.fov = fov
    out.distance = 1
    return out
  }
  const halfTan = Math.tan(MathUtils.degToRad(fov / 2))
  out.distance = aspect / WIDEST_ASPECT
  out.fov = MathUtils.radToDeg(2 * Math.atan(halfTan / out.distance))
  return out
}

// Derrière le kart (place de départ { x, z, yaw }), légèrement au-dessus, regard vers l'avant.
export function writeChaseCamera(slot, distance, outPosition, outTarget) {
  const forwardX = Math.sin(slot.yaw)
  const forwardZ = Math.cos(slot.yaw)
  const y = slot.y ?? 0
  outPosition.set(slot.x - forwardX * CHASE.back * distance, y + CHASE.height * distance, slot.z - forwardZ * CHASE.back * distance)
  outTarget.set(slot.x + forwardX * CHASE.lookAhead, y + CHASE.lookHeight, slot.z + forwardZ * CHASE.lookAhead)
}

// Suivi d'un kart en course : la caméra rattrape son orientation avec un léger retard (aucun
// retard en mouvement réduit, ou à une nouvelle course). Un suiveur par case, au niveau module.
// La hauteur suit le relief avec un léger amorti (les petits sauts ne secouent pas l'image).
// Sous le deltaplane, la caméra monte et recule un peu : l'aile ne cache pas la route.
const HEIGHT_LAMBDA = 8
const GLIDE_LIFT = 1.6
const followers = Array.from({ length: 8 }, () => ({ race: null, yaw: 0, y: 0, lift: 0 }))
const pose = { x: 0, y: 0, z: 0, yaw: 0 }

export function writeKartChase(cell, kart, race, delta, snap, distance, outPosition, outTarget) {
  const follower = followers[cell]
  if (snap || follower.race !== race) {
    follower.race = race
    follower.yaw = kart.yaw
    follower.y = kart.y
  } else {
    follower.y += (kart.y - follower.y) * (1 - Math.exp(-HEIGHT_LAMBDA * delta))
    follower.lift += ((kart.gliding ? GLIDE_LIFT : 0) - follower.lift) * (1 - Math.exp(-3 * delta))
    const gap = kart.yaw - follower.yaw
    follower.yaw += (gap - Math.round(gap / (Math.PI * 2)) * Math.PI * 2) * (1 - Math.exp(-FOLLOW_LAMBDA * delta))
  }
  pose.x = kart.x
  pose.z = kart.z
  pose.y = follower.y
  pose.yaw = follower.yaw
  writeChaseCamera(pose, distance * (1 + follower.lift * 0.15), outPosition, outTarget)
  outPosition.y += follower.lift
}

// Case sans joueur (ex. 3 joueurs en 2x2) : vue d'ensemble du circuit (ou de l'arène).
export function writeOverviewCamera(distance, outPosition, outTarget, bounds) {
  if (bounds) {
    outTarget.set(bounds.centerX, 0, bounds.centerZ)
    outPosition.set(bounds.centerX, bounds.halfSize * 2.1 * distance, bounds.centerZ + bounds.halfSize * 1.5 * distance)
    return
  }
  outTarget.set(...ARENA_OVERVIEW.target)
  outPosition.set(...ARENA_OVERVIEW.position).sub(outTarget).multiplyScalar(distance).add(outTarget)
}
