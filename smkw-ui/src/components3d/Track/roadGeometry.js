import { BufferAttribute, BufferGeometry } from 'three'

const ROAD_Y = 0.03

// Ruban d'asphalte le long du chemin (boucle fermée), largeur et hauteur variables (relief).
// Attribut `aRoad` : x = position en travers (-1 bord gauche, +1 bord droit), y = distance (m).
// `gaps` : échantillons sans route (brèches du deltaplane, game/track/trackJumps.js).
export function buildRoadGeometry(path, gaps) {
  const count = path.count
  const positions = new Float32Array(count * 2 * 3)
  const road = new Float32Array(count * 2 * 2)
  const normals = new Float32Array(count * 2 * 3)
  for (let i = 0; i < count; i += 1) {
    const half = path.width[i] / 2
    const sideX = -path.tz[i]
    const sideZ = path.tx[i]
    for (let edge = 0; edge < 2; edge += 1) {
      const sign = edge === 0 ? -1 : 1
      const v = i * 2 + edge
      positions.set([path.x[i] + sideX * half * sign, path.y[i] + ROAD_Y, path.z[i] + sideZ * half * sign], v * 3)
      road.set([sign, i * path.step], v * 2)
      normals.set([0, 1, 0], v * 3)
    }
  }
  const indices = []
  for (let i = 0; i < count; i += 1) {
    const a = i * 2
    const b = ((i + 1) % count) * 2
    if (gaps?.[i] || gaps?.[(i + 1) % count]) continue
    // Ordre des sommets : faces tournées vers le haut.
    indices.push(a, a + 1, b, a + 1, b + 1, b)
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  geometry.setAttribute('normal', new BufferAttribute(normals, 3))
  geometry.setAttribute('aRoad', new BufferAttribute(road, 2))
  geometry.setIndex(indices)
  // Normales recalculées : la route en pente est éclairée selon son inclinaison.
  geometry.computeVertexNormals()
  geometry.computeBoundingSphere()
  return geometry
}
