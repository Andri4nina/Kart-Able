// Ligne médiane d'un circuit : spline de Catmull-Rom centripète fermée passant par les points
// de contrôle [x, z, largeur], rééchantillonnée à pas constant (mètres). Calcul pur, sans
// Three.js : partagé par la scène 3D (route, décor, grille) et l'UI (mini-cartes).

const DENSITY = 24 // échantillons par segment avant rééchantillonnage
const ALPHA = 0.5 // centripète : pas de boucle ni de pointe dans les virages serrés

function knot(t, a, b) {
  return t + Math.max(Math.hypot(b[0] - a[0], b[1] - a[1]), 1e-4) ** ALPHA
}

// Point de la courbe entre p1 et p2 (formulation de Barry-Goldman), u dans [0, 1].
function catmullRom(p0, p1, p2, p3, u) {
  const t0 = 0
  const t1 = knot(t0, p0, p1)
  const t2 = knot(t1, p1, p2)
  const t3 = knot(t2, p2, p3)
  const t = t1 + (t2 - t1) * u
  const lerp = (a, b, ta, tb) => [0, 1].map((i) => ((tb - t) * a[i] + (t - ta) * b[i]) / (tb - ta))
  const a1 = lerp(p0, p1, t0, t1)
  const a2 = lerp(p1, p2, t1, t2)
  const a3 = lerp(p2, p3, t2, t3)
  const b1 = lerp(a1, a2, t0, t2)
  const b2 = lerp(a2, a3, t1, t3)
  return lerp(b1, b2, t1, t2)
}

// Polyligne dense (x, z, largeur), fermée, dans l'ordre de course.
function densify(points) {
  const dense = []
  const count = points.length
  for (let i = 0; i < count; i += 1) {
    const [p0, p1, p2, p3] = [-1, 0, 1, 2].map((offset) => points[(i + offset + count) % count])
    for (let step = 0; step < DENSITY; step += 1) {
      const u = step / DENSITY
      const [x, z] = catmullRom(p0, p1, p2, p3, u)
      const blend = u * u * (3 - 2 * u)
      dense.push([x, z, p1[2] + (p2[2] - p1[2]) * blend])
    }
  }
  return dense
}

// Chemin rééchantillonné tous les `step` mètres : positions, largeurs, tangentes unitaires,
// distances cumulées, longueur totale. Le point 0 est la ligne de départ / arrivée.
export function buildTrackPath(points, step = 1) {
  const dense = densify(points)
  const lengths = [0]
  for (let i = 1; i <= dense.length; i += 1) {
    const [ax, az] = dense[i - 1]
    const [bx, bz] = dense[i % dense.length]
    lengths.push(lengths[i - 1] + Math.hypot(bx - ax, bz - az))
  }
  const length = lengths[dense.length]
  const count = Math.max(8, Math.round(length / step))
  const path = { count, length, step: length / count, x: new Float32Array(count), z: new Float32Array(count), width: new Float32Array(count), tx: new Float32Array(count), tz: new Float32Array(count) }

  let cursor = 0
  for (let i = 0; i < count; i += 1) {
    const target = i * path.step
    while (lengths[cursor + 1] < target) cursor += 1
    const a = dense[cursor]
    const b = dense[(cursor + 1) % dense.length]
    const f = (target - lengths[cursor]) / Math.max(lengths[cursor + 1] - lengths[cursor], 1e-6)
    path.x[i] = a[0] + (b[0] - a[0]) * f
    path.z[i] = a[1] + (b[1] - a[1]) * f
    path.width[i] = a[2] + (b[2] - a[2]) * f
  }
  for (let i = 0; i < count; i += 1) {
    const next = (i + 1) % count
    const prev = (i - 1 + count) % count
    const dx = path.x[next] - path.x[prev]
    const dz = path.z[next] - path.z[prev]
    const norm = Math.hypot(dx, dz) || 1
    path.tx[i] = dx / norm
    path.tz[i] = dz / norm
  }
  return path
}
