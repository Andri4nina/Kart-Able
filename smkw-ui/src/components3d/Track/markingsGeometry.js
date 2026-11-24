import { BufferAttribute, BufferGeometry, Color } from 'three'
import { getCurvature, getStartSlot, GRID, sampleTrack } from '../../game/track/trackLayout'

// Marquages au sol en couleurs de sommet (un seul maillage, aucune texture) : bordures rouge et
// blanc dans les virages, ligne d'arrivée en damier, repères des 32 places de départ.
const RED = new Color('#e63946')
const WHITE = new Color('#f5f7fa')
const BLACK = new Color('#14161c')
const CURB_WIDTH = 1.4
const CURB_STEP = 2.5 // longueur d'un pavé de bordure (m)
const CURB_CURVATURE = 0.011 // rad/m : rayon < ~90 m
const MARK_Y = 0.045

function createBuilder() {
  const positions = []
  const colors = []
  // Quadrilatère a-b-c-d, une couleur. Les sommets sont remis dans l'ordre qui tourne la face
  // vers le haut : une face retournée serait éclairée par le dessous (teinte du sol).
  const quad = (a, b, c, d, color) => {
    const facesUp = (b[1] - a[1]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[1] - a[1]) > 0
    for (const p of facesUp ? [a, b, c, a, c, d] : [a, c, b, a, d, c]) {
      positions.push(p[0], (p[2] ?? 0) + MARK_Y, p[1])
      colors.push(color.r, color.g, color.b)
    }
  }
  const toGeometry = () => {
    const geometry = new BufferGeometry()
    geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3))
    geometry.setAttribute('color', new BufferAttribute(new Float32Array(colors), 3))
    geometry.setAttribute('normal', new BufferAttribute(new Float32Array(positions.length).map((_, i) => (i % 3 === 1 ? 1 : 0)), 3))
    return geometry
  }
  return { quad, toGeometry }
}

// Point à `lateral` mètres sur la droite de l'échantillon i : [x, z, hauteur de la route].
const offsetPoint = (path, i, lateral) => [path.x[i] - path.tz[i] * lateral, path.z[i] + path.tx[i] * lateral, path.y[i]]

function addCurbs(builder, path) {
  for (let i = 0; i < path.count; i += 1) {
    const j = (i + 1) % path.count
    if (Math.abs(getCurvature(path, i)) < CURB_CURVATURE || Math.abs(getCurvature(path, j)) < CURB_CURVATURE) continue
    const color = Math.floor((i * path.step) / CURB_STEP) % 2 === 0 ? RED : WHITE
    for (const sign of [-1, 1]) {
      const inner = sign * (path.width[i] / 2)
      const innerNext = sign * (path.width[j] / 2)
      builder.quad(offsetPoint(path, i, inner), offsetPoint(path, j, innerNext), offsetPoint(path, j, innerNext + sign * CURB_WIDTH), offsetPoint(path, i, inner + sign * CURB_WIDTH), color)
    }
  }
}

// Damier de 3 m de profondeur, centré sur la ligne (distance 0).
function addStartLine(builder, path) {
  const point = sampleTrack(path, 0)
  const columns = Math.round(point.width / 1.5)
  const cell = point.width / columns
  for (let row = 0; row < 2; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const along = (row - 1) * 1.5
      const lateral = -point.width / 2 + column * cell
      const at = (forward, side) => [point.x + point.tx * forward - point.tz * side, point.z + point.tz * forward + point.tx * side, point.y]
      builder.quad(at(along, lateral), at(along + 1.5, lateral), at(along + 1.5, lateral + cell), at(along, lateral + cell), (row + column) % 2 ? WHITE : BLACK)
    }
  }
}

// Repère blanc devant chaque place de la grille (32 places).
function addGridMarks(builder, path, slotCount) {
  for (let index = 0; index < slotCount; index += 1) {
    const slot = getStartSlot(path, index)
    const fx = Math.sin(slot.yaw)
    const fz = Math.cos(slot.yaw)
    const at = (forward, side) => [slot.x + fx * forward - fz * side, slot.z + fz * forward + fx * side, slot.y]
    builder.quad(at(1.6, -1), at(1.9, -1), at(1.9, 1), at(1.6, 1), WHITE)
  }
}

export function buildMarkingsGeometry(path, slotCount = GRID.columns * 8) {
  const builder = createBuilder()
  addCurbs(builder, path)
  addStartLine(builder, path)
  addGridMarks(builder, path, slotCount)
  return builder.toGeometry()
}
