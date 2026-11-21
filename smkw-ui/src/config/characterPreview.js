// Géométrie de la rangée de previews 3D (écran de sélection), partagée par la scène
// (positions des modèles, plan caméra) et l'UI (étiquettes alignées sous chaque modèle).
// Calcul pur, sans Three.js : la caméra ne tourne pas autour de Y, donc une rangée
// horizontale se projette linéairement à l'écran.

export const PREVIEW_STAGE = Object.freeze({
  lineupZ: 7.5,
  // Cadrage : socles vers 37 % de la hauteur d'écran, sommet des modèles vers 20 %
  // (sous l'en-tête), quel que soit le ratio (le FOV est vertical).
  camera: Object.freeze({ position: [0, 2.2, 16.7], target: [0, 0.2, 10.9], fov: 40 }),
  // Part de la largeur d'écran occupée par la rangée (même valeur côté UI).
  widthFraction: 0.8,
  // Largeur du plus large modèle (tank, roues comprises) et échelle maximale d'un modèle
  // (limitée par la hauteur de la bande de preview).
  modelWidth: 2,
  maxScale: 0.58,
})

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const normalize = (v) => {
  const length = Math.hypot(v[0], v[1], v[2]) || 1
  return [v[0] / length, v[1] / length, v[2] / length]
}

const { position, target, fov } = PREVIEW_STAGE.camera
const forward = normalize(sub(target, position))
// Caméra sans lacet : droite = X, haut = droite x avant.
const up = normalize([0, -forward[2], forward[1]])
const tanHalfFov = Math.tan((fov * Math.PI) / 360)

function project(y, zOffset = 0) {
  const offset = sub([0, y, PREVIEW_STAGE.lineupZ + zOffset], position)
  const depth = dot(offset, forward)
  return { depth, ndcY: dot(offset, up) / (depth * tanHalfFov) }
}

// Positions X des modèles et échelle, pour `count` joueurs et un ratio d'écran donné.
export function getLineupLayout(count, aspect) {
  const halfWidth = project(0).depth * tanHalfFov * aspect
  const span = 2 * halfWidth * PREVIEW_STAGE.widthFraction
  const spacing = span / Math.max(1, count)
  return {
    positions: Array.from({ length: count }, (_, index) => -span / 2 + spacing * (index + 0.5)),
    scale: Math.min(PREVIEW_STAGE.maxScale, (spacing * 0.9) / PREVIEW_STAGE.modelWidth),
  }
}

// Position verticale à l'écran (en % depuis le haut) d'un point de la rangée
// (hauteur y, décalage vers la caméra zOffset).
export function getLineupScreenTop(y = 0, zOffset = 0) {
  return ((1 - project(y, zOffset).ndcY) / 2) * 100
}

// Bord avant des socles (rayon 1 à l'échelle maximale) : les étiquettes se placent juste dessous.
export function getPedestalFrontTop() {
  return getLineupScreenTop(0, PREVIEW_STAGE.maxScale)
}
