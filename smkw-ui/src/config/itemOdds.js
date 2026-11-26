// Tirage des objets et cases à objets (données seulement ; objets : config/items.js).

// Distribution selon la place : poids par objet pour la tête, le milieu et la fin du peloton
// (interpolés selon la place relative). Comme dans la référence : la tête reçoit de quoi se
// défendre, la fin de quoi revenir (nitro d'or, surcharge, orage, comète).
export const ITEM_DISTRIBUTION = Object.freeze({
  front: { oilSlick: 30, fakeBox: 15, bounceOrb: 25, bubble: 15, nitro: 15, tripleNitro: 0, goldNitro: 0, shockOrb: 0, comet: 0, overdrive: 0, storm: 0 },
  middle: { oilSlick: 10, fakeBox: 5, bounceOrb: 15, bubble: 10, nitro: 18, tripleNitro: 10, goldNitro: 4, shockOrb: 20, comet: 2, overdrive: 3, storm: 1 },
  back: { oilSlick: 0, fakeBox: 0, bounceOrb: 2, bubble: 5, nitro: 13, tripleNitro: 20, goldNitro: 17, shockOrb: 17, comet: 5, overdrive: 10, storm: 4 },
  // Case dorée : tirage généreux, quelle que soit la place.
  lucky: { oilSlick: 0, fakeBox: 0, bounceOrb: 0, bubble: 5, nitro: 0, tripleNitro: 20, goldNitro: 22, shockOrb: 22, comet: 8, overdrive: 15, storm: 6 },
})

// Cases à objets : rangées en travers de la route, aux fractions du tour indiquées (un circuit
// peut fournir les siennes : config/tracks.js `itemRows`). Dimensionné pour 32 karts.
export const ITEM_BOXES = Object.freeze({
  rows: [0.15, 0.42, 0.68, 0.88],
  perRow: 6,
  respawn: 1.1, // s avant réapparition
  radius: 1.5, // distance de ramassage (m)
  // Roulette : durée fixe, comme la référence (le résultat tombe toujours au même rythme).
  roulette: { min: 1.6, max: 1.6 },
  // Case dorée : à chaque réapparition, une case a cette chance de devenir dorée (tirage
  // ITEM_DISTRIBUTION.lucky, roulette plus longue).
  luckyChance: 0.12,
  luckyRoulette: 0.6, // s ajoutées au tirage d'une case dorée
  // Objets rares (un seul à la fois dans la course, comme la référence) : après un tirage, plus
  // personne ne l'obtient pendant tant de secondes (il est remplacé par `fallback`).
  rare: { storm: 60, comet: 40 },
  fallback: 'tripleNitro',
})
