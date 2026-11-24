import { BOOST_MAX_STACK, BOOSTS } from '../../config/kartTuning'

// Turbo centralisé (calcul pur) : toutes les sources (mini-turbo, départ, plus tard pads et
// objets) passent par applyBoost. État du kart : boost (s restantes), boostSpeed, boostAccel,
// boostSource. Politique de cumul : le plus fort remplace, un égal ou plus faible prolonge
// seulement la durée (plafonnée) ; les multiplicateurs ne s'additionnent jamais.
export function applyBoost(kart, sourceId, scale = 1) {
  const source = BOOSTS[sourceId]
  if (!source || scale <= 0) return false
  const duration = source.duration * scale
  if (kart.boost <= 0 || source.speed > kart.boostSpeed) {
    kart.boost = Math.max(kart.boost, duration)
    kart.boostSpeed = source.speed
    kart.boostAccel = source.accel
    kart.boostSource = sourceId
  } else {
    kart.boost = Math.min(BOOST_MAX_STACK, Math.max(kart.boost, duration, kart.boost + duration * 0.5))
  }
  return true
}

export function tickBoost(kart, dt) {
  if (kart.boost <= 0) return
  kart.boost = Math.max(0, kart.boost - dt)
  if (kart.boost === 0) clearBoost(kart)
}

export function clearBoost(kart) {
  kart.boost = 0
  kart.boostSpeed = 1
  kart.boostAccel = 1
  kart.boostSource = null
}
