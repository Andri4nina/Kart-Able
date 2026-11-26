// Ambiances des circuits : couleurs du sol, de l'eau et de l'herbe, essences d'arbres
// (voir components3d/Track/treeAssets.js) et densité de végétation. Couleurs pleines ;
// les shaders mélangent ces teintes selon la texture de données du circuit. `road`
// (facultatif) : teinte de la route, asphalte sombre par défaut.

export const TRACK_THEMES = Object.freeze({
  meadow: {
    ground: ['#79c15d', '#5da84c'],
    shoulder: '#b8a074',
    sand: '#ecd9a4',
    water: { shallow: '#54c3cf', deep: '#1f6f95', foam: '#e8fbff' },
    grass: { tip: '#a9dd62', base: '#3d7a2a' },
    trees: ['greenCube', 'greenBlock', 'lollipop', 'softPine', 'fir', 'acacia'],
    treeCount: 320,
    bushCount: 260,
  },
  lake: {
    ground: ['#85cb72', '#69b765'],
    shoulder: '#c4ad86',
    sand: '#f0dfb2',
    water: { shallow: '#62d2d6', deep: '#246fa8', foam: '#f2fdff' },
    grass: { tip: '#b5e27a', base: '#457f33' },
    trees: ['purple', 'pinkPine', 'purpleTwist', 'redCube', 'orangeUmbrella', 'lollipop'],
    treeCount: 300,
    bushCount: 240,
  },
  forest: {
    ground: ['#5b9a52', '#477f43'],
    shoulder: '#9c8662',
    sand: '#d9c796',
    water: { shallow: '#4fb3a8', deep: '#1c5a6e', foam: '#e3f7f2' },
    grass: { tip: '#8fc85a', base: '#2c5f24' },
    trees: ['bluePine', 'fir', 'softPine', 'tallPine', 'tealLean'],
    treeCount: 950,
    bushCount: 320,
  },
  coast: {
    ground: ['#a0cf6c', '#84bd62'],
    shoulder: '#d6c08e',
    sand: '#f3e2b0',
    water: { shallow: '#5fe0d6', deep: '#127aa8', foam: '#ffffff' },
    grass: { tip: '#c1e67c', base: '#56913a' },
    trees: ['acacia', 'orangeUmbrella', 'tealLean', 'limeCube', 'lollipop'],
    treeCount: 260,
    bushCount: 200,
  },
  // Canyon : terre ocre, herbe sèche rare, arbres du désert.
  canyon: {
    ground: ['#d99a5b', '#c27d43'],
    shoulder: '#a86a3a',
    sand: '#f0c98a',
    water: { shallow: '#58c7c0', deep: '#1d7a8c', foam: '#f4fffd' },
    grass: { tip: '#d8c16a', base: '#8a6a2e' },
    trees: ['acacia', 'orangeUmbrella', 'limeCube'],
    treeCount: 160,
    bushCount: 140,
  },
  // Col alpin : prairies d'altitude pâles, conifères.
  alpine: {
    ground: ['#9fcf8a', '#86b975'],
    shoulder: '#b9b2a4',
    sand: '#e6e1d4',
    water: { shallow: '#7ad7e8', deep: '#2a6fa8', foam: '#ffffff' },
    grass: { tip: '#cfe9a8', base: '#5e8f4a' },
    trees: ['bluePine', 'fir', 'tallPine', 'softPine'],
    treeCount: 700,
    bushCount: 220,
  },
  // Neige : sol blanc bleuté, route de neige tassée, eau glacée, conifères.
  snow: {
    ground: ['#eef4fa', '#d6e3ef'],
    shoulder: '#b7c4d2',
    sand: '#f7fbff',
    road: '#6b7686',
    water: { shallow: '#9fe3f2', deep: '#3b7fb0', foam: '#ffffff' },
    grass: { tip: '#e9f2f6', base: '#9bb3a6' },
    trees: ['bluePine', 'fir', 'tallPine'],
    treeCount: 520,
    bushCount: 120,
  },
  // Forêt sous la neige : plus d'arbres, sol plus sombre entre les sapins.
  snowForest: {
    ground: ['#e3ecf4', '#c4d4e2'],
    shoulder: '#a9b6c4',
    sand: '#f2f7fc',
    road: '#5f6a79',
    water: { shallow: '#8fd8ea', deep: '#2f6f9e', foam: '#ffffff' },
    grass: { tip: '#dfeaf0', base: '#7f9a8c' },
    trees: ['bluePine', 'fir', 'tallPine', 'softPine'],
    treeCount: 950,
    bushCount: 160,
  },
  // Terre battue : piste brune, sol argileux, herbe sèche, arbres rares.
  dirt: {
    ground: ['#b9875a', '#a06f45'],
    shoulder: '#8a5a33',
    sand: '#d8b384',
    road: '#7a5232',
    water: { shallow: '#8ab8a0', deep: '#4b6f5a', foam: '#efe6d2' },
    grass: { tip: '#c9b46a', base: '#7a6230' },
    trees: ['acacia', 'orangeUmbrella', 'limeCube', 'greenBlock'],
    treeCount: 220,
    bushCount: 220,
  },
})

export function getTrackTheme(themeId) {
  return TRACK_THEMES[themeId] ?? TRACK_THEMES.meadow
}
