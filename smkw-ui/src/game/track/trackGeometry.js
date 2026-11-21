import { getTrack } from '../../config/tracks'
import { buildTrackPath } from './trackPath'
import { getCheckpointGates, getTrackBounds } from './trackLayout'

// Géométrie calculée d'un circuit (chemin, portes, emprise), une seule fois par circuit.
const cache = new Map()

export function getTrackGeometry(trackId) {
  if (!cache.has(trackId)) {
    const track = getTrack(trackId)
    if (!track) return null
    const path = buildTrackPath(track.path)
    cache.set(trackId, Object.freeze({ track, path, gates: getCheckpointGates(path), bounds: getTrackBounds(path) }))
  }
  return cache.get(trackId)
}

// Distance signée entre le bord d'une ellipse (lac) et un point (négative dans l'eau) : approximation
// suffisante pour les marges et la chute dans l'eau (rayon local de l'ellipse vers le point).
export function distanceToLake(lake, x, z) {
  const dx = x - lake.x
  const dz = z - lake.z
  const cos = Math.cos(-lake.angle)
  const sin = Math.sin(-lake.angle)
  const lx = dx * cos - dz * sin
  const lz = dx * sin + dz * cos
  const angle = Math.atan2(lz / lake.rz, lx / lake.rx)
  const edge = Math.hypot(lake.rx * Math.cos(angle), lake.rz * Math.sin(angle))
  return Math.hypot(lx, lz) - edge
}

// Contrôle de conception (tests, outils) : la route ne se recoupe pas et reste hors de l'eau.
// Renvoie la plus petite marge entre deux portions éloignées et entre la route et les lacs.
export function measureTrackClearance(trackId) {
  const { track, path } = getTrackGeometry(trackId)
  let road = Infinity
  let water = Infinity
  const stride = 3
  for (let i = 0; i < path.count; i += stride) {
    for (let j = i + stride; j < path.count; j += stride) {
      const along = Math.min(j - i, path.count - (j - i)) * path.step
      if (along < 80) continue
      const gap = Math.hypot(path.x[i] - path.x[j], path.z[i] - path.z[j]) - (path.width[i] + path.width[j]) / 2
      road = Math.min(road, gap)
    }
    for (const lake of track.lakes) water = Math.min(water, distanceToLake(lake, path.x[i], path.z[i]) - path.width[i] / 2)
  }
  return { length: Math.round(path.length), road: Math.round(road), water: Math.round(water) }
}
