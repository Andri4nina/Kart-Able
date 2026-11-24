// Circuits : unique source de vérité. Un circuit n'est qu'une poignée de données ; la route, le
// terrain, l'eau, la végétation et le décor en sont générés (game/track, components3d/Track).
// - path  : points de contrôle [x, z, largeur, hauteur?] en mètres, boucle fermée dans le sens
//           de course ; le premier point est la ligne de départ / arrivée (précédée d'une ligne
//           droite pour la grille de 32 karts). La hauteur (0 par défaut) crée montées et
//           descentes ; garder la grille de départ à plat et la route à 0 près de l'eau (~70 m) ;
// - hills : amplitude (m) des collines du paysage autour de la route (0 par défaut) ;
// - itemRows : fractions du tour des rangées de cases à objets (config/items.js sinon) ;
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
    hills: 4,
    path: [[-20, 80, 20], [40, 80, 20], [95, 74, 19, 1.5], [130, 48, 18, 4], [140, 8, 18, 3], [124, -30, 17, 0], [90, -44, 17], [60, -32, 17], [34, -56, 17], [10, -90, 18, 2], [-36, -102, 18, 4.5], [-82, -86, 18, 2], [-110, -50, 18], [-114, -4, 18], [-122, 40, 18], [-102, 74, 19], [-70, 81, 20]],
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
    hills: 7,
    path: [[-30, 90, 18], [30, 92, 18], [80, 80, 17, 2], [100, 45, 16, 5], [80, 15, 16, 7], [100, -15, 16, 6], [130, -40, 16, 4], [120, -80, 17, 2], [80, -95, 17, 0], [45, -70, 16], [20, -95, 16], [-20, -110, 17], [-60, -95, 17, 2], [-70, -55, 16, 5], [-100, -30, 16, 8], [-130, 0, 17, 6], [-120, 45, 17, 3], [-90, 80, 18, 0], [-60, 90, 18]],
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
  {
    id: 'sunsetCanyon',
    theme: 'canyon',
    laps: 3,
    seed: 5203,
    hills: 9,
    path: [[-40, 90, 19, 0], [30, 92, 19, 0], [90, 80, 18, 2], [130, 45, 17, 6], [140, 0, 17, 10], [120, -40, 17, 12], [80, -60, 17, 9], [40, -40, 16, 5], [0, -60, 16, 4], [-30, -100, 17, 8], [-80, -110, 17, 11], [-125, -80, 18, 8], [-140, -30, 18, 3], [-130, 20, 18, 0], [-110, 70, 19, 0], [-80, 88, 19, 0]],
    lakes: [{ x: -40, z: 10, rx: 22, rz: 14, angle: 0.3 }],
  },
  {
    id: 'alpinePass',
    theme: 'alpine',
    laps: 3,
    seed: 6311,
    hills: 12,
    path: [[0, 100, 18, 0], [60, 102, 18, 0], [115, 90, 17, 3], [150, 55, 16, 8], [160, 10, 16, 14], [140, -35, 16, 18], [100, -60, 16, 20], [60, -50, 16, 16], [20, -70, 16, 11], [-20, -100, 17, 9], [-70, -110, 17, 10], [-120, -85, 17, 8], [-155, -40, 17, 5], [-160, 10, 17, 2], [-140, 60, 18, 0], [-95, 95, 18, 0], [-50, 102, 18, 0]],
    lakes: [{ x: -240, z: 10, rx: 30, rz: 40, angle: 0 }],
  },
  {
    id: 'cloudRidge',
    theme: 'meadow',
    laps: 3,
    seed: 7417,
    hills: 6,
    itemRows: [0.2, 0.45, 0.6, 0.85],
    path: [[-50, 95, 20, 0], [20, 98, 20, 0], [80, 92, 19, 0], [120, 70, 18, 3], [125, 30, 17, 7], [95, 5, 16, 9], [110, -25, 16, 7], [150, -50, 17, 4], [140, -95, 17, 2], [90, -110, 18, 4], [30, -95, 18, 8], [-20, -110, 18, 10], [-75, -100, 18, 7], [-120, -70, 18, 3], [-140, -20, 18, 1], [-130, 40, 19, 0], [-100, 80, 20, 0]],
    lakes: [{ x: -30, z: 0, rx: 46, rz: 30, angle: -0.2 }],
  },
  {
    id: 'duneRun',
    theme: 'canyon',
    laps: 3,
    seed: 8521,
    hills: 5,
    path: [[-70, 100, 20, 0], [0, 104, 20, 0], [65, 98, 19, 1], [110, 75, 18, 5], [130, 30, 17, 1], [115, -10, 16, 5], [140, -45, 17, 1], [120, -90, 18, 6], [70, -105, 18, 2], [20, -85, 17, 7], [-25, -105, 17, 2], [-80, -100, 18, 6], [-130, -70, 18, 1], [-155, -20, 18, 0], [-140, 35, 18, 0], [-110, 80, 19, 0]],
    lakes: [],
  },
])

export const TRACK_IDS = Object.freeze(TRACKS.map((track) => track.id))

export function getTrack(trackId) {
  return TRACKS.find((track) => track.id === trackId) ?? null
}
