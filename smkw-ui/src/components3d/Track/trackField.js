import { DataTexture, LinearFilter, RGBAFormat } from 'three'
import { fractalNoise } from '../../game/track/noise'
import { FIELD_MARGIN } from '../../game/track/trackHeight'
import { buildHeightTexture } from './heightTexture'

// Texture de données d'un circuit (même principe que le terrain du portfolio) : une carte vue de
// dessus où chaque canal décrit le sol.
//   R = route et bas-côtés (1 sur l'asphalte, fondu sur l'accotement) ;
//   G = densité d'herbe (bruit, nulle sur la route, le sable et l'eau) ;
//   B = profondeur de l'eau (0 hors de l'eau, ~0,06 au rivage, 1 au large) ;
//   A = sable (plages autour de l'eau, lit des hauts-fonds).
// Générée une fois par circuit ; les shaders (terrain, eau, herbe) et le placement de la
// végétation lisent tous la même carte.
const RESOLUTION = 512
const MARGIN = FIELD_MARGIN // mètres de paysage autour du circuit (même emprise que le relief)
const SHOULDER = 9
const SHORE_DEPTH = 22 // mètres pour passer du rivage au large
const BEACH = 12

function lakeDistance(lake, x, z) {
  const cos = Math.cos(-lake.angle)
  const sin = Math.sin(-lake.angle)
  const lx = (x - lake.x) * cos - (z - lake.z) * sin
  const lz = (x - lake.x) * sin + (z - lake.z) * cos
  const angle = Math.atan2(lz / lake.rz, lx / lake.rx)
  return Math.hypot(lx, lz) - Math.hypot(lake.rx * Math.cos(angle), lake.rz * Math.sin(angle))
}

// Masque de route dessiné au canevas : plusieurs traits de plus en plus étroits, translucides,
// dont l'empilement donne 1 sur l'asphalte et un fondu sur l'accotement.
function drawRoadMask(path, gaps, origin, size) {
  const canvas = document.createElement('canvas')
  canvas.width = RESOLUTION
  canvas.height = RESOLUTION
  const context = canvas.getContext('2d')
  const scale = RESOLUTION / size
  let maxWidth = 0
  for (let i = 0; i < path.count; i += 1) maxWidth = Math.max(maxWidth, path.width[i])
  const passes = 5
  context.lineJoin = 'round'
  context.strokeStyle = `rgba(255,255,255,${1 / passes})`
  for (let pass = 0; pass < passes; pass += 1) {
    context.lineWidth = (maxWidth + SHOULDER * 2 * (1 - pass / passes)) * scale
    context.beginPath()
    for (let i = 0; i <= path.count; i += 1) {
      const k = i % path.count
      const px = (path.x[k] - origin[0]) * scale
      const pz = (path.z[k] - origin[1]) * scale
      // Brèche (deltaplane) : pas de route, le trait reprend après.
      if (i === 0 || gaps[k] || gaps[(k - 1 + path.count) % path.count]) context.moveTo(px, pz)
      else context.lineTo(px, pz)
    }
    context.stroke()
  }
  return context.getImageData(0, 0, RESOLUTION, RESOLUTION).data
}

export function buildTrackField(geometry) {
  const { track, path, bounds } = geometry
  const size = (bounds.halfSize + MARGIN) * 2
  const origin = [bounds.centerX - size / 2, bounds.centerZ - size / 2]
  const road = drawRoadMask(path, geometry.hidden, origin, size)
  const data = new Uint8Array(RESOLUTION * RESOLUTION * 4)
  const texel = size / RESOLUTION

  for (let row = 0; row < RESOLUTION; row += 1) {
    const z = origin[1] + (row + 0.5) * texel
    for (let column = 0; column < RESOLUTION; column += 1) {
      const x = origin[0] + (column + 0.5) * texel
      const index = (row * RESOLUTION + column) * 4
      let shore = Infinity
      for (const lake of track.lakes) shore = Math.min(shore, lakeDistance(lake, x, z))
      const water = shore < 0 ? 0.06 + 0.94 * Math.min(1, -shore / SHORE_DEPTH) : 0
      const sand = shore < 0 ? 1 : Math.max(0, 1 - shore / BEACH)
      const asphalt = road[index] / 255
      const meadow = fractalNoise(x * 0.025, z * 0.025, track.seed)
      const grass = Math.max(0, Math.min(1, (meadow - 0.3) / 0.35)) * (1 - asphalt) * (1 - sand)
      data[index] = road[index]
      data[index + 1] = Math.round(grass * 255)
      data[index + 2] = Math.round(water * 255)
      data[index + 3] = Math.round(sand * 255)
    }
  }

  const texture = new DataTexture(data, RESOLUTION, RESOLUTION, RGBAFormat)
  texture.magFilter = LinearFilter
  texture.minFilter = LinearFilter
  texture.needsUpdate = true
  return { texture, data, origin, size, resolution: RESOLUTION, ...buildHeightTexture(geometry, origin, size) }
}

// Lecture CPU d'un point du monde (placement de la végétation et du décor), valeurs 0..1.
export function sampleTrackField(field, x, z) {
  const column = Math.floor(((x - field.origin[0]) / field.size) * field.resolution)
  const row = Math.floor(((z - field.origin[1]) / field.size) * field.resolution)
  if (column < 0 || row < 0 || column >= field.resolution || row >= field.resolution) return null
  const index = (row * field.resolution + column) * 4
  return { road: field.data[index] / 255, grass: field.data[index + 1] / 255, water: field.data[index + 2] / 255, sand: field.data[index + 3] / 255 }
}
