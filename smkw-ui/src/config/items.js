// Objets et cases à objets : unique source de vérité (données seulement). Le comportement de
// chaque objet est dans game/items/itemBehaviors.js (une entrée par objet : ajouter un objet ne
// touche pas aux autres). Textes : items.<id>.name. Icône lucide : components (itemIcons.js).
//
// - kind      : 'boost' | 'trap' | 'projectile' | 'shield'
// - charges   : utilisations par objet (triple nitro : 3)
// - rarity    : indicatif (affichage, équilibrage)
// - autres champs : réglages propres au comportement (durée, portée, vitesse...)
export const ITEMS = Object.freeze({
  nitro: { id: 'nitro', kind: 'boost', charges: 1, rarity: 'common', boost: 'item' },
  tripleNitro: { id: 'tripleNitro', kind: 'boost', charges: 3, rarity: 'rare', boost: 'item' },
  // Flaque posée derrière le kart : le premier qui roule dessus part en tête-à-queue.
  oilSlick: { id: 'oilSlick', kind: 'trap', charges: 1, rarity: 'common', lifetime: 45, radius: 1.3, dropBack: 2.6 },
  // Orbe lancé devant, qui suit la route et frappe le premier kart rencontré.
  shockOrb: { id: 'shockOrb', kind: 'projectile', charges: 1, rarity: 'uncommon', speed: 58, lifetime: 6, radius: 1.4 },
  // Bulle : absorbe le prochain coup, ou disparaît après sa durée.
  bubble: { id: 'bubble', kind: 'shield', charges: 1, rarity: 'uncommon', duration: 12 },
})

export const ITEM_IDS = Object.freeze(Object.keys(ITEMS))

// Tête-à-queue (flaque, orbe) : perte de contrôle, ralentissement.
export const SPINOUT = Object.freeze({ duration: 1.1, keepSpeed: 0.35 })

// Distribution selon la place : poids par objet pour la tête, le milieu et la fin du peloton
// (interpolés selon la place relative). Les premiers reçoivent surtout de quoi se défendre,
// les derniers de quoi revenir, sans objet qui décide seul de la course.
export const ITEM_DISTRIBUTION = Object.freeze({
  front: { oilSlick: 45, bubble: 30, nitro: 20, shockOrb: 5, tripleNitro: 0 },
  middle: { oilSlick: 25, bubble: 15, nitro: 25, shockOrb: 25, tripleNitro: 10 },
  back: { oilSlick: 5, bubble: 10, nitro: 25, shockOrb: 25, tripleNitro: 35 },
  // Case dorée : tirage généreux, quelle que soit la place.
  lucky: { oilSlick: 0, bubble: 25, nitro: 10, shockOrb: 30, tripleNitro: 35 },
})

// Cases à objets : rangées en travers de la route, aux fractions du tour indiquées (un circuit
// peut fournir les siennes : config/tracks.js `itemRows`).
// Dimensionné pour 32 karts : assez de rangées et une réapparition rapide pour que le fond du
// peloton trouve encore des cases intactes.
export const ITEM_BOXES = Object.freeze({
  rows: [0.15, 0.42, 0.68, 0.88],
  perRow: 6,
  respawn: 1.1, // s avant réapparition
  radius: 1.5, // distance de ramassage (m)
  // Tirage à suspense : durée tirée au hasard à chaque case (la roulette ralentit jusqu'au
  // résultat, voir components/ui/hud/ItemSlot.jsx).
  roulette: { min: 1.1, max: 2.3 },
  // Case dorée : à chaque réapparition, une case a cette chance de devenir dorée (tirage
  // ITEM_DISTRIBUTION.lucky, roulette plus longue).
  luckyChance: 0.12,
  luckyRoulette: 0.6, // s ajoutées au tirage d'une case dorée
})
