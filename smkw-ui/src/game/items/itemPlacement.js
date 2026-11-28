import { ITEM_BOXES } from '../../config/items'

// Point de la route à `distance` (bouclée) et `lateral` m à droite de la ligne médiane, sans
// allocation : écrit { x, z, tx, tz, index } dans `out`.
export function writeTrackPoint(path, distance, lateral, out) {
  const wrapped = ((distance % path.length) + path.length) % path.length
  const position = wrapped / path.step
  const i = Math.floor(position) % path.count
  const j = (i + 1) % path.count
  const f = position - Math.floor(position)
  const tx = path.tx[i] + (path.tx[j] - path.tx[i]) * f
  const tz = path.tz[i] + (path.tz[j] - path.tz[i]) * f
  const norm = Math.hypot(tx, tz) || 1
  out.tx = tx / norm
  out.tz = tz / norm
  out.x = path.x[i] + (path.x[j] - path.x[i]) * f - out.tz * lateral
  out.z = path.z[i] + (path.z[j] - path.z[i]) * f + out.tx * lateral
  out.index = i
  return out
}

// Cases à objets d'un circuit : rangées en travers de la route aux fractions du tour
// (`track.itemRows` ou ITEM_BOXES.rows), jamais sur le terre-plein d'un embranchement (`island`).
// Calcul pur, une fois par course.
export function placeItemBoxes(track, path, island) {
  const rows = track.itemRows ?? ITEM_BOXES.rows
  const boxes = []
  const point = { x: 0, z: 0, tx: 0, tz: 0, index: 0 }
  for (const fraction of rows) {
    const distance = fraction * path.length
    writeTrackPoint(path, distance, 0, point)
    const usable = path.width[point.index] - 5
    for (let k = 0; k < ITEM_BOXES.perRow; k += 1) {
      const lateral = (k / (ITEM_BOXES.perRow - 1) - 0.5) * usable
      writeTrackPoint(path, distance, lateral, point)
      if (island && Math.abs(lateral) < island[point.index] + 1.5) continue
      boxes.push({ x: point.x, z: point.z, index: point.index, active: true, timer: 0 })
    }
  }
  return boxes
}
