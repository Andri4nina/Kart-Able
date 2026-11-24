import { Droplet, Orbit, Rocket, ShieldCheck } from 'lucide-react'

// Icône de chaque objet (config/items.js) dans le HUD.
export const ITEM_ICONS = Object.freeze({
  nitro: Rocket,
  tripleNitro: Rocket,
  oilSlick: Droplet,
  shockOrb: Orbit,
  bubble: ShieldCheck,
})

export const ROULETTE_ORDER = Object.freeze(Object.keys(ITEM_ICONS))
