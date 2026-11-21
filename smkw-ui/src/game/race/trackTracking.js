import { RACE } from '../../config/race'
import { distanceToLake } from '../track/trackGeometry'

// Position d'un kart par rapport au circuit (calcul pur, aucune allocation) : échantillon du
// chemin le plus proche, écart latéral, surface (route, hors-piste, eau) et barrière invisible.
const SEARCH = 24 // échantillons (1 m) examinés de part et d'autre de la dernière position
const CURB = 0.6 // les bordures comptent comme de la route
const WATER_MARGIN = 1.5 // profondeur (m) à partir de laquelle le kart coule

export function updateTrackIndex(path, kart) {
  let best = kart.trackIndex
  let bestDistance = Infinity
  for (let offset = -SEARCH; offset <= SEARCH; offset += 1) {
    const i = (kart.trackIndex + offset + path.count) % path.count
    const dx = kart.x - path.x[i]
    const dz = kart.z - path.z[i]
    const distance = dx * dx + dz * dz
    if (distance < bestDistance) {
      bestDistance = distance
      best = i
    }
  }
  const dx = kart.x - path.x[best]
  const dz = kart.z - path.z[best]
  kart.trackIndex = best
  kart.lateral = dx * -path.tz[best] + dz * path.tx[best]
  kart.trackDistance = best * path.step + dx * path.tx[best] + dz * path.tz[best]
  kart.offRoad = Math.abs(kart.lateral) > path.width[best] / 2 + CURB
}

// Barrière invisible à RACE.fence mètres du bord : le kart y est retenu et perd sa vitesse
// vers l'extérieur (les portes de checkpoint couvrent toute cette largeur).
export function applyFence(path, kart) {
  const i = kart.trackIndex
  const limit = path.width[i] / 2 + RACE.fence
  if (Math.abs(kart.lateral) <= limit) return
  const side = Math.sign(kart.lateral)
  const excess = kart.lateral - side * limit
  const rightX = -path.tz[i]
  const rightZ = path.tx[i]
  kart.x -= rightX * excess
  kart.z -= rightZ * excess
  kart.lateral = side * limit
  const outward = (kart.vx * rightX + kart.vz * rightZ) * side
  if (outward > 0) {
    kart.vx -= rightX * outward * side
    kart.vz -= rightZ * outward * side
  }
}

export function isInWater(lakes, x, z) {
  for (const lake of lakes) if (distanceToLake(lake, x, z) < -WATER_MARGIN) return true
  return false
}

// Réapparition sur la route, un peu avant l'endroit de la chute, dans le sens de course.
export function respawnOnTrack(path, kart) {
  const i = (kart.trackIndex - 4 + path.count) % path.count
  kart.trackIndex = i
  kart.x = path.x[i]
  kart.z = path.z[i]
  kart.yaw = Math.atan2(path.tx[i], path.tz[i])
  kart.vx = 0
  kart.vz = 0
  kart.speed = 0
  kart.driftDir = 0
  kart.driftCharge = 0
  kart.boost = 0
  kart.lateral = 0
  kart.offRoad = false
}
