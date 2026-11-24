import { ITEMS } from '../../config/items'

// Usage des objets par les pilotes ordinateur (calcul pur) : chaque objet attend un court délai
// de réflexion (selon le niveau), puis sert quand la situation s'y prête :
// - turbo : en ligne droite (le kart regarde où il va) ;
// - piège : un adversaire est juste derrière, ou après une longue attente ;
// - projectile : un adversaire est devant, à portée ;
// - bulle : tout de suite (protection).
const THINK = { min: 0.6, max: 2.4 }
const NEAR_BEHIND = 18
const ORB_RANGE = 90

function neighbourGap(world, kart, offset) {
  const other = world.ranking[kart.position - 1 + offset]
  return other ? Math.abs(other.raceDistance - kart.raceDistance) : Infinity
}

export function decideBotItem(world, kart, out) {
  out.item = false
  if (!kart.item || kart.itemRoll > 0 || kart.spin > 0) {
    kart.botItemWait = -1
    return out
  }
  if (kart.botItemWait < 0) kart.botItemWait = THINK.min + world.random() * (THINK.max - THINK.min) / kart.skill
  kart.botItemWait -= world.dt
  if (kart.botItemWait > 0) return out
  const kind = ITEMS[kart.item]?.kind
  if (kind === 'boost') out.item = Math.abs(out.steer) < 0.25
  else if (kind === 'trap') out.item = neighbourGap(world, kart, 1) < NEAR_BEHIND || kart.botItemWait < -6
  else if (kind === 'projectile') out.item = neighbourGap(world, kart, -1) < ORB_RANGE
  else out.item = true
  // Toujours relâché entre deux usages (une charge par appui).
  if (out.item && kart.itemHeld) out.item = false
  return out
}
