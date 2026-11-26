import { ITEMS } from '../../config/items'
import { updateTrackIndex } from '../race/trackTracking'
import { writeTrackPoint } from './itemPlacement'
import { hitKart } from './kartHit'

// Trajectoires des projectiles (calcul pur, aucune allocation) :
// - 'straight' : tout droit dans le monde, rebondit sur les bords de la route (marge EDGE) ;
// - 'homing'   : suit la route ; proche du kart visé (celui de devant au lancer), le rejoint ;
// - 'leader'   : vole au-dessus de la course jusqu'au premier, puis explose (ITEMS.comet.blast).
// stepProjectile renvoie false quand le projectile disparaît.
const EDGE = 2.5
const MAX_BOUNCES = 8
const LOCK = 28 // m : le projectile guidé rejoint la file de sa cible
const point = { x: 0, z: 0, tx: 0, tz: 0, index: 0 }

// Lancer un projectile (tenu ou non) depuis `kart` ; `backward` : vers l'arrière, tout droit.
export function launchProjectile(world, entry, kart, backward) {
  const item = ITEMS[entry.itemId]
  const dir = backward ? -1 : 1
  entry.held = null
  entry.age = 0
  entry.ttl = item.lifetime
  entry.speed = Math.max(item.speed, kart.speed + 15)
  entry.mode = backward ? 'straight' : item.mode
  entry.trackIndex = kart.trackIndex
  entry.bounces = 0
  const ahead = kart.position > 1 ? world.ranking[kart.position - 2] : null
  entry.target = entry.mode === 'homing' ? ahead?.id ?? null : null
  if (entry.mode === 'straight') {
    entry.x = kart.x + Math.sin(kart.yaw) * 2.2 * dir
    entry.z = kart.z + Math.cos(kart.yaw) * 2.2 * dir
    entry.vx = Math.sin(kart.yaw) * (backward ? item.speed * 0.6 : entry.speed) * dir
    entry.vz = Math.cos(kart.yaw) * (backward ? item.speed * 0.6 : entry.speed) * dir
  } else {
    entry.distance = kart.trackDistance + 2.5
    entry.race = kart.raceDistance + 2.5
    entry.lateral = kart.lateral
  }
}

function stepStraight(world, entry, dt) {
  const { path } = world.geometry
  entry.x += entry.vx * dt
  entry.z += entry.vz * dt
  updateTrackIndex(path, entry)
  const i = entry.trackIndex
  const limit = path.width[i] / 2 + EDGE
  if (Math.abs(entry.lateral) <= limit) return true
  // Rebond : symétrie de la vitesse par rapport au bord, retour sur la limite.
  const nx = -path.tz[i]
  const nz = path.tx[i]
  const vn = entry.vx * nx + entry.vz * nz
  entry.vx -= 2 * vn * nx
  entry.vz -= 2 * vn * nz
  const excess = entry.lateral - Math.sign(entry.lateral) * limit
  entry.x -= nx * excess
  entry.z -= nz * excess
  entry.bounces += 1
  return entry.bounces <= MAX_BOUNCES
}

function stepAlongRoad(world, entry, dt) {
  entry.distance += entry.speed * dt
  entry.race += entry.speed * dt
  const target = entry.target ? world.kartsById.get(entry.target) : null
  if (target && !target.finished && target.raceDistance - entry.race < LOCK) {
    entry.lateral += (target.lateral - entry.lateral) * Math.min(1, 6 * dt)
  } else entry.lateral *= Math.exp(-0.8 * dt)
  writeTrackPoint(world.geometry.path, entry.distance, entry.lateral, point)
  entry.x = point.x
  entry.z = point.z
  return true
}

// Comète : vise le premier du moment ; à sa hauteur, souffle qui touche tous les karts proches.
function stepLeader(world, entry, dt) {
  const leader = world.ranking.find((kart) => !kart.finished)
  if (!leader) return false
  entry.speed = Math.max(entry.speed, leader.speed + 25)
  entry.lateral += (leader.lateral - entry.lateral) * Math.min(1, 2 * dt)
  stepAlongRoad(world, entry, dt)
  const gap = leader.raceDistance - entry.race
  entry.y = Math.min(5, Math.max(0.6, gap / 8))
  if (gap > 1) return true
  const reach = ITEMS.comet.blast
  for (const kart of world.karts) {
    if ((kart.x - leader.x) ** 2 + (kart.z - leader.z) ** 2 < reach * reach) hitKart(kart, 1.6)
  }
  return false
}

export function stepProjectile(world, entry, dt) {
  if (entry.mode === 'straight') return stepStraight(world, entry, dt)
  if (entry.mode === 'leader') return stepLeader(world, entry, dt)
  return stepAlongRoad(world, entry, dt)
}
