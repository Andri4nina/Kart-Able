import { SPINOUT } from '../../config/items'
import { clearBoost } from '../race/kartBoost'
import { cancelDrift } from '../race/kartDrift'

// Un objet touche un kart (calcul pur). En surcharge : rien. La bulle absorbe le coup ; sinon
// tête-à-queue (perte de contrôle pendant `duration`, vitesse fortement réduite, drift et turbo
// perdus). Renvoie true si le kart part en tête-à-queue.
export function hitKart(kart, duration = SPINOUT.duration) {
  if (kart.overdrive > 0 || kart.sinking > 0) return false
  if (kart.shield > 0) {
    kart.shield = 0
    kart.bump = Math.max(kart.bump, 0.2)
    return false
  }
  if (kart.spin > 0) return false
  kart.spin = duration
  kart.vx *= SPINOUT.keepSpeed
  kart.vz *= SPINOUT.keepSpeed
  kart.hits += 1
  cancelDrift(kart)
  clearBoost(kart)
  return true
}

// Orage : tête-à-queue court, puis kart réduit pendant `shrink` s. La surcharge protège ; la
// bulle n'arrête pas l'orage (elle éclate).
export function strikeKart(kart, item) {
  if (kart.overdrive > 0 || kart.sinking > 0 || kart.finished) return false
  kart.shield = 0
  kart.spin = 0
  hitKart(kart, item.spin)
  kart.shrink = item.shrink
  return true
}

// Pendant un tête-à-queue : aucune commande ne répond.
export function applySpinControls(kart, controls) {
  if (kart.spin <= 0) return
  controls.throttle = 0
  controls.brake = 0
  controls.steer = 0
  controls.drift = false
  controls.item = false
}
