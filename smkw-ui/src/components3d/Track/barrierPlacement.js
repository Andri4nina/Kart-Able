import { RACE } from '../../config/race'
import { getGroundHeight } from '../../game/track/trackHeight'

// Placement des limites visibles (pur, déduit de geometry.fences, voir game/track/trackFences.js) :
// - murets anti-raccourci (rouge et blanc) au ras de la route, là où une autre portion passe
//   tout près ;
// - clôture basse à la limite du hors-piste ailleurs, sauf là où elle s'ouvre vers l'eau et
//   au-dessus des brèches du deltaplane.
// Une pièce tous les `step` m de chaque côté : { x, y, z, yaw, color } (color : 0 ou 1).
const WALL_STEP = 2
const FENCE_STEP = 3.2
const WALL_THICKNESS = 0.5

function sideLimit(fences, side, i) {
  return side < 0 ? fences.left[i] : fences.right[i]
}

export function placeBarriers(geometry) {
  const { path, fences, bare: gaps } = geometry
  const walls = []
  const posts = []
  for (const side of [-1, 1]) {
    const flags = side < 0 ? fences.walls.left : fences.walls.right
    let lastWall = -Infinity
    let lastPost = -Infinity
    for (let i = 0; i < path.count; i += 1) {
      const distance = i * path.step
      const wall = flags[i] === 1
      const open = sideLimit(fences, side, i) !== RACE.fence
      if (wall ? distance - lastWall < WALL_STEP : open || gaps[i] || distance - lastPost < FENCE_STEP) continue
      const lateral = side * (path.width[i] / 2 + sideLimit(fences, side, i) + (wall ? WALL_THICKNESS / 2 : 0.3))
      const x = path.x[i] - path.tz[i] * lateral
      const z = path.z[i] + path.tx[i] * lateral
      const piece = { x, z, y: getGroundHeight(geometry, x, z), yaw: Math.atan2(path.tx[i], path.tz[i]) }
      if (wall) {
        walls.push({ ...piece, color: walls.length % 2 })
        lastWall = distance
      } else {
        posts.push(piece)
        lastPost = distance
      }
    }
  }
  return { walls, posts }
}
