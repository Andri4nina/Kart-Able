// Circuits : unique source de vérité. Un circuit n'est qu'une poignée de données ; la route, le
// terrain, l'eau, la végétation et le décor en sont générés (game/track, components3d/Track).
// - path  : points de contrôle [x, z, largeur, hauteur?] en mètres, boucle fermée dans le sens
//           de course ; le premier point est la ligne de départ / arrivée (précédée d'une ligne
//           droite pour la grille de 32 karts). La hauteur (0 par défaut) crée montées et
//           descentes ; garder la grille de départ à plat et la route à 0 près de l'eau (~70 m) ;
// - hills : amplitude (m) des collines du paysage autour de la route (0 par défaut) ;
// - itemRows : fractions du tour des rangées de cases à objets (config/items.js sinon) ;
// - pads : [fraction, position latérale -1..1] : pads d'accélération (BOOSTS.pad) ;
// - obstacles : [fraction, position latérale -1..1, rayon ?] : rochers sur la route ;
// - lakes : plans d'eau elliptiques { x, z, rx, rz, angle } ; un lac à moins de 8 m du bord
//           ouvre la barrière : on peut y tomber (game/track/trackFences.js) ;
// - theme : ambiance (config/trackThemes.js) ; seed : graine du placement de la végétation.
// Dessinés pour le défi avec 32 karts : grille de départ à 20 m de large, sections techniques
// à 13-15 m, épingles en baie et chicanes (rayon 10 à 20 m : drift ou lever le pied), eau au
// bord de certains virages, rochers et pads qui imposent un choix de trajectoire ; 800 à
// 1050 m par tour, 3 tours. Contrôle : measureTrackClearance (game/track/trackGeometry.js).
// Textes : tracks.<id>.name et tracks.<id>.description.

export const TRACKS = Object.freeze([
  {
    id: 'kairosMeadow',
    theme: 'meadow',
    laps: 3,
    seed: 1201,
    hills: 4,
    itemRows: [0.1, 0.39, 0.615, 0.82],
    pads: [[0.255, -0.5], [0.505, 0.5]],
    obstacles: [[0.18, 0.55], [0.555, -0.55], [0.665, 0], [0.72, -0.35]],
    path: [[-20, 80, 20], [40, 80, 20], [95, 74, 18, 1.5], [126, 50, 15, 4], [146, 26, 14, 4], [126, 4, 14, 3], [136, -24, 15, 1], [112, -44, 15, 0], [78, -34, 14], [52, -14, 13], [30, -6, 13], [18, -24, 13], [30, -54, 14], [10, -90, 16, 2], [-36, -102, 16, 4.5], [-82, -86, 16, 2], [-110, -50, 16], [-114, -4, 15], [-122, 40, 16], [-102, 74, 18], [-70, 81, 20]],
    lakes: [{ x: -30, z: -8, rx: 44, rz: 26, angle: 0.2 }, { x: 175, z: -70, rx: 24, rz: 15, angle: -0.4 }],
  },
  {
    id: 'mirrorLake',
    theme: 'lake',
    laps: 3,
    seed: 2407,
    itemRows: [0.1, 0.36, 0.6, 0.9],
    pads: [[0.49, -0.5]],
    obstacles: [[0.18, 0.55], [0.42, -0.55], [0.67, 0], [0.725, -0.35]],
    path: [[0, 110, 20], [60, 112, 20], [120, 100, 18], [160, 60, 16], [168, 10, 15], [134, -30, 14], [160, -70, 15], [140, -110, 16], [90, -125, 16], [40, -112, 15], [16, -140, 13], [4, -168, 13], [-14, -176, 13], [-30, -158, 13], [-42, -122, 15], [-80, -128, 16], [-120, -108, 16], [-138, -60, 15], [-133, 0, 15], [-136, 60, 16], [-90, 100, 18], [-45, 110, 20]],
    lakes: [{ x: 0, z: -2, rx: 118, rz: 76, angle: 0 }],
  },
  {
    id: 'echoWoods',
    theme: 'forest',
    laps: 3,
    seed: 3313,
    hills: 7,
    itemRows: [0.1, 0.36, 0.6, 0.86],
    pads: [[0.27, -0.5]],
    obstacles: [[0.535, 0.55], [0.735, -0.55]],
    path: [[-30, 90, 18], [30, 92, 18], [80, 80, 16, 2], [100, 45, 14, 5], [80, 15, 13, 7], [100, -15, 13, 6], [130, -40, 14, 4], [120, -80, 15, 2], [80, -95, 14, 0], [45, -70, 13], [20, -95, 14], [-20, -110, 15], [-60, -95, 14, 2], [-70, -55, 13, 5], [-100, -30, 13, 8], [-130, 0, 15, 6], [-120, 45, 16, 3], [-90, 80, 17, 0], [-60, 90, 18]],
    lakes: [{ x: 42, z: -40, rx: 24, rz: 18, angle: 0 }],
  },
  {
    id: 'turquoiseCoast',
    theme: 'coast',
    laps: 3,
    seed: 4129,
    itemRows: [0.1, 0.43, 0.6, 0.82],
    pads: [[0.27, -0.5]],
    obstacles: [[0.485, 0.55], [0.65, -0.55], [0.705, 0]],
    path: [[-60, 100, 20], [10, 104, 20], [70, 100, 18], [112, 80, 16], [122, 45, 14], [98, 22, 13], [112, -2, 14], [150, -12, 15], [185, -42, 16], [176, -80, 16], [130, -96, 17], [60, -104, 17], [0, -104, 17], [-60, -104, 17], [-115, -80, 16], [-160, -46, 15], [-180, 0, 14], [-152, 30, 13], [-120, 24, 13], [-108, 56, 13], [-138, 84, 15], [-110, 104, 18]],
    lakes: [{ x: 0, z: -340, rx: 640, rz: 222, angle: 0 }, { x: 10, z: 8, rx: 52, rz: 28, angle: 0.1 }],
  },
  {
    id: 'sunsetCanyon',
    theme: 'canyon',
    laps: 3,
    seed: 5203,
    hills: 9,
    itemRows: [0.1, 0.36, 0.6, 0.86],
    pads: [[0.52, -0.5], [0.755, 0.5]],
    obstacles: [[0.18, 0.55], [0.65, -0.55]],
    path: [[-40, 90, 19, 0], [30, 92, 19, 0], [90, 80, 17, 2], [130, 45, 15, 6], [140, 0, 15, 10], [120, -40, 15, 12], [80, -60, 14, 9], [52, -42, 13, 6], [40, -14, 13, 2], [22, -4, 13, 0], [6, -18, 13, 0], [4, -52, 14, 4], [-30, -100, 15, 8], [-80, -110, 15, 11], [-125, -80, 15, 8], [-122, -44, 13, 4], [-146, -14, 13, 1], [-130, 20, 15, 0], [-110, 70, 17, 0], [-80, 88, 19, 0]],
    lakes: [{ x: 16, z: 20, rx: 22, rz: 14, angle: 0.2 }],
  },
  {
    id: 'alpinePass',
    theme: 'alpine',
    laps: 3,
    seed: 6311,
    hills: 12,
    itemRows: [0.1, 0.37, 0.645, 0.82],
    pads: [[0.29, -0.5]],
    obstacles: [[0.485, 0.55], [0.56, -0.55], [0.7, 0]],
    path: [[0, 100, 18, 0], [60, 102, 18, 0], [115, 90, 16, 3], [150, 62, 15, 7], [176, 40, 13, 9], [128, 14, 13, 11], [174, -14, 13, 14], [146, -40, 14, 17], [100, -60, 14, 20], [60, -50, 14, 16], [20, -70, 14, 11], [-20, -100, 15, 9], [-70, -110, 15, 10], [-120, -85, 15, 6], [-160, -40, 15, 2], [-164, 10, 16, 0], [-140, 60, 17, 0], [-95, 95, 18, 0], [-50, 102, 18, 0]],
    lakes: [{ x: -207, z: 0, rx: 30, rz: 44, angle: 0 }],
  },
  {
    id: 'cloudRidge',
    theme: 'meadow',
    laps: 3,
    seed: 7417,
    hills: 6,
    itemRows: [0.1, 0.46, 0.6, 0.82],
    pads: [[0.305, -0.5], [0.695, 0.5]],
    obstacles: [[0.515, 0.55], [0.745, -0.55]],
    path: [[-50, 95, 20, 0], [20, 98, 20, 0], [80, 92, 18, 0], [120, 70, 16, 3], [125, 30, 14, 7], [95, 5, 13, 9], [110, -25, 13, 7], [150, -50, 15, 4], [140, -95, 16, 2], [90, -110, 16, 4], [40, -90, 14, 4], [18, -58, 13, 2], [-2, -42, 13, 0], [-22, -56, 13, 1], [-34, -96, 15, 6], [-75, -100, 16, 7], [-120, -70, 16, 3], [-140, -20, 17, 1], [-130, 40, 18, 0], [-100, 80, 20, 0]],
    lakes: [{ x: -30, z: 0, rx: 46, rz: 30, angle: -0.2 }],
  },
  {
    id: 'duneRun',
    theme: 'canyon',
    laps: 3,
    seed: 8521,
    hills: 5,
    itemRows: [0.1, 0.36, 0.695, 0.885],
    pads: [[0.595, -0.5]],
    obstacles: [[0.18, 0.55], [0.42, -0.55]],
    path: [[-70, 100, 20, 0], [0, 104, 20, 0], [65, 98, 18, 1], [110, 75, 16, 5], [130, 30, 15, 1], [115, -10, 13, 5], [140, -45, 14, 1], [120, -90, 15, 6], [70, -105, 15, 2], [40, -80, 13, 4], [24, -50, 13, 1], [6, -42, 13, 0], [-6, -60, 13, 2], [-25, -105, 15, 6], [-80, -100, 16, 2], [-130, -70, 16, 1], [-138, -40, 14, 0], [-158, -12, 14, 0], [-140, 35, 16, 0], [-110, 80, 18, 0]],
    lakes: [{ x: 2, z: -18, rx: 16, rz: 12, angle: 0 }],
  },
])

export const TRACK_IDS = Object.freeze(TRACKS.map((track) => track.id))

export function getTrack(trackId) {
  return TRACKS.find((track) => track.id === trackId) ?? null
}
