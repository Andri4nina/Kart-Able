import { sampleTrack } from './trackLayout'

// Voies d'eau d'un circuit (calcul pur, une fois par circuit), d'après config/tracks.js :
// - waterways : [fraction du tour, longueur m] : la route devient un plan d'eau sur lequel les
//   karts glissent (WATER, config/kartTuning.js) sans couler ; des lacs sont posés tout le long
//   (rives, eau animée). Garder la route à hauteur 0 sur ces portions.
// `water` : 1 sur les échantillons de voie d'eau.
export const WATERWAY = Object.freeze({ spacing: 14, shore: 10, side: 14, level: -0.2 })

export function placeWaterways(track, path) {
  const water = new Uint8Array(path.count)
  const waterLakes = []
  for (const [fraction, length] of track.waterways ?? []) {
    const start = fraction * path.length
    for (let d = 0; d < length; d += path.step / 2) water[Math.floor((start + d) / path.step) % path.count] = 1
    // Chapelet de lacs le long de la voie : il suit les virages.
    for (let d = 0; d <= length; d += WATERWAY.spacing) {
      const p = sampleTrack(path, start + d)
      const end = d === 0 || d + WATERWAY.spacing > length
      waterLakes.push({ x: p.x, z: p.z, rx: WATERWAY.spacing * 0.9 + (end ? 0 : WATERWAY.shore), rz: p.width / 2 + WATERWAY.side, angle: Math.atan2(p.tz, p.tx) })
    }
  }
  return { water, waterLakes }
}
