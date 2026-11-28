import { sampleTrack } from './trackLayout'

// Plongées d'un circuit (calcul pur, une fois par circuit), d'après config/tracks.js :
// - dives : [fraction du tour, longueur m, profondeur m] : la route descend en pente douce sous
//   un lagon (posé tout du long), file au fond de l'eau, puis remonte. Les karts y roulent sous
//   l'eau (UNDERWATER, config/kartTuning.js) sans couler. Route à hauteur 0 autour.
// Modifie `path.y` (avant le calcul du relief). `under` : 1 sur toute la plongée (pentes comprises :
// on n'y coule pas) ; le kart n'est sous l'eau qu'en dessous de la surface (kartMove.js).
export const DIVE = Object.freeze({ slope: 50, spacing: 16, side: 34, immersed: 1.2, surface: -0.25 })

const smooth = (t) => t * t * (3 - 2 * t)

export function applyDives(track, path) {
  const under = new Uint8Array(path.count)
  const diveLakes = []
  for (const [fraction, length, depth] of track.dives ?? []) {
    const start = fraction * path.length
    for (let d = 0; d <= length; d += path.step / 2) {
      const i = Math.floor((start + d) / path.step) % path.count
      const t = Math.max(0, Math.min(1, d / DIVE.slope, (length - d) / DIVE.slope))
      const drop = depth * smooth(t)
      path.y[i] = Math.min(path.y[i], -drop)
      under[i] = 1
    }
    // Lagon au-dessus de la partie immergée (il déborde un peu sur les pentes).
    const from = DIVE.slope * 0.35
    for (let d = from; d <= length - from; d += DIVE.spacing) {
      const p = sampleTrack(path, start + d)
      diveLakes.push({ x: p.x, z: p.z, rx: DIVE.spacing * 1.1, rz: p.width / 2 + DIVE.side, angle: Math.atan2(p.tz, p.tx) })
    }
  }
  return { under, diveLakes }
}
