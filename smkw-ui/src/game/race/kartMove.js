import { RACE } from '../../config/race'
import { updateTrackFeatures } from './kartFeatures'
import { stepKartPhysics } from './kartPhysics'
import { placeOnGround, updateKartVertical } from './kartVertical'
import { updateProgress } from './raceProgress'
import { stepRemoteKart } from './remoteKart'
import { applyIsland } from './kartIsland'
import { applyFence, isInWater, respawnOnTrack, updateTrackIndex } from './trackTracking'

// Un pas de déplacement d'un kart (calcul pur) : kart distant (réseau local), réapparition
// après une chute, conduite, relief et vol, limites du circuit et terre-plein, pads et rochers,
// voies d'eau (on y flotte), chute dans l'eau, tours.
const GAP_WATER = -0.6 // hauteur sous laquelle un kart tombé dans une brèche coule

export function moveKart(world, kart, dt) {
  const { path, track, gaps } = world.geometry
  if (kart.remote) return stepRemoteKart(world, kart, dt)
  if (kart.sinking > 0) {
    kart.sinking = Math.max(0, kart.sinking - dt)
    if (kart.sinking === 0) {
      respawnOnTrack(path, kart, gaps, world.geometry.island)
      placeOnGround(kart, world.geometry)
    }
    return
  }
  const fromX = kart.x
  const fromZ = kart.z
  stepKartPhysics(kart, kart.controls, dt)
  updateKartVertical(kart, world.geometry, dt)
  updateTrackIndex(path, kart)
  applyFence(world.geometry, kart)
  applyIsland(world.geometry, kart)
  kart.onWater = world.geometry.water[kart.trackIndex] === 1 && !kart.airborne
  updateTrackFeatures(world.geometry, kart, dt)
  // Dans l'eau : hors de la route sur un lac (au sol), ou tombé dans une brèche du deltaplane.
  const fell = gaps[kart.trackIndex] && kart.y < GAP_WATER
  if (fell || (kart.offRoad && !kart.airborne && !kart.onWater && isInWater(track.lakes, kart.x, kart.z))) {
    kart.sinking = RACE.respawnDelay
    kart.vx = 0
    kart.vz = 0
    kart.speed = 0
  }
  if (!kart.finished) updateProgress(kart, world, fromX, fromZ)
}
