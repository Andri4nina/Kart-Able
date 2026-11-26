import { WALL } from '../../config/kartTuning'
import { resetAir } from './kartAir'
import { clearBoost } from './kartBoost'
import { cancelDrift } from './kartDrift'
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

// Barrière invisible (trackFences.js : à RACE.fence m du bord, ouverte vers l'eau près des
// lacs) : le kart y est retenu, rebondit un peu et,
// sur un choc franc, perd de la vitesse selon sa résistance et est secoué (les portes de
// checkpoint couvrent toute cette largeur).
export function applyFence(geometry, kart) {
  const { path, fences } = geometry
  const i = kart.trackIndex
  const limit = path.width[i] / 2 + (kart.lateral > 0 ? fences.right[i] : fences.left[i])
  if (Math.abs(kart.lateral) <= limit) return
  const side = Math.sign(kart.lateral)
  const excess = kart.lateral - side * limit
  const rightX = -path.tz[i]
  const rightZ = path.tx[i]
  kart.x -= rightX * excess
  kart.z -= rightZ * excess
  kart.lateral = side * limit
  const outward = (kart.vx * rightX + kart.vz * rightZ) * side
  if (outward <= 0) return
  const push = outward * (1 + WALL.bounce)
  kart.vx -= rightX * push * side
  kart.vz -= rightZ * push * side
  if (outward < WALL.bumpSpeed) return
  const speed = Math.hypot(kart.vx, kart.vz)
  const loss = WALL.speedLoss * (1 - kart.stats.toughness * 0.5) * Math.min(1, outward / Math.max(speed, 1))
  kart.vx *= 1 - loss
  kart.vz *= 1 - loss
  kart.bump = Math.max(kart.bump, 0.25)
  kart.hits += 1
}

export function isInWater(lakes, x, z) {
  for (const lake of lakes) if (distanceToLake(lake, x, z) < -WATER_MARGIN) return true
  return false
}

// Réapparition sur la route, un peu avant l'endroit de la chute, dans le sens de course ; après
// la brèche si la chute a eu lieu au-dessus d'une brèche du deltaplane (`gaps`).
export function respawnOnTrack(path, kart, gaps) {
  let i = (kart.trackIndex - 4 + path.count) % path.count
  if (gaps?.[kart.trackIndex] || gaps?.[i]) {
    while (gaps[i] || gaps[(i - 4 + path.count) % path.count]) i = (i + 1) % path.count
  }
  kart.trackIndex = i
  kart.x = path.x[i]
  kart.z = path.z[i]
  kart.yaw = Math.atan2(path.tx[i], path.tz[i])
  kart.vx = 0
  kart.vz = 0
  kart.speed = 0
  kart.hop = 0
  kart.bump = 0
  kart.spin = 0
  cancelDrift(kart)
  clearBoost(kart)
  resetAir(kart)
  kart.lateral = 0
  kart.offRoad = false
}
