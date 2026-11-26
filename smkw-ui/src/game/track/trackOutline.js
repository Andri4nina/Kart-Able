import { getTrackGeometry } from './trackGeometry'
import { sampleTrack } from './trackLayout'

// Contour d'un circuit pour les mini-cartes (SVG) : coordonnées ramenées dans une boîte
// 100 x 100, nord en haut. Calcul pur, mis en cache par circuit.
const BOX = 100
const PADDING = 8
const cache = new Map()

function build(trackId) {
  const geometry = getTrackGeometry(trackId)
  if (!geometry) return null
  const { track, path, gates, bounds } = geometry
  const scale = (BOX - PADDING * 2) / (bounds.halfSize * 2)
  const toX = (x) => PADDING + (x - (bounds.centerX - bounds.halfSize)) * scale
  const toY = (z) => PADDING + (z - (bounds.centerZ - bounds.halfSize)) * scale
  const round = (value) => Math.round(value * 10) / 10

  let d = ''
  const stride = Math.max(1, Math.round(4 / path.step))
  for (let i = 0; i < path.count; i += stride) d += `${i === 0 ? 'M' : 'L'}${round(toX(path.x[i]))} ${round(toY(path.z[i]))}`
  d += 'Z'

  const start = sampleTrack(path, 0)
  const half = start.width / 2 + 3
  const widths = track.path.map((point) => point[2])
  return Object.freeze({
    viewBox: `0 0 ${BOX} ${BOX}`,
    // Passage monde -> carte (mini-carte de course : position des karts) : svg = pad + (monde - min) * scale.
    transform: { minX: bounds.centerX - bounds.halfSize, minZ: bounds.centerZ - bounds.halfSize, scale, pad: PADDING },
    d,
    roadWidth: round(18 * scale),
    lakes: track.lakes.map((lake) => ({ cx: round(toX(lake.x)), cy: round(toY(lake.z)), rx: round(lake.rx * scale), ry: round(lake.rz * scale), angle: round((lake.angle * 180) / Math.PI) })),
    start: { x1: round(toX(start.x + start.tz * half)), y1: round(toY(start.z - start.tx * half)), x2: round(toX(start.x - start.tz * half)), y2: round(toY(start.z + start.tx * half)) },
    gates: gates.slice(1).map((gate) => ({ x: round(toX(gate.x)), y: round(toY(gate.z)) })),
    stats: { length: Math.round(path.length), laps: track.laps, checkpoints: gates.length, minWidth: Math.min(...widths), maxWidth: Math.max(...widths) },
  })
}

export function getTrackOutline(trackId) {
  if (!cache.has(trackId)) cache.set(trackId, build(trackId))
  return cache.get(trackId)
}
