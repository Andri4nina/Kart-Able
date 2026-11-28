import { BufferAttribute, BufferGeometry } from 'three'
import { branchCenter, branchHeight } from '../../game/track/trackCrossings'

// Croisements (game/track/trackCrossings.js) : deux voies qui échangent leurs côtés, l'une sur un
// pont, l'autre dans une tranchée. Maillages calculés une fois par circuit :
// - `lanes` : rubans de route (attribut aRoad, mêmes lignes de bord que la route) ;
// - `walls` : garde-corps du pont et murs de soutènement de la tranchée ;
// - `decks` : dessous du tablier (vu depuis la tranchée) ;
// - `pillars` : piles du pont [x, y bas, z, hauteur], hors de la voie basse.
const LANE_Y = 0.03
const RAIL = 0.9
const DECK = 0.7
const PILLAR_STEP = 12

function point(path, i, lateral, y) {
  return [path.x[i] - path.tz[i] * lateral, y, path.z[i] + path.tx[i] * lateral]
}

function quad(out, a, b, c, d) {
  out.push(...a, ...b, ...c, ...a, ...c, ...d)
}

function laneSamples(path, crossing, item, branch) {
  const list = []
  for (let k = 0; k <= item.steps; k += 1) {
    const i = (item.index + k) % path.count
    const t = crossing.crossingT[i]
    list.push({ i, t, center: branchCenter(item, branch, t), y: path.y[i] + branchHeight(branch, t) })
  }
  return list
}

function addLane(lanes, path, samples, half, startDistance) {
  for (let k = 0; k < samples.length - 1; k += 1) {
    const a = samples[k]
    const b = samples[k + 1]
    const corners = [point(path, a.i, a.center - half, a.y + LANE_Y), point(path, a.i, a.center + half, a.y + LANE_Y), point(path, b.i, b.center + half, b.y + LANE_Y), point(path, b.i, b.center - half, b.y + LANE_Y)]
    quad(lanes.positions, ...corners)
    const da = startDistance + k * path.step
    const db = da + path.step
    lanes.road.push(-1, da, 1, da, 1, db, -1, da, 1, db, -1, db)
  }
}

function addWalls(walls, decks, path, samples, half, branch) {
  for (let k = 0; k < samples.length - 1; k += 1) {
    const a = samples[k]
    const b = samples[k + 1]
    const lift = Math.abs(branchHeight(branch, a.t))
    for (const side of [-1, 1]) {
      const la = a.center + side * half
      const lb = b.center + side * half
      // Pont : garde-corps et tablier ; tranchée : mur jusqu'au terrain (route d'origine).
      const topA = branch < 0 ? a.y + RAIL : path.y[a.i] + 0.5
      const topB = branch < 0 ? b.y + RAIL : path.y[b.i] + 0.5
      const baseA = branch < 0 ? a.y - (lift > 0.8 ? DECK : 0) : a.y
      const baseB = branch < 0 ? b.y - (lift > 0.8 ? DECK : 0) : b.y
      quad(walls, point(path, a.i, la, baseA), point(path, a.i, la, topA), point(path, b.i, lb, topB), point(path, b.i, lb, baseB))
    }
    if (branch < 0 && lift > 0.8) {
      const bottom = [point(path, a.i, a.center - half, a.y - DECK), point(path, b.i, b.center - half, b.y - DECK), point(path, b.i, b.center + half, b.y - DECK), point(path, a.i, a.center + half, a.y - DECK)]
      quad(decks, ...bottom)
    }
  }
}

function addPillars(pillars, path, upper, lower, half) {
  for (let k = 0; k < upper.length; k += PILLAR_STEP) {
    const a = upper[k]
    if (a.y - path.y[a.i] < 2) continue
    for (const side of [-1, 1]) {
      const lateral = a.center + side * (half - 0.6)
      if (Math.abs(lateral - lower[k].center) < half + 1) continue
      const [x, , z] = point(path, a.i, lateral, 0)
      pillars.push([x, path.y[a.i] - 0.5, z, a.y - DECK - path.y[a.i] + 0.5])
    }
  }
}

function toGeometry(positions, road) {
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3))
  if (road) geometry.setAttribute('aRoad', new BufferAttribute(new Float32Array(road), 2))
  geometry.computeVertexNormals()
  geometry.computeBoundingSphere()
  return geometry
}

export function buildCrossingGeometry(path, crossing) {
  if (!crossing.crossings.length) return null
  const lanes = { positions: [], road: [] }
  const walls = []
  const decks = []
  const pillars = []
  for (const item of crossing.crossings) {
    const upper = laneSamples(path, crossing, item, -1)
    const lower = laneSamples(path, crossing, item, 1)
    for (const [branch, samples] of [[-1, upper], [1, lower]]) {
      addLane(lanes, path, samples, item.laneHalf, item.start)
      addWalls(walls, decks, path, samples, item.laneHalf, branch)
    }
    addPillars(pillars, path, upper, lower, item.laneHalf)
  }
  return { lanes: toGeometry(lanes.positions, lanes.road), walls: toGeometry(walls), decks: toGeometry(decks), pillars }
}
