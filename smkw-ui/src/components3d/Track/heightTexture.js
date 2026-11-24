import { DataTexture, LinearFilter, RGBAFormat } from 'three'
import { getGroundHeight } from '../../game/track/trackHeight'

const HEIGHT_RESOLUTION = 256

// Hauteurs du relief en texture (lue par l'herbe, qui pousse sur les collines) : R = hauteur
// ramenée dans [0, 1] sur l'intervalle `range` [min, max].
export function buildHeightTexture(geometry, origin, size) {
  const n = HEIGHT_RESOLUTION
  const heights = new Float32Array(n * n)
  let min = Infinity
  let max = -Infinity
  for (let row = 0; row < n; row += 1) {
    for (let column = 0; column < n; column += 1) {
      const h = getGroundHeight(geometry, origin[0] + ((column + 0.5) / n) * size, origin[1] + ((row + 0.5) / n) * size)
      heights[row * n + column] = h
      min = Math.min(min, h)
      max = Math.max(max, h)
    }
  }
  const span = Math.max(max - min, 1e-3)
  const data = new Uint8Array(n * n * 4)
  for (let i = 0; i < n * n; i += 1) data[i * 4] = Math.round(((heights[i] - min) / span) * 255)
  const texture = new DataTexture(data, n, n, RGBAFormat)
  texture.magFilter = LinearFilter
  texture.minFilter = LinearFilter
  texture.needsUpdate = true
  return { heightTexture: texture, heightRange: [min, span] }
}
