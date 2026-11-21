// Écran partagé : une case par joueur local, partagée par l'UI (cadres, HUD) et la scène
// (une caméra par case). Données et calculs purs, sans React.

// Colonnes x rangées en paysage, selon le nombre de joueurs (1 à 8).
const LANDSCAPE_GRIDS = Object.freeze({
  1: [1, 1],
  2: [1, 2],
  3: [2, 2],
  4: [2, 2],
  5: [3, 2],
  6: [3, 2],
  7: [4, 2],
  8: [4, 2],
})

const MAX_VIEWPORTS = 8

// Même règle que la media query CSS `orientation: portrait` (hauteur >= largeur).
export function isPortrait(width, height) {
  return height >= width
}

// Grille { cols, rows } ; en portrait, une grille plus large que haute est retournée.
export function getSplitGrid(playerCount, portrait = false) {
  const count = Math.min(MAX_VIEWPORTS, Math.max(1, playerCount))
  const [cols, rows] = LANDSCAPE_GRIDS[count]
  return portrait && cols > rows ? { cols: rows, rows: cols } : { cols, rows }
}

// Identifiant de la grille paysage (ex. '2x2') : clé des classes Tailwind côté UI.
export function getSplitGridKey(playerCount) {
  const { cols, rows } = getSplitGrid(playerCount)
  return `${cols}x${rows}`
}

// Rectangle d'une case en fractions de l'écran (origine en haut à gauche), ordre de lecture
// (gauche à droite, puis haut en bas) : le même que celui d'une grille CSS.
export function getViewportRect(cellIndex, grid) {
  const col = cellIndex % grid.cols
  const row = Math.floor(cellIndex / grid.cols)
  return { x: col / grid.cols, y: row / grid.rows, width: 1 / grid.cols, height: 1 / grid.rows }
}

export function getCellCount(grid) {
  return grid.cols * grid.rows
}
