import { Box, CircleDot, CloudLightning, Crosshair, Droplet, Flame, Orbit, Rocket, ShieldCheck, Star } from 'lucide-react'

// Icône de chaque objet (config/items.js) dans le HUD.
export const ITEM_ICONS = Object.freeze({
  nitro: Rocket,
  tripleNitro: Rocket,
  goldNitro: Flame,
  oilSlick: Droplet,
  fakeBox: Box,
  bounceOrb: CircleDot,
  shockOrb: Orbit,
  comet: Crosshair,
  bubble: ShieldCheck,
  overdrive: Star,
  storm: CloudLightning,
})

export const ROULETTE_ORDER = Object.freeze(Object.keys(ITEM_ICONS))
