// Dérapage manuel (game/race/kartDrift.js, kartDriftMotion.js, kartDriftRates.js), d'après le
// kart arcade de référence sur console de salon (version Wii). Modèle de glisse :
// - le braquage pilote la VITESSE DE ROTATION du kart (lacet), toujours vers l'intérieur,
//   avec de l'inertie (driftResponse) : dedans = rotation forte, contre-braquage = faible ;
// - la VITESSE (vecteur) suit le nez par l'adhérence des pneus : une part `carry` de la rotation
//   tout de suite, le reste rattrapé par l'adhérence latérale (driftGrip) ; sa norme est gardée
//   (l'adhérence réoriente l'élan, elle ne le freine pas) ;
// - l'ANGLE DE GLISSE n'est pas imposé : c'est l'écart entre le nez et la vitesse. À rotation
//   constante il se stabilise vers (1 - carry) x rotation / adhérence : plus on braque dedans,
//   plus le kart est de travers ; le contre-braquage le redresse (moins de rotation, plus
//   d'adhérence). Garde-fou : jamais au-delà de maxAngle (pas de toupie).
// Tables { outside, neutral, inside } : interpolées selon le braquage relatif au drift
// (-1 contre-braquage .. 0 neutre .. 1 dedans). Par kart : STAT_CURVES (config/kartTuning.js).
export const DRIFT = Object.freeze({
  hopTime: 0.2, // petit saut d'entrée (s), purement vertical : l'élan n'est pas interrompu
  hopHeight: 0.28,
  steerThreshold: 0.2, // braquage minimal pour choisir un sens
  startSpeed: 0.15, // fraction de la vitesse max pour sauter
  minSpeed: 0.3, // ... pour lancer un drift
  cancelSpeed: 0.2, // ... sous laquelle il s'arrête
  steerResponse: 18, // lissage du braquage en drift (1/s) : anti-tremblement seulement
  // Rotation visée (x stats.driftTurn, rad/s). En régime établi, la trajectoire tourne aussi
  // vite que le kart : rayon = vitesse / rotation (plus lent = plus serré).
  turn: Object.freeze({ outside: 0.5, neutral: 1.05, inside: 1.6 }),
  // Entrée agressive : rotation visée majorée de entryKick au départ, qui retombe en entryTime s ;
  // pendant le saut, les pneus ne tiennent presque plus (hopGrip) : l'arrière décroche.
  entryKick: 0.55,
  entryTime: 0.35,
  hopGrip: 0.35,
  airTurn: 0.3, // en l'air (tremplin) : presque plus de prise
  // Adhérence latérale (x stats.driftGrip, 1/s) : un peu moindre à haute vitesse (glisse plus
  // marquée), renforcée en contre-braquage (le kart se stabilise).
  carry: 0.35,
  highSpeedGrip: 0.75, // part de l'adhérence gardée à vitesse max (1 à l'arrêt)
  counterGrip: 0.6, // adhérence en plus à plein contre-braquage
  maxAngle: 0.68, // garde-fou (~39°)
  // Perte de vitesse en glisse (m/s² à l'angle maximal, quadratique) : faible, récompense un drift propre.
  scrub: 1.6,
  // Charge (unités par seconde, x stats.driftCharge x vitesse), seulement au sol.
  charge: Object.freeze({ outside: 0.75, neutral: 1.25, inside: 2.6 }),
  botCharge: 2.4, // les pilotes ordinateur dosent en contre-braquant : charge forfaitaire
  // Paliers : bleu (mini-turbo, ~0,9 s dedans, ~1,8 s neutre), orange (super mini-turbo).
  tiers: Object.freeze([
    { charge: 2.27, boost: 'miniTurbo1' },
    { charge: 4.79, boost: 'miniTurbo2' },
  ]),
})
