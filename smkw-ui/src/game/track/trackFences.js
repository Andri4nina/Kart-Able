import { RACE } from '../../config/race'
import { distanceToLakeEdge } from './lakes'

// Barrière invisible de chaque côté de la route (calcul pur, une fois par circuit) : à
// RACE.fence mètres du bord en général ; là où un lac touche presque la route (bord de l'eau à
// moins de `waterFence.reach` m), la barrière s'ouvre jusque dans l'eau : sortir de la route
// à cet endroit fait tomber à l'eau. Distances depuis le bord de la route, par échantillon.
// Côté droit (+1) = (-tz, tx), comme kart.lateral.
const PROBE_STEP = 0.5

function waterEdge(track, path, i, side) {
  const half = path.width[i] / 2
  const rightX = -path.tz[i] * side
  const rightZ = path.tx[i] * side
  for (let d = 0; d <= RACE.waterFence.reach; d += PROBE_STEP) {
    const x = path.x[i] + rightX * (half + d)
    const z = path.z[i] + rightZ * (half + d)
    for (const lake of track.lakes) if (distanceToLakeEdge(lake, x, z) < 0) return d
  }
  return null
}

export function buildFences(track, path) {
  const left = new Float32Array(path.count)
  const right = new Float32Array(path.count)
  for (let i = 0; i < path.count; i += 1) {
    const l = waterEdge(track, path, i, -1)
    const r = waterEdge(track, path, i, 1)
    left[i] = l === null ? RACE.fence : l + RACE.waterFence.into
    right[i] = r === null ? RACE.fence : r + RACE.waterFence.into
  }
  return { left, right }
}
