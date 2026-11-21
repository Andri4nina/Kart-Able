// Circuits : unique source de vérité. Un circuit n'est qu'une poignée de données ; la route, le
// terrain, l'eau, la végétation et le décor en sont générés (game/track, components3d/Track).
// - path  : points de contrôle [x, z, largeur] en mètres, boucle fermée dans le sens de course ;
//           le premier point est la ligne de départ / arrivée (précédée d'une ligne droite pour
//           la grille de 32 karts) ;
// - lakes : plans d'eau elliptiques { x, z, rx, rz, angle } ;
// - theme : ambiance (config/trackThemes.js) ; seed : graine du placement de la végétation.
// Dimensionnement pour 32 joueurs : 17 à 20 m de large (4 karts de front), 750 à 950 m par
// tour (environ 35 s), 3 tours.
// Textes : tracks.<id>.name et tracks.<id>.description.

export const TRACKS = Object.freeze([
  {
    id: 'kairosMeadow',
    theme: 'meadow',
    laps: 3,
    seed: 1201,
    path: [[-20, 80, 20], [40, 80, 20], [95, 74, 19], [130, 48, 18], [140, 8, 18], [124, -30, 17], [90, -44, 17], [60, -32, 17], [34, -56, 17], [10, -90, 18], [-36, -102, 18], [-82, -86, 18], [-110, -50, 18], [-114, -4, 18], [-122, 40, 18], [-102, 74, 19], [-70, 81, 20]],
    lakes: [
      { x: -30, z: -8, rx: 44, rz: 26, angle: 0.2 },
      { x: 175, z: -70, rx: 24, rz: 15, angle: -0.4 },
    ],
  },
  {
    id: 'mirrorLake',
    theme: 'lake',
    laps: 3,
    seed: 2407,
    path: [[0, 110, 20], [60, 112, 20], [120, 100, 19], [160, 60, 18], [168, 10, 17], [150, -30, 17], [165, -70, 17], [140, -110, 18], [90, -125, 18], [40, -105, 17], [0, -120, 17], [-50, -130, 18], [-110, -110, 18], [-150, -60, 18], [-160, 0, 18], [-140, 60, 19], [-90, 100, 20], [-45, 110, 20]],
    lakes: [{ x: 0, z: -2, rx: 118, rz: 76, angle: 0 }],
  },
  {
    id: 'echoWoods',
    theme: 'forest',
    laps: 3,
    seed: 3313,
    path: [[-30, 90, 18], [30, 92, 18], [80, 80, 17], [100, 45, 16], [80, 15, 16], [100, -15, 16], [130, -40, 16], [120, -80, 17], [80, -95, 17], [45, -70, 16], [20, -95, 16], [-20, -110, 17], [-60, -95, 17], [-70, -55, 16], [-100, -30, 16], [-130, 0, 17], [-120, 45, 17], [-90, 80, 18], [-60, 90, 18]],
    lakes: [{ x: 10, z: -25, rx: 32, rz: 18, angle: 0.5 }],
  },
  {
    id: 'turquoiseCoast',
    theme: 'coast',
    laps: 3,
    seed: 4129,
    path: [[-60, 100, 20], [10, 104, 20], [70, 100, 19], [112, 80, 18], [122, 45, 17], [98, 22, 16], [112, -2, 16], [150, -12, 17], [185, -42, 18], [176, -80, 18], [130, -92, 19], [60, -86, 20], [0, -94, 20], [-60, -86, 20], [-115, -74, 19], [-160, -46, 18], [-180, 0, 17], [-152, 30, 16], [-120, 24, 16], [-108, 56, 16], [-138, 84, 17], [-110, 104, 19]],
    lakes: [
      { x: 0, z: -340, rx: 640, rz: 222, angle: 0 },
      { x: 10, z: 8, rx: 52, rz: 28, angle: 0.1 },
    ],
  },
])

export const TRACK_IDS = Object.freeze(TRACKS.map((track) => track.id))

export function getTrack(trackId) {
  return TRACKS.find((track) => track.id === trackId) ?? null
}
