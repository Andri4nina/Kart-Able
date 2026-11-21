// Courbes d'animation du preview (fonctions pures du temps écoulé, en secondes).
// Calculées depuis l'horloge R3F : déterministes sous window.advanceTime.

const SWAP_DURATION = 0.42
const HOP_DURATION = 0.4

const easeOutCubic = (k) => 1 - (1 - k) ** 3

// Changement d'élément : le modèle surgit (0,55 -> 1,08 -> 1) en faisant un tour.
export function swapPose(elapsed) {
  if (elapsed >= SWAP_DURATION) return { scale: 1, spin: 0 }
  const k = elapsed / SWAP_DURATION
  const scale = k < 0.6 ? 0.55 + (1.08 - 0.55) * easeOutCubic(k / 0.6) : 1.08 - 0.08 * easeOutCubic((k - 0.6) / 0.4)
  return { scale, spin: -Math.PI * 2 * (1 - easeOutCubic(k)) }
}

// Confirmation : petit saut.
export function hopHeight(elapsed) {
  if (elapsed >= HOP_DURATION) return 0
  return Math.sin((elapsed / HOP_DURATION) * Math.PI) * 0.45
}

// Attente d'un personnage : léger balancement et respiration.
export function swayYaw(time, phase) {
  return Math.sin(time * 0.8 + phase) * 0.35
}

export function breathe(time, phase) {
  return Math.sin(time * 2.2 + phase) * 0.03
}

// Attente d'un véhicule : rotation lente sur son socle.
export function turntableYaw(time) {
  return time * 0.6
}
