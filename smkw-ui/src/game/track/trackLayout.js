// Mise en page d'un circuit à partir de son chemin (trackPath.js) : point à une distance donnée,
// grille de départ, portes de checkpoint, emprise. Calcul pur.
// Repère : `side` = droite du sens de course = (-tz, tx) ; yaw = rotation Y qui oriente +Z
// (l'avant des modèles) dans le sens de course.

export const GRID = Object.freeze({ columns: 4, firstRowBack: 6, rowSpacing: 6, stagger: 3, maxColumnSpacing: 4.2 })
// Une porte tous les ~60 m environ ; elle déborde de la route pour couvrir les bas-côtés.
const GATE_SPACING = 60
const GATE_OVERHANG = 12

// Point du chemin à la distance `distance` (bouclée), interpolé entre deux échantillons.
export function sampleTrack(path, distance) {
  const wrapped = ((distance % path.length) + path.length) % path.length
  const position = wrapped / path.step
  const i = Math.floor(position) % path.count
  const j = (i + 1) % path.count
  const f = position - Math.floor(position)
  const tx = path.tx[i] + (path.tx[j] - path.tx[i]) * f
  const tz = path.tz[i] + (path.tz[j] - path.tz[i]) * f
  const norm = Math.hypot(tx, tz) || 1
  return {
    x: path.x[i] + (path.x[j] - path.x[i]) * f,
    z: path.z[i] + (path.z[j] - path.z[i]) * f,
    width: path.width[i] + (path.width[j] - path.width[i]) * f,
    tx: tx / norm,
    tz: tz / norm,
  }
}

export function yawOf(tx, tz) {
  return Math.atan2(tx, tz)
}

// Place de départ n° `index` (0 = pole position), derrière la ligne d'arrivée : 4 colonnes,
// colonnes impaires en retrait (quinconce) pour que personne ne parte coude à coude.
export function getStartSlot(path, index) {
  const row = Math.floor(index / GRID.columns)
  const column = index % GRID.columns
  const back = GRID.firstRowBack + row * GRID.rowSpacing + (column % 2) * GRID.stagger
  const point = sampleTrack(path, -back)
  const spacing = Math.min(GRID.maxColumnSpacing, (point.width - 3) / GRID.columns)
  const lateral = (column - (GRID.columns - 1) / 2) * spacing
  return { x: point.x - point.tz * lateral, z: point.z + point.tx * lateral, yaw: yawOf(point.tx, point.tz) }
}

// Portes de checkpoint régulières ; la porte 0 est la ligne de départ / arrivée.
export function getCheckpointGates(path) {
  const count = Math.max(6, Math.round(path.length / GATE_SPACING))
  return Array.from({ length: count }, (_, index) => {
    const point = sampleTrack(path, (index * path.length) / count)
    return { index, x: point.x, z: point.z, tx: point.tx, tz: point.tz, halfWidth: point.width / 2 + GATE_OVERHANG }
  })
}

// Emprise du circuit (route comprise) : centre et demi-taille du carré qui l'englobe.
export function getTrackBounds(path) {
  let minX = Infinity
  let maxX = -Infinity
  let minZ = Infinity
  let maxZ = -Infinity
  for (let i = 0; i < path.count; i += 1) {
    const half = path.width[i] / 2
    minX = Math.min(minX, path.x[i] - half)
    maxX = Math.max(maxX, path.x[i] + half)
    minZ = Math.min(minZ, path.z[i] - half)
    maxZ = Math.max(maxZ, path.z[i] + half)
  }
  return { centerX: (minX + maxX) / 2, centerZ: (minZ + maxZ) / 2, halfSize: Math.max(maxX - minX, maxZ - minZ) / 2 }
}

// Courbure signée (radians par mètre) autour de l'échantillon i : sert aux bordures de virage.
export function getCurvature(path, i, span = 4) {
  const a = (i - span + path.count) % path.count
  const b = (i + span) % path.count
  const cross = path.tx[a] * path.tz[b] - path.tz[a] * path.tx[b]
  const dot = path.tx[a] * path.tx[b] + path.tz[a] * path.tz[b]
  return Math.atan2(cross, dot) / (2 * span * path.step)
}
