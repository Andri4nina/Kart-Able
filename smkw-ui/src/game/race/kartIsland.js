import { WALL } from '../../config/kartTuning'
import { SPLIT } from '../track/trackSplits'

// Terre-plein d'un embranchement (game/track/trackSplits.js) : le kart est repoussé vers la voie
// de son côté, comme contre la barrière.
export function applyIsland(geometry, kart) {
  const { path, island } = geometry
  const i = kart.trackIndex
  const half = island[i] + 0.9
  if (island[i] <= 0 || Math.abs(kart.lateral) >= half || kart.y - path.y[i] > SPLIT.height + 0.6) return
  const side = kart.lateral === 0 ? 1 : Math.sign(kart.lateral)
  const push = side * half - kart.lateral
  const rightX = -path.tz[i]
  const rightZ = path.tx[i]
  kart.x += rightX * push
  kart.z += rightZ * push
  kart.lateral = side * half
  const inward = -(kart.vx * rightX + kart.vz * rightZ) * side
  if (inward <= 0) return
  kart.vx += rightX * inward * (1 + WALL.bounce) * side
  kart.vz += rightZ * inward * (1 + WALL.bounce) * side
  if (inward < WALL.bumpSpeed) return
  const loss = WALL.speedLoss * (1 - kart.stats.toughness * 0.5)
  kart.vx *= 1 - loss
  kart.vz *= 1 - loss
  kart.bump = Math.max(kart.bump, 0.25)
  kart.hits += 1
}
