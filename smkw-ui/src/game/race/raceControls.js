import { START_LIGHTS } from '../../config/race'
import { decideBotItem } from '../items/botItems'
import { applySpinControls } from '../items/kartHit'
import { driveBot } from './botDriver'
import { applyBoost } from './kartBoost'
import { getStartBoost } from './startLights'

// Commandes d'un kart pour une frame : pilote ordinateur (conduite + objets), joueur
// (`readControls`), coupées pendant un tête-à-queue ; départ turbo au réflexe.
export function chooseControls(world, kart, readControls) {
  if (kart.isBot || kart.finished || kart.autopilot) {
    driveBot(kart, world.geometry.path, kart.controls)
    decideBotItem(world, kart, kart.controls)
  } else readControls(kart, kart.controls)
  applySpinControls(kart, kart.controls)
  if (kart.isBot && world.raceTime < kart.reaction) kart.controls.throttle = 0
  // Départ turbo : nouvel appui sur l'accélérateur juste après l'extinction des feux.
  const pressed = kart.controls.throttle > 0
  if (!kart.launched && world.raceTime >= 0) {
    if (getStartBoost(world.raceTime, pressed, kart.throttleBefore)) applyBoost(kart, 'start')
    kart.launched = pressed || world.raceTime > START_LIGHTS.perfectWindow
  }
  kart.throttleBefore = pressed
}
