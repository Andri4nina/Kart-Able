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
  // Adhérence latérale en drift : la trajectoire suit le kart (la glisse du corps est visuelle,
  // voir slipAngle), sans quoi un drift ferait perdre toute la vitesse.
  driftGrip: { base: 6.5, perPoint: 0.2 },
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
  carryDrift: 0.82,
  carryAir: 0.4,
  // Hors-piste : vitesse maximale réduite (sauf mécanique « hover »).
  offRoad: 0.5,
})

// Dérapage façon kart arcade : appui sur Drift = petit saut ; à l'atterrissage, la direction
// tenue fixe le sens du dérapage. Le turbo dépend de la qualité du drift (braquer vers
// l'intérieur charge plus vite, vers l'extérieur plus lentement) et de la vitesse.
export const DRIFT = Object.freeze({
  hopTime: 0.24, // durée du saut (s)
  hopHeight: 0.32, // hauteur du saut (affichage)
  entryKick: 0.12, // poussée vers l'extérieur à l'entrée du drift (fraction de la vitesse)
  steerThreshold: 0.35, // braquage minimal pour choisir un sens
  minSpeed: 0.4, // fraction de la vitesse max pour lancer / garder (cancelSpeed) un drift
  cancelSpeed: 0.28,
  // Rotation : toujours vers l'intérieur, serrée (inside) ou large (outside) selon le braquage,
  // en fraction du braquage normal à pleine vitesse (turnRate * fullSpeedTurn).
  fullSpeedTurn: 0.78,
  turnInside: 1.55,
  turnOutside: 0.6,
  turnNeutral: 1.1,
  // Qualité de charge : braquage extérieur .. neutre .. intérieur.
  chargeOutside: 0.45,
  chargeInside: 1.3,
  // Angle visuel de glisse du kart (rad), atteint progressivement.
  slipAngle: 0.6,
  slipRate: 6,
  // Paliers : charge à atteindre (s pondérées) et turbo obtenu.
  tiers: Object.freeze([
    { charge: 0.9, boost: 'miniTurbo1' },
    { charge: 1.9, boost: 'miniTurbo2' },
    { charge: 3.1, boost: 'miniTurbo3' },
  ]),
})

// Sources de turbo. `speed` multiplie la vitesse maximale, `accel` l'accélération.
// Politique de cumul (kartBoost.js) : le turbo le plus fort l'emporte ; un turbo égal ou plus
// faible prolonge seulement la durée restante, jusqu'à `maxStack` secondes. Jamais de cumul
// des multiplicateurs.
export const BOOSTS = Object.freeze({
  miniTurbo1: { duration: 0.6, speed: 1.22, accel: 2.4, effect: 'blue' },
  miniTurbo2: { duration: 1.1, speed: 1.27, accel: 2.6, effect: 'orange' },
  miniTurbo3: { duration: 1.7, speed: 1.32, accel: 2.8, effect: 'purple' },
  start: { duration: 0.9, speed: 1.28, accel: 3, effect: 'orange' },
  item: { duration: 1.3, speed: 1.35, accel: 3.2, effect: 'orange' },
})
export const BOOST_MAX_STACK = 2.4
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

// Relief (game/race/kartVertical.js) : gravité verticale (sauts sur les crêtes), gravité le
// long de la pente (freine en montée, pousse en descente), seuil de décollage.
export const RELIEF = Object.freeze({
  gravity: 11,
  slopeGravity: 7,
  airThreshold: 0.12,
})
