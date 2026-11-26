// Réglages du kart hors du sol : relief, figures, deltaplane (game/race/kartVertical.js,
// kartAir.js). Unités : mètres, secondes, m/s.

// Relief (game/race/kartVertical.js) : gravité verticale (sauts sur les crêtes), gravité le
// long de la pente (freine en montée, pousse en descente), seuil de décollage.
export const RELIEF = Object.freeze({
  gravity: 11,
  slopeGravity: 7,
  airThreshold: 0.12,
})

// Figures en l'air (game/race/kartAir.js) : appuyer sur Drift juste après avoir décollé d'une
// rampe ou d'une crête (fenêtre `window` s) fait une figure ; à l'atterrissage, petit turbo.
export const TRICK = Object.freeze({
  window: 0.45,
  minLaunch: 3.2, // vitesse verticale (m/s) minimale au décollage pour pouvoir figurer
  duration: 0.5, // durée de l'animation de la figure
})

// Deltaplane (game/race/kartAir.js) : déployé en quittant une rampe de vol ; descente lente,
// vitesse entretenue, braquage un peu plus doux. Se replie à l'atterrissage.
export const GLIDE = Object.freeze({
  gravity: 3.2, // m/s² (au lieu de RELIEF.gravity)
  sink: 3, // vitesse de descente maximale (m/s)
  speed: 0.95, // vitesse entretenue (fraction de la vitesse max)
  steer: 0.75,
})
