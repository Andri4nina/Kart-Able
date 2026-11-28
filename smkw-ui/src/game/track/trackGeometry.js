import { getTrack } from '../../config/tracks'
import { distanceToLakeEdge } from './lakes'
import { buildFences } from './trackFences'
import { placeTrackFeatures } from './trackFeatures'
import { buildHeightField } from './trackHeight'
import { applyBumps } from './trackBumps'
import { applyDives } from './trackDives'
import { placeCrossings } from './trackCrossings'
import { placeJumps } from './trackJumps'
import { placeRockfalls } from './trackRockfalls'
import { placeSplits } from './trackSplits'
import { placeWaterways } from './trackWaterways'
import { buildTrackPath } from './trackPath'
import { getCheckpointGates, getTrackBounds } from './trackLayout'

// Géométrie calculée d'un circuit (chemin, portes, emprise, relief), une seule fois par circuit.
const cache = new Map()

export function getTrackGeometry(trackId) {
  if (!cache.has(trackId)) {
    const definition = getTrack(trackId)
    if (!definition) return null
    const path = buildTrackPath(definition.path)
    // dives : la route plonge sous un lagon (`under`, par échantillon) ; modifie path.y.
    const { under, diveLakes } = applyDives(definition, path)
    // bumps : bosses et creux de la route (modifie path.y) ; rockfalls : éboulements.
    applyBumps(definition, path)
    const bounds = getTrackBounds(path)
    // jumps : rampes, brèches du deltaplane (gaps, par échantillon) et lacs sous les brèches,
    // ajoutés aux lacs du circuit (`track` les contient tous) ; relief : grille de hauteurs
    // (trackHeight.js), null pour un circuit plat ; fences : limites par côté (trackFences.js) ;
    // features : pads et obstacles.
    // waterways : voies d'eau (`water`, par échantillon) et leurs lacs ; splits : terre-plein des
    // embranchements (`island`) ; `hidden` : échantillons sans asphalte (brèches et voies d'eau).
    const { gapLakes, ...jumps } = placeJumps(definition, path)
    const { waterLakes, water } = placeWaterways(definition, path)
    const extraLakes = [...gapLakes, ...waterLakes, ...diveLakes]
    const track = extraLakes.length ? { ...definition, lakes: [...definition.lakes, ...extraLakes] } : definition
    const features = placeTrackFeatures(track, path)
    const hidden = jumps.gaps.map((gap, i) => gap | water[i])
    // crossings : pont et tranchée (deux voies à part) ; `bare` : pas de ruban de route ici.
    const crossings = placeCrossings(definition, path)
    const bare = hidden.map((flag, i) => flag | (crossings.crossing[i] ? 1 : 0))
    cache.set(
      trackId,
      Object.freeze({ track, path, gates: getCheckpointGates(path), bounds, relief: buildHeightField(track, path, bounds, crossings), fences: buildFences(track, path), ...features, ...jumps, ...placeSplits(definition, path), ...placeRockfalls(definition, path), water, under, hidden, bare, ...crossings }),
    )
  }
  return cache.get(trackId)
}

// Distance signée au bord d'un lac (négative dans l'eau) : voir lakes.js.
export const distanceToLake = distanceToLakeEdge

// Contrôle de conception (tests, outils) : la route ne se recoupe pas et reste hors de l'eau.
// Renvoie la plus petite marge entre deux portions éloignées et entre la route et les lacs.
export function measureTrackClearance(trackId) {
  const { track, path, water: waterway, under } = getTrackGeometry(trackId)
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
    if (waterway[i] || under[i]) continue
    for (const lake of track.lakes) water = Math.min(water, distanceToLake(lake, path.x[i], path.z[i]) - path.width[i] / 2)
  }
  return { length: Math.round(path.length), road: Math.round(road), water: Math.round(water) }
}
