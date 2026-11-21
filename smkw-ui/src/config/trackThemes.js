// Ambiances des circuits : couleurs du sol, de l'eau et de l'herbe, essences d'arbres
// (voir components3d/Track/treeAssets.js) et densité de végétation. Couleurs pleines ;
// les shaders mélangent ces teintes selon la texture de données du circuit.

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
})

export function getTrackTheme(themeId) {
  return TRACK_THEMES[themeId] ?? TRACK_THEMES.meadow
}
