import { crossingCutHeight } from './trackCrossings'
import { distanceToLakeEdge } from './lakes'
import { fractalNoise } from './noise'

// Relief d'un circuit (calcul pur, partagé par la course et la scène 3D) : une grille de
// hauteurs couvrant le terrain du circuit, calculée une fois.
// - Sur la route et ses accotements : la hauteur de la route (points de contrôle [x, z, l, y]).
// - Plus loin : fondu vers des collines douces (`track.hills`, amplitude en mètres).
// - Près de l'eau : ramené à 0 (le niveau des lacs ne bouge pas).
// Circuit tout plat (aucune hauteur, aucune colline) : aucune grille, hauteur 0 partout.
export const FIELD_MARGIN = 220 // mètres de paysage autour du circuit (même emprise que trackField)
const RESOLUTION = 320
const SHOULDER = 7 // mètres au-delà du bord gardés à la hauteur de la route
const FALLOFF = 55 // mètres pour rejoindre les collines
const LAKE_FADE = 70 // collines : aplanies à l'approche de l'eau
const SHORE_FADE = 25 // terrain au bord de la route : ramené au niveau de l'eau sur les rives
const COARSE = 6 // pas (échantillons) de la recherche grossière du point de route le plus proche

const smooth = (t) => t * t * (3 - 2 * t)

function nearestRoad(path, x, z) {
  let best = 0
  let bestDistance = Infinity
  for (let i = 0; i < path.count; i += COARSE) {
    const d = (x - path.x[i]) ** 2 + (z - path.z[i]) ** 2
    if (d < bestDistance) {
      bestDistance = d
      best = i
    }
  }
  for (let offset = -COARSE; offset <= COARSE; offset += 1) {
    const i = (best + offset + path.count) % path.count
    const d = (x - path.x[i]) ** 2 + (z - path.z[i]) ** 2
    if (d < bestDistance) {
      bestDistance = d
      best = i
    }
  }
  return { index: best, distance: Math.sqrt(bestDistance) }
}

function hasRelief(track, path) {
  if (track.hills || track.crossings?.length) return true
  for (let i = 0; i < path.count; i += 1) if (path.y[i] !== 0) return true
  return false
}

export function buildHeightField(track, path, bounds, crossings = null) {
  if (!hasRelief(track, path)) return null
  const size = (bounds.halfSize + FIELD_MARGIN) * 2
  const origin = [bounds.centerX - size / 2, bounds.centerZ - size / 2]
  const cell = size / (RESOLUTION - 1)
  const heights = new Float32Array(RESOLUTION * RESOLUTION)
  for (let row = 0; row < RESOLUTION; row += 1) {
    const z = origin[1] + row * cell
    for (let column = 0; column < RESOLUTION; column += 1) {
      const x = origin[0] + column * cell
      const road = nearestRoad(path, x, z)
      const edge = road.distance - path.width[road.index] / 2 - SHOULDER
      const toRoad = edge <= 0 ? 1 : 1 - smooth(Math.min(1, edge / FALLOFF))
      let shore = Infinity
      for (const lake of track.lakes) shore = Math.min(shore, distanceToLakeEdge(lake, x, z))
      const lakeFade = smooth(Math.max(0, Math.min(1, shore / LAKE_FADE)))
      const hills = (track.hills ?? 0) * (fractalNoise(x * 0.008, z * 0.008, track.seed + 17) - 0.35) * 2 * lakeFade
      const shoreFade = edge <= 0 ? 1 : smooth(Math.max(0, Math.min(1, shore / SHORE_FADE)))
      const ground = (path.y[road.index] * toRoad + Math.max(hills, -1) * (1 - toRoad)) * shoreFade
      heights[row * RESOLUTION + column] = Math.min(ground, crossingCutHeight(path, crossings, road.index, x, z))
    }
  }
  return { origin, size, resolution: RESOLUTION, cell, heights }
}

// Hauteur du sol au point (x, z) : interpolation bilinéaire de la grille (0 sans relief).
export function getGroundHeight(geometry, x, z) {
  const field = geometry?.relief
  if (!field) return 0
  const gx = Math.min(field.resolution - 1.001, Math.max(0, (x - field.origin[0]) / field.cell))
  const gz = Math.min(field.resolution - 1.001, Math.max(0, (z - field.origin[1]) / field.cell))
  const ix = Math.floor(gx)
  const iz = Math.floor(gz)
  const fx = gx - ix
  const fz = gz - iz
  const n = field.resolution
  const h = field.heights
  const a = h[iz * n + ix] + (h[iz * n + ix + 1] - h[iz * n + ix]) * fx
  const b = h[(iz + 1) * n + ix] + (h[(iz + 1) * n + ix + 1] - h[(iz + 1) * n + ix]) * fx
  return a + (b - a) * fz
}

// Pente (montée positive) dans la direction (dx, dz) unitaire, sur `span` mètres.
export function getSlope(geometry, x, z, dx, dz, span = 1.5) {
  if (!geometry?.relief) return 0
  return (getGroundHeight(geometry, x + dx * span, z + dz * span) - getGroundHeight(geometry, x - dx * span, z - dz * span)) / (2 * span)
}
