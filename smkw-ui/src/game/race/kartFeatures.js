import { COLLISION, WALL } from '../../config/kartTuning'
import { PAD_SIZE } from '../track/trackFeatures'
import { applyBoost } from './kartBoost'
import { cancelDrift } from './kartDrift'

// Pads d'accélération et obstacles de la route (calcul pur, aucune allocation) :
// - rouler sur un pad (au sol) donne le turbo BOOSTS.pad, une fois par passage ;
// - un rocher est un cylindre : le kart est repoussé, rebondit et perd de la vitesse comme sur
//   un mur ; un choc franc casse le drift.
const PAD_COOLDOWN = 0.5
const KART_RADIUS = COLLISION.radius + 0.2

function updatePads(pads, kart, dt) {
  kart.padCooldown = Math.max(0, kart.padCooldown - dt)
  if (kart.padCooldown > 0 || kart.airborne) return
  for (const pad of pads) {
    const dx = kart.x - pad.x
    const dz = kart.z - pad.z
    const along = dx * pad.tx + dz * pad.tz
    const across = -dx * pad.tz + dz * pad.tx
    if (Math.abs(along) > PAD_SIZE.length / 2 || Math.abs(across) > PAD_SIZE.width / 2) continue
    applyBoost(kart, 'pad')
    kart.padCooldown = PAD_COOLDOWN
    return
  }
}

function hitObstacle(obstacle, kart) {
  const dx = kart.x - obstacle.x
  const dz = kart.z - obstacle.z
  const reach = obstacle.radius + KART_RADIUS
  const distanceSq = dx * dx + dz * dz
  if (distanceSq >= reach * reach) return
  const distance = Math.sqrt(distanceSq) || 1e-3
  const nx = dx / distance
  const nz = dz / distance
  kart.x = obstacle.x + nx * reach
  kart.z = obstacle.z + nz * reach
  const inward = -(kart.vx * nx + kart.vz * nz)
  if (inward <= 0) return
  const push = inward * (1 + WALL.bounce)
  kart.vx += nx * push
  kart.vz += nz * push
  if (inward < WALL.bumpSpeed) return
  const loss = WALL.speedLoss * 1.4 * (1 - kart.stats.toughness * 0.5)
  kart.vx *= 1 - loss
  kart.vz *= 1 - loss
  kart.bump = Math.max(kart.bump, 0.4)
  kart.hits += 1
  if (inward > COLLISION.driftBreak) cancelDrift(kart)
}

export function updateTrackFeatures(geometry, kart, dt) {
  if (geometry.pads.length) updatePads(geometry.pads, kart, dt)
  for (const obstacle of geometry.obstacles) hitObstacle(obstacle, kart)
}
