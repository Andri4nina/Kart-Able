// Objets : unique source de vérité (données seulement). Comportement : game/items/itemBehaviors.js
// (une entrée par `kind`) ; trajectoires : game/items/projectileMotion.js. Textes :
// items.<id>.name. Icône lucide : components/ui/hud/itemIcons.js. Tirage et cases : itemOdds.js.
// Mécaniques d'après le kart arcade de référence (version Wii), noms et visuels originaux.
//
// - kind    : 'boost' | 'goldBoost' | 'trap' | 'projectile' | 'shield' | 'overdrive' | 'storm'
// - charges : utilisations par objet (triple nitro : 3)
// - trail   : bouton maintenu = l'objet est tenu derrière le kart (il arrête un coup venu de
//             derrière) ; relâché = posé (piège) ou lancé (projectile ; en freinant : vers l'arrière)
// - mode    : trajectoire d'un projectile : 'straight' (tout droit, rebondit sur les bords),
//             'homing' (suit la route puis fond sur le kart devant), 'leader' (vise le premier)
export const ITEMS = Object.freeze({
  nitro: { id: 'nitro', kind: 'boost', charges: 1, boost: 'item' },
  tripleNitro: { id: 'tripleNitro', kind: 'boost', charges: 3, boost: 'item' },
  // Nitro d'or : turbos à volonté pendant `duration` s.
  goldNitro: { id: 'goldNitro', kind: 'goldBoost', charges: 1, boost: 'item', duration: 7.5 },
  // Flaque posée derrière le kart : le premier qui roule dessus part en tête-à-queue.
  oilSlick: { id: 'oilSlick', kind: 'trap', charges: 1, trail: true, lifetime: 45, radius: 1.3, dropBack: 2.6 },
  // Fausse case : ressemble à une case à objets (point d'interrogation à l'envers).
  fakeBox: { id: 'fakeBox', kind: 'trap', charges: 1, trail: true, lifetime: 60, radius: 1.2, dropBack: 2.6 },
  // Orbe rebondissant : file tout droit, rebondit sur les bords de la route.
  bounceOrb: { id: 'bounceOrb', kind: 'projectile', mode: 'straight', charges: 1, trail: true, speed: 50, lifetime: 9, radius: 1.1, color: '#2fd17a' },
  // Orbe de choc : suit la route et fond sur le kart juste devant.
  shockOrb: { id: 'shockOrb', kind: 'projectile', mode: 'homing', charges: 1, trail: true, speed: 58, lifetime: 7, radius: 1.3, color: '#ff4d5e' },
  // Comète : vole au-dessus de la course jusqu'au premier et explose (souffle de `blast` m).
  comet: { id: 'comet', kind: 'projectile', mode: 'leader', charges: 1, speed: 80, lifetime: 40, radius: 1.6, blast: 7, color: '#3b7bff' },
  // Bulle : absorbe le prochain coup, ou disparaît après sa durée.
  bubble: { id: 'bubble', kind: 'shield', charges: 1, duration: 12 },
  // Surcharge : invincible et plus rapide ; renverse les karts touchés.
  overdrive: { id: 'overdrive', kind: 'overdrive', charges: 1, boost: 'overdrive', duration: 7 },
  // Orage : tous les adversaires partent en tête-à-queue et rapetissent `shrink` s (plus lents,
  // écrasés par les karts de taille normale).
  storm: { id: 'storm', kind: 'storm', charges: 1, shrink: 5, spin: 0.7 },
})

export const ITEM_IDS = Object.freeze(Object.keys(ITEMS))

// Tête-à-queue (flaque, orbe) : perte de contrôle, ralentissement.
export const SPINOUT = Object.freeze({ duration: 1.1, keepSpeed: 0.35 })

// Kart réduit (orage) : vitesse de pointe et taille.
export const SHRINK = Object.freeze({ speed: 0.72, scale: 0.55, touch: 1.5 })

export { ITEM_BOXES, ITEM_DISTRIBUTION } from './itemOdds'
