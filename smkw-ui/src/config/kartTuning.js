// Réglages de conduite arcade, centralisés : aucune valeur de gameplay dans le contrôleur
// (game/race/kartPhysics.js, kartDrift.js, kartBoost.js, kartCollisions.js ne font que lire).
// Unités : mètres, secondes, m/s, rad/s.

// Conversion des statistiques (sur 10, véhicule 60 % + archétype 40 %) en paramètres physiques :
// valeur = base + (stat - 6) * perPoint. Écarts volontairement resserrés (environ 7 % de vitesse
// de pointe entre extrêmes) : le pilotage compte plus que la fiche technique.
export const STAT_CURVES = Object.freeze({
  vehicleShare: 0.6,
  maxSpeed: { base: 28.5, perPoint: 0.55 }, // ~103 km/h pour un kart moyen
  acceleration: { base: 14, perPoint: 1.25 },
  turnRate: { base: 2.15, perPoint: 0.1 },
  grip: { base: 8, perPoint: 0.55 },
  // Drift (config/driftTuning.js) : rotation (maniabilité), adhérence latérale (statistique
  // drift : plus elle est haute, moins le kart tient, plus il glisse), inertie de la rotation
  // (poids : un kart lourd pivote plus lentement), réalignement à la sortie (maniabilité).
  driftTurn: { base: 1.65, perPoint: 0.06 },
  driftGrip: { base: 3.4, perPoint: -0.12 },
  driftResponse: { base: 9, perPoint: -0.5 },
  driftRecover: { base: 8, perPoint: 0.4 },
  driftCharge: { base: 1, perPoint: 0.06 },
  mass: { base: 1.6, perPoint: 0.14 },
  // Résistance aux chocs : part de la vitesse conservée après un impact (0..1).
  toughness: { base: 0.6, perPoint: 0.05 },
  reverseSpeed: 7,
  brake: 26,
  coast: 5,
  // Élan conservé en virage : part de la rotation du kart transmise directement à sa vitesse
  // (arcade : tourner ne freine presque pas). Le reste est rattrapé par l'adhérence.
  carry: 0.9,
  carryAir: 0.4,
  // Hors-piste : vitesse maximale réduite (sauf mécanique « hover »).
  offRoad: 0.5,
})

// Dérapage : config/driftTuning.js (réexporté ici pour les modules qui lisent DRIFT).
export { DRIFT } from './driftTuning'

// Sources de turbo. `speed` multiplie la vitesse maximale, `accel` l'accélération.
// Politique de cumul (kartBoost.js) : le turbo le plus fort l'emporte ; un turbo égal ou plus
// faible prolonge seulement la durée restante, jusqu'à `maxStack` secondes. Jamais de cumul
// des multiplicateurs.
export const BOOSTS = Object.freeze({
  // Mini-turbo (bleu) et super mini-turbo (orange, plus fort et plus long). `kick` : élan
  // ajouté aussitôt au relâchement (m/s), le turbo pousse ensuite : immédiat, sans téléportation.
  miniTurbo1: { duration: 1, speed: 1.33, accel: 4, kick: 2.5, effect: 'blue' },
  miniTurbo2: { duration: 2.2, speed: 1.4, accel: 4.5, kick: 4, effect: 'orange' },
  // Figure réussie : petit turbo à l'atterrissage.
  trick: { duration: 0.75, speed: 1.26, accel: 2.8, effect: 'blue' },
  start: { duration: 0.9, speed: 1.28, accel: 3, effect: 'orange' },
  // Nitro (objet) : longue poussée, flamme de réacteur (KartEffects).
  item: { duration: 1.5, speed: 1.36, accel: 3.4, effect: 'nitro' },
  // Pad d'accélération posé sur la route (config/tracks.js `pads`).
  pad: { duration: 0.85, speed: 1.3, accel: 3.2, effect: 'nitro' },
  // Surcharge (objet) : invincible, plus rapide, sans pénalité hors-piste.
  overdrive: { duration: 7, speed: 1.2, accel: 3, effect: 'nitro' },
  // Aspiration (config/raceFeel.js DRAFT) : sortie du sillage en trombe.
  draft: { duration: 1.3, speed: 1.24, accel: 2.6, effect: 'blue' },
})
export const BOOST_MAX_STACK = 3
export const OVER_SPEED_DRAG = 22 // m/s² pour revenir à la vitesse max (fin de turbo, hors-piste)

// Chocs. Chaque kart est une capsule (segment avant-arrière + rayon) : deux karts peuvent rouler
// côte à côte au contact, sans bulle invisible autour d'eux.
export const COLLISION = Object.freeze({
  halfLength: 0.5,
  radius: 0.62,
  bounce: 0.3,
  // Poussée latérale ajoutée selon la vitesse de rapprochement (m/s par m/s), répartie par masse.
  knockback: 0.35,
  // Choc sensible à partir de cette vitesse de rapprochement : secousse, perte de contrôle brève.
  bumpSpeed: 3,
  bumpTime: 0.35, // s de secousse
  wobbleSteer: 0.45, // braquage restant pendant la secousse (fraction)
  // Un choc plus fort que ceci (pondéré par la masse adverse) casse le drift d'un kart léger.
  driftBreak: 9,
})

// Murs (barrière invisible au bord du terrain) : rebond et perte de vitesse au-delà d'un seuil.
export const WALL = Object.freeze({
  bounce: 0.35,
  bumpSpeed: 4,
  speedLoss: 0.25, // part de la vitesse perdue sur un choc frontal (pondérée par la résistance)
})

// Voies d'eau (game/track/trackWaterways.js) : le kart flotte et glisse. Vitesse max x speed,
// adhérence latérale x grip (il dérive dans les virages) ; le hors-piste sur l'eau n'est pas
// ralenti comme l'herbe.
export const WATER = Object.freeze({ speed: 0.95, grip: 0.4 })

// Plongées (game/track/trackDives.js) : sous l'eau, le kart roule un peu moins vite (x speed) et
// flotte en l'air (gravité x gravity : sauts longs et lents).
export const UNDERWATER = Object.freeze({ speed: 0.93, gravity: 0.45 })
