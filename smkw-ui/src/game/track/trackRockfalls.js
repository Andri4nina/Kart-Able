import { sampleTrack } from './trackLayout'

// Éboulements d'un circuit (calcul pur), d'après config/tracks.js :
// - rockfalls : [fraction du tour, longueur m, nombre de rochers ?] : des rochers tombent des
//   falaises sur la route, chacun à son rythme. Cycle d'un rocher (ROCKFALL, secondes) : ombre
//   d'alerte qui grandit (`warn`), chute (`fall`), rocher posé sur la route comme un obstacle
//   (`rest`), il s'effrite (`crumble`), puis plus rien jusqu'au cycle suivant.
// Le cycle ne dépend que du temps de course : toutes les machines d'une partie en réseau voient
// les mêmes chutes. `rockfall` : 1 sur les échantillons d'une zone d'éboulement.
export const ROCKFALL = Object.freeze({ period: 7.5, warn: 1.5, fall: 0.55, rest: 2.6, crumble: 0.5, drop: 24, radius: 2.1, spacing: 22 })

// Pseudo-aléa stable (0..1) d'un entier.
const hash = (n) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return s - Math.floor(s)
}

export function placeRockfalls(track, path) {
  const rockfall = new Uint8Array(path.count)
  const rocks = []
  ;(track.rockfalls ?? []).forEach(([fraction, length, count], zone) => {
    const start = fraction * path.length
    for (let d = 0; d <= length; d += path.step) rockfall[Math.floor((start + d) / path.step) % path.count] = 1
    const total = count ?? Math.max(2, Math.round(length / ROCKFALL.spacing))
    for (let k = 0; k < total; k += 1) {
      const seed = track.seed + zone * 97 + k * 13
      const p = sampleTrack(path, start + ((k + 0.5) / total) * length)
      const lateral = (hash(seed) * 2 - 1) * Math.max(0, p.width / 2 - 3)
      rocks.push({ x: p.x - p.tz * lateral, z: p.z + p.tx * lateral, radius: ROCKFALL.radius * (0.8 + hash(seed + 1) * 0.45), phase: hash(seed + 2) * ROCKFALL.period })
    }
  })
  return { rockfall, fallingRocks: rocks }
}

// État d'un rocher à l'instant `time` (temps de course) dans `out` : stage ('idle' | 'warn' |
// 'fall' | 'rest' | 'crumble'), t (0..1 dans l'étape), height (m au-dessus du sol).
export function readRock(rock, time, out) {
  const { period, warn, fall, rest, crumble, drop } = ROCKFALL
  let c = (time + rock.phase) % period
  if (c < 0) c += period
  out.height = 0
  if (c < warn) return Object.assign(out, { stage: 'warn', t: c / warn })
  c -= warn
  if (c < fall) {
    const t = c / fall
    return Object.assign(out, { stage: 'fall', t, height: drop * (1 - t * t) })
  }
  c -= fall
  if (c < rest) return Object.assign(out, { stage: 'rest', t: c / rest })
  c -= rest
  if (c < crumble) return Object.assign(out, { stage: 'crumble', t: c / crumble })
  return Object.assign(out, { stage: 'idle', t: 0 })
}
