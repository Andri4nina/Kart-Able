import { sampleTrack } from './trackLayout'

// Embranchements d'un circuit (calcul pur, une fois par circuit), d'après config/tracks.js :
// - splits : [fraction du tour, longueur m, largeur m du terre-plein, style ?] : la route (élargie par ses
//   points de contrôle) est coupée en deux voies par un terre-plein central. Les deux voies ont
//   la même longueur ; chacune porte son propre défi (pads, rochers, tremplin : position latérale).
// Style de la séparation (SPLIT_STYLES) : herbe, haie, muret, canal ou rochers ; même collision.
// `island` : demi-largeur du terre-plein par échantillon (0 hors embranchement). Ses deux bouts
// sont effilés en pointe sur TAPER m : un kart qui arrive dessus glisse vers une voie.
export const SPLIT = Object.freeze({ taper: 16, height: 0.55 })
export const SPLIT_STYLES = Object.freeze({ grass: { height: 0.55 }, hedge: { height: 1.4 }, wall: { height: 1.1 }, canal: { height: 0.25 }, rocks: { height: 0.3 } })

const smooth = (t) => t * t * (3 - 2 * t)

export function placeSplits(track, path) {
  const island = new Float32Array(path.count)
  const splits = []
  for (const [fraction, length, width, style = 'grass'] of track.splits ?? []) {
    const start = fraction * path.length
    splits.push({ start, length, width, style, index: Math.floor(start / path.step) % path.count, steps: Math.round(length / path.step) })
    for (let d = 0; d <= length; d += path.step / 2) {
      const i = Math.floor((start + d) / path.step) % path.count
      const taper = Math.min(1, d / SPLIT.taper, (length - d) / SPLIT.taper)
      const half = (width / 2) * smooth(Math.max(0, taper))
      // Le terre-plein laisse toujours au moins 7 m de chaque côté.
      island[i] = Math.max(island[i], Math.min(half, sampleTrack(path, start + d).width / 2 - 7))
    }
  }
  return { island, splits }
}

// Demi-largeur du terre-plein devant un kart, au plus loin de `reach` m (0 si aucun).
export function islandAhead(path, island, index, reach) {
  const steps = Math.round(reach / path.step)
  let widest = 0
  for (let k = 0; k <= steps; k += 2) widest = Math.max(widest, island[(index + k) % path.count])
  return widest
}
