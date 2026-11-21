import { createRandom } from '../../game/track/noise'
import { sampleTrack } from '../../game/track/trackLayout'
import { sampleTrackField } from './trackField'

// Placement déterministe de la végétation (même graine, même forêt), tirée le long du tracé :
// hors de la route, de l'accotement, de l'eau et du sable, plus dense là où l'herbe l'est,
// jusqu'à ~150 m du circuit (au-delà, le brouillard la cacherait). Aucun arbre près de la
// ligne de départ (tribunes, portique).
const REACH = 150
const CELL = 5 // un objet par case de 5 m au plus : pas de chevauchement

function createNearestDistance(path) {
  const stride = Math.max(1, Math.round(8 / path.step))
  const samples = []
  for (let i = 0; i < path.count; i += stride) samples.push([path.x[i], path.z[i], path.width[i] / 2])
  return (x, z) => {
    let best = Infinity
    for (const [px, pz, half] of samples) best = Math.min(best, Math.hypot(x - px, z - pz) - half)
    return best
  }
}

export function scatterVegetation({ track, path, field, theme }) {
  const random = createRandom(track.seed * 7 + 3)
  const distanceToRoad = createNearestDistance(path)
  const start = sampleTrack(path, 0)
  const occupied = new Set()
  const trees = []
  const bushes = []
  const wanted = theme.treeCount + theme.bushCount
  for (let attempt = 0; attempt < wanted * 12 && trees.length + bushes.length < wanted; attempt += 1) {
    // Tirage le long du tracé : un point du chemin, un côté, une distance (plus dense près de
    // la route, là où la végétation se voit).
    const i = Math.floor(random() * path.count)
    const lateral = (random() < 0.5 ? -1 : 1) * (path.width[i] / 2 + 7 + random() ** 1.6 * REACH)
    const x = path.x[i] - path.tz[i] * lateral
    const z = path.z[i] + path.tx[i] * lateral
    const cell = sampleTrackField(field, x, z)
    if (!cell || cell.road > 0.01 || cell.water > 0 || cell.sand > 0.15) continue
    const distance = distanceToRoad(x, z)
    if (distance < 7 || distance > REACH || Math.hypot(x - start.x, z - start.z) < 45) continue
    if (random() > 0.2 + cell.grass * 0.8) continue
    const key = `${Math.floor(x / CELL)}:${Math.floor(z / CELL)}`
    if (occupied.has(key)) continue
    occupied.add(key)
    const isBush = distance < 14 || bushes.length < theme.bushCount * (trees.length / theme.treeCount)
    if (isBush && bushes.length < theme.bushCount) {
      bushes.push({ x, z, yaw: random() * Math.PI * 2, scale: 1.1 + random() * 1.3, kind: Math.floor(random() * 3) })
    } else if (trees.length < theme.treeCount) {
      const species = theme.trees[Math.floor(random() * theme.trees.length)]
      trees.push({ x, z, yaw: random() * Math.PI * 2, scale: 6.5 + random() * 5.5, species })
    }
  }
  return { trees, bushes }
}
