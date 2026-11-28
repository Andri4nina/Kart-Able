import { BufferAttribute, BufferGeometry } from 'three'
import { SPLIT_STYLES } from '../../game/track/trackSplits'

// Séparation d'un embranchement (game/track/trackSplits.js) : bloc qui suit la route entre les
// deux voies, bouts en pointe, hauteur selon son style. Deux maillages : le dessus et les flancs.
// Canal : le dessus est l'eau, plus bas que la route, entre deux margelles. Rochers : positions
// des blocs posés sur une bande basse. Calcul une fois par embranchement.
const ROCK_STEP = 7

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

export function buildIslandGeometry(path, island, split) {
  const height = SPLIT_STYLES[split.style]?.height ?? SPLIT_STYLES.grass.height
  const canal = split.style === 'canal'
  const surface = canal ? -0.3 : height
  const top = []
  const sides = []
  const rocks = []
  for (let k = 0; k < split.steps; k += 1) {
    const i = (split.index + k) % path.count
    const j = (i + 1) % path.count
    if (island[i] <= 0 && island[j] <= 0) continue
    const corner = (n, side, y) => {
      const half = Math.max(island[n], 0.05) * side
      return [path.x[n] - path.tz[n] * half, path.y[n] + y, path.z[n] + path.tx[n] * half]
    }
    quad(top, corner(i, -1, surface), corner(i, 1, surface), corner(j, 1, surface), corner(j, -1, surface))
    const low = canal ? -0.6 : 0
    quad(sides, corner(i, -1, low), corner(i, -1, height), corner(j, -1, height), corner(j, -1, low))
    quad(sides, corner(i, 1, height), corner(i, 1, low), corner(j, 1, low), corner(j, 1, height))
    if (split.style === 'rocks' && k % ROCK_STEP === 0 && island[i] > 1.5) rocks.push([path.x[i], path.y[i] + height, path.z[i], Math.min(island[i] * 0.8, 2.6)])
  }
  if (!top.length) return null
  return { top: ribbon(top), sides: ribbon(sides), rocks }
}
