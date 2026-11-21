// Grille de départ de l'arène de démonstration (modes sans circuit ; les circuits ont la leur,
// voir game/track/trackLayout.js) : deux colonnes, P1 devant à gauche, P2 devant à droite, etc.
// Les karts regardent -Z (vers le centre de l'arène) ; leur caméra de poursuite est derrière (+Z).

export const START_GRID = Object.freeze({
  firstRowZ: 9.5,
  rowSpacing: 4.5,
  columnX: 1.6,
  // Rotation des karts : les modèles normalisés regardent +Z, on les tourne vers -Z.
  yaw: Math.PI,
})

export function getGridSlot(index) {
  const column = index % 2
  const row = Math.floor(index / 2)
  return {
    x: column === 0 ? -START_GRID.columnX : START_GRID.columnX,
    z: START_GRID.firstRowZ + row * START_GRID.rowSpacing,
  }
}
