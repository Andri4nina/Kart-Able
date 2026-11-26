import { FALSE_START } from '../../config/raceFeel'
import { decideBotItem } from '../items/botItems'
import { applySpinControls } from '../items/kartHit'
import { driveBot } from './botDriver'
import { applyBoost } from './kartBoost'
import { resolveStart, trackStartPress } from './startLights'

// Commandes d'un kart pour une frame : pilote ordinateur (conduite + objets), joueur
// (`readControls`), coupées pendant un tête-à-queue ; départ au compte à rebours.
const BOT_ROCKET = 0.95 // niveau à partir duquel un pilote ordinateur réussit le départ turbo

export function chooseControls(world, kart, readControls) {
  if (kart.isBot || kart.finished || kart.autopilot) {
    driveBot(kart, world.geometry, kart.controls, world.dt)
    decideBotItem(world, kart, kart.controls)
  } else readControls(kart, kart.controls)
  applySpinControls(kart, kart.controls)
  if (kart.isBot && world.raceTime < kart.reaction && kart.skill < BOT_ROCKET) kart.controls.throttle = 0
  // Compte à rebours : appui pendant le « 3 », tenu jusqu'au départ = départ turbo ; appui
  // avant le « 3 », tenu = moteur calé (faux départ). Les meilleurs pilotes ordinateur partent
  // en turbo.
  const pressed = kart.controls.throttle > 0
  if (!kart.launched && world.raceTime < 0) trackStartPress(kart, world.start, world.time, pressed, kart.throttleBefore)
  if (!kart.launched && world.raceTime >= 0) {
    const start = kart.isBot ? (kart.skill >= BOT_ROCKET ? 'boost' : null) : resolveStart(kart)
    if (start === 'boost') applyBoost(kart, 'start')
    if (start === 'stall') kart.stall = FALSE_START.stall
    kart.falseStart = start === 'stall'
    kart.launched = true
  }
  kart.throttleBefore = pressed
  if (kart.stall > 0) {
    kart.stall = Math.max(0, kart.stall - world.dt)
    kart.controls.throttle = 0
  }
}
