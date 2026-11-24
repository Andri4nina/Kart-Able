import { SPINOUT } from '../../config/items'
import { clearBoost } from '../race/kartBoost'
import { cancelDrift } from '../race/kartDrift'

// Un objet touche un kart (calcul pur) : la bulle absorbe le coup ; sinon tête-à-queue
// (perte de contrôle pendant SPINOUT.duration, vitesse fortement réduite, drift et turbo perdus).
// Renvoie true si le kart part en tête-à-queue.
export function hitKart(kart) {
  if (kart.shield > 0) {
    kart.shield = 0
    kart.bump = Math.max(kart.bump, 0.2)
    return false
  }
  if (kart.spin > 0) return false
  kart.spin = SPINOUT.duration
  kart.vx *= SPINOUT.keepSpeed
  kart.vz *= SPINOUT.keepSpeed
  kart.hits += 1
  cancelDrift(kart)
  clearBoost(kart)
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
