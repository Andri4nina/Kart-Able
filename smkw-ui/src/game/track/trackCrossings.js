// Croisements d'un circuit (calcul pur, une fois par circuit), d'après config/tracks.js :
// - crossings : [fraction du tour, longueur m] : sur une route large, les deux voies échangent
//   leurs côtés. La voie partie de gauche monte sur un pont (CROSSING.up m), celle de droite
//   descend dans une tranchée (CROSSING.down m) et passe dessous ; au milieu, l'une est
//   au-dessus de l'autre. Même longueur pour les deux. Route à hauteur 0, assez large (34).
// Par échantillon : `crossing` (numéro du croisement + 1, 0 sinon), `crossingT` (0..1 le long).
// `lock` : croisement et ses LOCK m suivants (les pilotes gardent le côté où ils sortent).
export const CROSSING = Object.freeze({ up: 4.5, down: 5, lock: 70, margin: 0.4 })

export function placeCrossings(track, path) {
  const crossing = new Uint8Array(path.count)
  const crossingT = new Float32Array(path.count)
  const lock = new Uint8Array(path.count)
  const crossings = []
  for (const [fraction, length] of track.crossings ?? []) {
    const start = fraction * path.length
    const index = Math.floor(start / path.step) % path.count
    const steps = Math.round(length / path.step)
    const width = Math.min(...Array.from({ length: steps + 1 }, (_, k) => path.width[(index + k) % path.count]))
    crossings.push({ start, length, index, steps, offset: width / 4, laneHalf: width / 4 - CROSSING.margin })
    for (let k = 0; k <= steps; k += 1) {
      const i = (index + k) % path.count
      crossing[i] = crossings.length
      crossingT[i] = k / steps
    }
    for (let k = 0; k <= steps + Math.round(CROSSING.lock / path.step); k += 1) lock[(index + k) % path.count] = 1
  }
  return { crossing, crossingT, lock, crossings }
}

// Voie `branch` (-1 partie de gauche, 1 de droite) au point t (0..1) : centre (m à droite de la
// ligne médiane) et hauteur ajoutée à la route.
export function branchCenter(item, branch, t) {
  return branch * item.offset * Math.cos(Math.PI * t)
}

export function branchHeight(branch, t) {
  const bump = Math.sin(Math.PI * t)
  return branch < 0 ? CROSSING.up * bump : -CROSSING.down * bump
}

// Tranchée d'un croisement : le terrain descend au niveau de la voie basse (lu par trackHeight.js).
const CUT_MARGIN = 5

export function crossingCutHeight(path, crossings, index, x, z) {
  const at = crossings?.crossing[index]
  if (!at) return Infinity
  const item = crossings.crossings[at - 1]
  const t = crossings.crossingT[index]
  const lateral = (x - path.x[index]) * -path.tz[index] + (z - path.z[index]) * path.tx[index]
  if (Math.abs(lateral - branchCenter(item, 1, t)) > item.laneHalf + CUT_MARGIN) return Infinity
  return path.y[index] + branchHeight(1, t) - 0.3
}
