import { BufferAttribute, BufferGeometry } from 'three'
import { SPLIT } from '../../game/track/trackSplits'

// Terre-plein des embranchements (game/track/trackSplits.js) : bloc surélevé de SPLIT.height m
// qui suit la route entre les deux voies, bouts en pointe. Deux maillages : le dessus (herbe) et
// les flancs (bordure). Calcul une fois par circuit.
function ribbon(points) {
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(points), 3))
  geometry.computeVertexNormals()
  geometry.computeBoundingSphere()
  return geometry
}

function quad(out, a, b, c, d) {
  out.push(...a, ...b, ...c, ...a, ...c, ...d)
}

export function buildIslandGeometry(path, island) {
  const top = []
  const sides = []
  for (let i = 0; i < path.count; i += 1) {
    const j = (i + 1) % path.count
    if (island[i] <= 0 && island[j] <= 0) continue
    const corner = (k, side, up) => {
      const half = Math.max(island[k], 0.05) * side
      return [path.x[k] - path.tz[k] * half, path.y[k] + (up ? SPLIT.height : 0), path.z[k] + path.tx[k] * half]
    }
    // Faces vers le haut et vers l'extérieur (ordre des sommets).
    quad(top, corner(i, -1, true), corner(i, 1, true), corner(j, 1, true), corner(j, -1, true))
    quad(sides, corner(i, -1, false), corner(i, -1, true), corner(j, -1, true), corner(j, -1, false))
    quad(sides, corner(i, 1, true), corner(i, 1, false), corner(j, 1, false), corner(j, 1, true))
  }
  if (!top.length) return null
  return { top: ribbon(top), sides: ribbon(sides) }
}
