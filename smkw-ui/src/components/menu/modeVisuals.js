import { Flag, Gamepad2, Rocket, Swords, Timer } from 'lucide-react'

// Présentation des modes (icône + accent). Les données restent dans config/gameModes.js.
// Classes Tailwind écrites en entier pour être détectées au build.
const MODE_VISUALS = {
  race: { icon: Flag, accent: 'bg-brand-red text-white' },
  timeTrial: { icon: Timer, accent: 'bg-brand-yellow text-brand-ink' },
  battle: { icon: Swords, accent: 'bg-brand-orange text-brand-ink' },
  rocketGol: { icon: Rocket, accent: 'bg-brand-blue text-white' },
}

const FALLBACK_VISUAL = { icon: Gamepad2, accent: 'bg-white text-brand-ink' }

export function getModeVisual(modeId) {
  return MODE_VISUALS[modeId] ?? FALLBACK_VISUAL
}
