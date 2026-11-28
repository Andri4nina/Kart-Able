import { WALL } from '../../config/kartTuning'
import { branchCenter } from '../track/trackCrossings'

// Kart dans un croisement (game/track/trackCrossings.js), calcul pur : à l'entrée, il prend la
// voie de son côté (`kart.branch`, gardée jusqu'à la sortie) ; il est retenu entre les murs de
// cette voie (pont ou tranchée), comme contre la barrière.
const KART_HALF = 0.9

export function updateBranch(geometry, kart) {
  const at = geometry.crossing[kart.trackIndex]
  if (!at) {
    kart.branch = 0
    return
  }
  if (!kart.branch) kart.branch = Math.sign(kart.lateral) || kart.splitSide || 1
}

export function applyCrossing(geometry, kart) {
  const at = geometry.crossing[kart.trackIndex]
  if (!at || !kart.branch || kart.gliding) return
  const { path } = geometry
  const i = kart.trackIndex
  const item = geometry.crossings[at - 1]
  const center = branchCenter(item, kart.branch, geometry.crossingT[i])
  const reach = item.laneHalf - KART_HALF
  const offset = kart.lateral - center
  if (Math.abs(offset) <= reach) return
  const side = Math.sign(offset)
  const push = side * reach - offset
  const rightX = -path.tz[i]
  const rightZ = path.tx[i]
  kart.x += rightX * push
  kart.z += rightZ * push
  kart.lateral = center + side * reach
  const outward = (kart.vx * rightX + kart.vz * rightZ) * side
  if (outward <= 0) return
  kart.vx -= rightX * outward * (1 + WALL.bounce) * side
  kart.vz -= rightZ * outward * (1 + WALL.bounce) * side
  if (outward < WALL.bumpSpeed) return
  const loss = WALL.speedLoss * (1 - kart.stats.toughness * 0.5)
  kart.vx *= 1 - loss
  kart.vz *= 1 - loss
  kart.bump = Math.max(kart.bump, 0.25)
  kart.hits += 1
}
