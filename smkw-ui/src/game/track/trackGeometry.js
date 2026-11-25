import { getTrack } from '../../config/tracks'
import { distanceToLakeEdge } from './lakes'
import { buildFences } from './trackFences'
import { placeTrackFeatures } from './trackFeatures'
import { buildHeightField } from './trackHeight'
import { buildTrackPath } from './trackPath'
import { getCheckpointGates, getTrackBounds } from './trackLayout'

// Géométrie calculée d'un circuit (chemin, portes, emprise, relief), une seule fois par circuit.
const cache = new Map()

export function getTrackGeometry(trackId) {
  if (!cache.has(trackId)) {
    const track = getTrack(trackId)
    if (!track) return null
    const path = buildTrackPath(track.path)
    const bounds = getTrackBounds(path)
    // relief : grille de hauteurs (trackHeight.js), null pour un circuit plat ; fences :
    // barrière invisible par côté (trackFences.js) ; features : pads et obstacles.
    const features = placeTrackFeatures(track, path)
    cache.set(trackId, Object.freeze({ track, path, gates: getCheckpointGates(path), bounds, relief: buildHeightField(track, path, bounds), fences: buildFences(track, path), ...features }))
  }
  return cache.get(trackId)
}

// Distance signée au bord d'un lac (négative dans l'eau) : voir lakes.js.
export const distanceToLake = distanceToLakeEdge

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
