import { Gamepad2, Gauge, Hand, Keyboard, Shield, Sparkles, Unplug, Zap } from 'lucide-react'

// Présentation des joueurs, périphériques et archétypes (classes Tailwind complètes
// pour être détectées au build). Les données restent dans config/.

const PLAYER_COLORS = [
  { bg: 'bg-player-1', text: 'text-player-1', border: 'border-player-1', ring: 'ring-player-1', fill: 'fill-player-1' },
  { bg: 'bg-player-2', text: 'text-player-2', border: 'border-player-2', ring: 'ring-player-2', fill: 'fill-player-2' },
  { bg: 'bg-player-3', text: 'text-player-3', border: 'border-player-3', ring: 'ring-player-3', fill: 'fill-player-3' },
  { bg: 'bg-player-4', text: 'text-player-4', border: 'border-player-4', ring: 'ring-player-4', fill: 'fill-player-4' },
  { bg: 'bg-player-5', text: 'text-player-5', border: 'border-player-5', ring: 'ring-player-5', fill: 'fill-player-5' },
  { bg: 'bg-player-6', text: 'text-player-6', border: 'border-player-6', ring: 'ring-player-6', fill: 'fill-player-6' },
  { bg: 'bg-player-7', text: 'text-player-7', border: 'border-player-7', ring: 'ring-player-7', fill: 'fill-player-7' },
  { bg: 'bg-player-8', text: 'text-player-8', border: 'border-player-8', ring: 'ring-player-8', fill: 'fill-player-8' },
]

export function getPlayerColors(index) {
  return PLAYER_COLORS[index % PLAYER_COLORS.length]
}

const DEVICE_VISUALS = {
  keyboard: { icon: Keyboard },
  gamepad: { icon: Gamepad2 },
  pointer: { icon: Hand },
  disconnected: { icon: Unplug },
}

// `disconnected` : périphérique connu mais débranché.
export function getDeviceVisual(kind) {
  return DEVICE_VISUALS[kind] ?? DEVICE_VISUALS.gamepad
}

const CLASS_VISUALS = {
  tank: { icon: Shield, bg: 'bg-class-tank', text: 'text-class-tank', border: 'border-class-tank' },
  standard: { icon: Gauge, bg: 'bg-class-standard', text: 'text-class-standard', border: 'border-class-standard' },
  speed: { icon: Zap, bg: 'bg-class-speed', text: 'text-class-speed', border: 'border-class-speed' },
  special: { icon: Sparkles, bg: 'bg-class-special', text: 'text-class-special', border: 'border-class-special' },
}

export function getClassVisual(classId) {
  return CLASS_VISUALS[classId] ?? CLASS_VISUALS.standard
}

// Fond à la couleur d'identité de chaque personnage (tokens char-* de index.css).
const CHARACTER_BACKGROUNDS = {
  diesel: 'bg-char-diesel',
  marlo: 'bg-char-marlo',
  timo: 'bg-char-timo',
  pyrox: 'bg-char-pyrox',
  osso: 'bg-char-osso',
  rubis: 'bg-char-rubis',
  mitsu: 'bg-char-mitsu',
  volt: 'bg-char-volt',
  gibus: 'bg-char-gibus',
  tempo: 'bg-char-tempo',
  frisko: 'bg-char-frisko',
  kosmo: 'bg-char-kosmo',
  nox: 'bg-char-nox',
  zenji: 'bg-char-zenji',
  pompon: 'bg-char-pompon',
  miella: 'bg-char-miella',
  nino: 'bg-char-nino',
  blizzo: 'bg-char-blizzo',
}

export function getCharacterBackground(characterId) {
  return CHARACTER_BACKGROUNDS[characterId] ?? 'bg-white/10'
}
