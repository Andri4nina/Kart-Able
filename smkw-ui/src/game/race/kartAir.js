import { GLIDE, TRICK } from '../../config/airTuning'
import { applyBoost } from './kartBoost'

// Vol d'un kart (calcul pur, aucune allocation) : décollage d'une rampe ou d'une crête,
// figure, deltaplane, atterrissage. Règles : TRICK et GLIDE (config/kartTuning.js).
// - Décollage assez franc (vitesse verticale >= TRICK.minLaunch) : fenêtre de figure ouverte ;
//   appuyer sur Drift dedans lance une figure (kartDrift.js), récompensée à l'atterrissage.
// - Quitter une rampe de vol déploie le deltaplane : descente lente, vitesse entretenue.

export function takeOff(kart, fromGlideRamp) {
  if (kart.vy >= TRICK.minLaunch) kart.trickWindow = TRICK.window
  if (fromGlideRamp) kart.gliding = true
}

export function startTrick(kart) {
  kart.trick = TRICK.duration
  kart.trickPending = true
  kart.trickWindow = 0
  kart.trickStyle = (kart.trickStyle + 1) % 3
}

export function land(kart) {
  if (kart.trickPending) applyBoost(kart, 'trick')
  kart.trickPending = false
  kart.trickWindow = 0
  kart.gliding = false
}

// Une étape en l'air : minuteries, gravité (douce sous le deltaplane), vitesse entretenue.
export function stepAir(kart, gravity, dt) {
  kart.trickWindow = Math.max(0, kart.trickWindow - dt)
  kart.trick = Math.max(0, kart.trick - dt)
  if (!kart.gliding) {
    kart.vy -= gravity * dt
    return
  }
  kart.vy = Math.max(-GLIDE.sink, kart.vy - GLIDE.gravity * dt)
  const target = kart.stats.maxSpeed * GLIDE.speed
  const speed = Math.hypot(kart.vx, kart.vz)
  if (speed > 0.1 && speed < target) {
    kart.vx *= target / speed
    kart.vz *= target / speed
    kart.speed = Math.max(kart.speed, target)
  }
}

// Remise à zéro (réapparition, nouvelle course).
export function resetAir(kart) {
  kart.gliding = false
  kart.trick = 0
  kart.trickWindow = 0
  kart.trickPending = false
}
