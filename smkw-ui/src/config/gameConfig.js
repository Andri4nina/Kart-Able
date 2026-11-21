// Constantes partagées par l'UI et la scène 3D. Aucune logique, aucun texte affiché
// (les libellés passent par src/locales).

export const BRAND = Object.freeze({
  name: 'Kart Able',
  version: 'v0.3.0',
})

// Le pixel ratio est le principal levier de coût GPU : on le plafonne par preset.
export const QUALITY_PRESETS = Object.freeze({
  low: { dpr: [1, 1] },
  medium: { dpr: [1, 1.5] },
  high: { dpr: [1, 2] },
})

export const QUALITY_LEVELS = Object.freeze(Object.keys(QUALITY_PRESETS))

export const MOTION_MODES = Object.freeze(['system', 'reduced', 'full'])

export const FOV = Object.freeze({ min: 55, max: 85, default: 65 })

// Valeurs fictives du HUD dans les modes d'arène (pas encore jouables) ; en course, le HUD
// affiche les vraies valeurs (game/race). La position affichée est l'ordre de la partie.
export const DEMO_HUD = Object.freeze({
  lap: 1,
  laps: 3,
})

// Limite le delta d'une frame (onglet en arrière-plan, pic de charge).
export const MAX_FRAME_DELTA = 0.1

// Hooks de test (window.advanceTime, window.render_game_to_text) : en dev, ou avec ?test en prod.
export const TEST_HOOKS_ENABLED =
  import.meta.env.DEV || new URLSearchParams(window.location.search).has('test')
