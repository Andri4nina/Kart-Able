import { RELIEF } from '../../config/airTuning'
import { getGroundHeight, getSlope } from '../track/trackHeight'
import { readRamp } from '../track/trackJumps'
import { land, stepAir, takeOff } from './kartAir'

// Hauteur d'un kart (calcul pur, aucune allocation) :
// - au sol, il suit le relief et les rampes ; sa vitesse verticale suit celle du sol ; la pente
//   freine en montée et pousse en descente (gravité arcade le long de la route) ;
// - au bout d'une rampe ou sur une crête prise vite, le sol descend plus vite que le kart : il
//   décolle (figure possible, deltaplane après une rampe de vol), retombe et se repose ;
// - au-dessus d'une brèche (deltaplane), le sol est le fond de l'eau : sans deltaplane, on y
//   tombe (raceWorld).
export const GAP_FLOOR = -4
const ramp = { height: 0, slope: 0, glide: false }

export function getDriveGround(geometry, kart, forwardX, forwardZ) {
  readRamp(geometry.ramps, kart.x, kart.z, forwardX, forwardZ, ramp)
  if (geometry.gaps[kart.trackIndex] && ramp.height === 0) return GAP_FLOOR
  return getGroundHeight(geometry, kart.x, kart.z) + ramp.height
}

export function updateKartVertical(kart, geometry, dt) {
  const forwardX = Math.sin(kart.yaw)
  const forwardZ = Math.cos(kart.yaw)
  const ground = getDriveGround(geometry, kart, forwardX, forwardZ)
  const wasGrounded = !kart.airborne
  stepAir(kart, RELIEF.gravity, dt)
  kart.y += kart.vy * dt
  // Au-dessus du sol : en vol (même de quelques centimètres, sinon le kart ne décollerait
  // jamais) ; `airborne` (contrôle réduit, affichage) seulement au-delà du seuil.
  if (kart.y > ground) {
    kart.airborne = kart.y > ground + RELIEF.airThreshold
    if (kart.airborne && wasGrounded) takeOff(kart, kart.rampGlide)
    return
  }
  if (kart.trickPending || kart.gliding || kart.trickWindow > 0) land(kart)
  kart.airborne = false
  kart.rampGlide = ramp.glide
  kart.slope = getSlope(geometry, kart.x, kart.z, forwardX, forwardZ) + ramp.slope
  kart.y = ground
  kart.vy = kart.speed * kart.slope
  // Gravité le long de la pente, appliquée à la vitesse vers l'avant.
  const push = -RELIEF.slopeGravity * kart.slope * dt
  kart.vx += forwardX * push
  kart.vz += forwardZ * push
}

// Pose au sol (départ, réapparition).
export function placeOnGround(kart, geometry) {
  kart.y = getGroundHeight(geometry, kart.x, kart.z)
  kart.vy = 0
  kart.airborne = false
  kart.slope = 0
}
