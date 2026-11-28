// Circuits de la Formula Cup, coupe des grands circuits (valeurs avant mise à l'échelle : voir
// config/tracks.js, qui décrit chaque champ). Tracés inspirés de circuits automobiles célèbres,
// resserrés à l'échelle du kart : longues lignes droites, chicanes, grandes courbes rapides,
// épingles, et peu d'obstacles : la trajectoire et l'aspiration font la course. Données seulement.

export const FORMULA_TRACKS = [
  {
    // Temple de la vitesse : très longues lignes droites, trois chicanes, deux virages de Lesmo,
    // et la grande courbe parabolique avant l'arrivée.
    id: 'monzaPark',
    theme: 'forest',
    laps: 3,
    seed: 15101,
    hills: 2,
    itemRows: [0.12, 0.45, 0.78],
    pads: [[0.3, 0.5]],
    obstacles: [],
    ramps: [],
    path: [[-150, 100, 22, 0], [-40, 100, 22, 0], [60, 100, 20, 0], [88, 100, 18, 0], [115, 86, 18, 0], [142, 94, 18, 0], [175, 70, 19, 0], [195, 20, 19, 0], [197, -8, 16, 0], [180, -28, 16, 0], [192, -52, 16, 0], [180, -85, 18, 0], [150, -100, 18, 0], [120, -88, 18, 0], [95, -105, 18, 0], [20, -110, 20, 0], [-60, -108, 20, 0], [-85, -100, 18, 0], [-110, -117, 18, 0], [-137, -102, 18, 0], [-165, -80, 20, 0], [-195, -35, 20, 0], [-200, 25, 20, 0], [-185, 80, 21, 0]],
    lakes: [],
  },
  {
    // Circuit des forêts et des collines : épingle juste après le départ, plongée puis montée
    // raide, longue ligne droite en haut, enchaînement rapide, chicane avant l'arrivée.
    id: 'spaHills',
    theme: 'alpine',
    laps: 3,
    seed: 15203,
    hills: 10,
    itemRows: [0.1, 0.42, 0.75],
    pads: [[0.38, 0], [0.72, 0.5]],
    obstacles: [],
    ramps: [],
    path: [[120, 100, 22, 4], [20, 102, 22, 4], [-60, 100, 20, 4], [-115, 96, 17, 4], [-132, 72, 17, 3], [-95, 56, 18, 1], [-30, 55, 18, -2], [10, 48, 18, -4], [30, 25, 18, 0], [38, -5, 18, 5], [40, -60, 20, 8], [42, -105, 20, 9], [60, -135, 18, 9], [90, -128, 18, 8], [120, -110, 18, 6], [112, -80, 17, 4], [130, -55, 19, 3], [175, -70, 19, 3], [195, -30, 18, 4], [175, 0, 18, 4], [190, 30, 19, 5], [185, 70, 20, 5], [160, 96, 18, 5]],
    lakes: [],
  },
  {
    // Ancien aérodrome : courbes rapides enchaînées, complexe en S, épingle lente, larges
    // dégagements.
    id: 'silverField',
    theme: 'meadow',
    laps: 3,
    seed: 15307,
    hills: 1,
    itemRows: [0.1, 0.4, 0.72],
    pads: [[0.22, -0.5], [0.6, 0.5]],
    obstacles: [],
    ramps: [],
    path: [[-130, 100, 22, 0], [-30, 102, 22, 0], [60, 95, 20, 0], [120, 70, 19, 0], [150, 30, 19, 0], [140, -5, 18, 0], [150, -35, 18, 0], [135, -62, 18, 0], [150, -95, 18, 0], [110, -125, 18, 0], [60, -110, 19, 0], [0, -120, 20, 0], [-60, -105, 19, 0], [-85, -75, 17, 0], [-62, -42, 15, 0], [-108, -26, 19, 0], [-160, -50, 20, 0], [-195, -10, 20, 0], [-185, 50, 20, 0], [-160, 90, 21, 0]],
    lakes: [{ x: 20, z: 0, rx: 45, rz: 30, angle: 0.3 }],
  },
  {
    // Cuvette sud-américaine, dans le sens inverse des aiguilles : « S » descendant après le
    // départ, lacs au fond de la cuvette, longue remontée courbe vers l'arrivée.
    id: 'interlagosBowl',
    theme: 'lake',
    laps: 3,
    seed: 15409,
    hills: 7,
    itemRows: [0.1, 0.42, 0.76],
    pads: [[0.48, 0.5]],
    obstacles: [],
    ramps: [],
    path: [[-120, 100, 22, 6], [-20, 98, 22, 6], [60, 92, 20, 5], [105, 72, 18, 3], [92, 38, 18, 1], [110, 15, 18, 0], [160, 5, 19, 0], [185, -40, 19, 0], [160, -90, 18, 0], [110, -105, 18, 0], [70, -80, 17, 0], [30, -95, 18, 0], [-10, -70, 18, 0], [-50, -95, 18, 1], [-100, -110, 18, 2], [-150, -85, 19, 3], [-175, -30, 20, 4], [-170, 30, 21, 5], [-155, 80, 22, 6]],
    lakes: [{ x: 70, z: -30, rx: 30, rz: 20, angle: 0 }],
  },
]
