import { Mountain, Route, Snowflake, Split, Sprout, Tornado, Trophy, Waves } from 'lucide-react'

// Emblème de chaque coupe : symbole (lucide) et couleur (tokens --color-cup-* de index.css).
// Classes écrites en entier pour que Tailwind les trouve. Coupe inconnue : trophée, rouge.
const EMBLEMS = Object.freeze({
  kairos: { icon: Sprout, fill: 'text-cup-kairos' },
  summit: { icon: Mountain, fill: 'text-cup-summit' },
  frostbloom: { icon: Snowflake, fill: 'text-cup-frostbloom' },
  dustrail: { icon: Tornado, fill: 'text-cup-dustrail' },
  pax: { icon: Route, fill: 'text-cup-pax' },
  duet: { icon: Split, fill: 'text-cup-duet' },
  water: { icon: Waves, fill: 'text-cup-water' },
})
const FALLBACK = { icon: Trophy, fill: 'text-brand-red' }

export const getCupEmblem = (cupId) => EMBLEMS[cupId] ?? FALLBACK
