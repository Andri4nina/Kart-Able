import { sampleTrack } from './trackLayout'

// Éléments posés sur la route d'un circuit (calcul pur, une fois par circuit), d'après
// config/tracks.js :
// - pads : [fraction du tour, position latérale -1..1] : pads d'accélération ;
// - obstacles : [fraction du tour, position latérale -1..1, rayon m ?] : rochers à éviter.
// La position latérale est relative à la demi-largeur utile (bord moins 2 m).
export const PAD_SIZE = Object.freeze({ length: 5, width: 3.2 })
const DEFAULT_OBSTACLE_RADIUS = 1.4

function place(path, fraction, side) {
  const point = sampleTrack(path, fraction * path.length)
  const lateral = side * Math.max(0, point.width / 2 - 2)
  const index = Math.round((fraction * path.length) / path.step) % path.count
  return { x: point.x - point.tz * lateral, z: point.z + point.tx * lateral, tx: point.tx, tz: point.tz, lateral, index, distance: fraction * path.length }
}

export function placeTrackFeatures(track, path) {
  const pads = (track.pads ?? []).map(([fraction, side]) => place(path, fraction, side))
  const obstacles = (track.obstacles ?? []).map(([fraction, side, radius]) => ({
    ...place(path, fraction, side),
    radius: radius ?? DEFAULT_OBSTACLE_RADIUS,
  }))
  return { pads, obstacles }
}
