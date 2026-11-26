import { ITEMS } from '../../config/items'

// Usage des objets par les pilotes ordinateur (calcul pur) : court délai de réflexion (selon le
// niveau), puis selon l'objet :
// - turbo, nitro d'or, surcharge : en ligne droite ; orage, bulle, comète : tout de suite ;
// - piège : tenu derrière le kart comme bouclier, posé quand un adversaire arrive derrière ;
// - projectile : tenu en bouclier, lancé quand un adversaire est devant, à portée.
// `out.item` reste enfoncé tant que l'objet est tenu ; relâché, il part.
const THINK = { min: 0.6, max: 2.4 }
const NEAR_BEHIND = 14
const SHOT_RANGE = { straight: 35, homing: 90 }
const GIVE_UP = 8 // s tenues au plus avant de s'en débarrasser

function neighbourGap(world, kart, offset) {
  const other = world.ranking[kart.position - 1 + offset]
  return other ? Math.abs(other.raceDistance - kart.raceDistance) : Infinity
}

function wantsUse(world, kart, item, out) {
  if (item.kind === 'boost' || item.kind === 'goldBoost' || item.kind === 'overdrive') return Math.abs(out.steer) < 0.25
  return true
}

function keepsHolding(world, kart, item) {
  if (kart.botItemWait < -GIVE_UP) return false
  if (item.kind === 'trap') return neighbourGap(world, kart, 1) > NEAR_BEHIND
  return neighbourGap(world, kart, -1) > (SHOT_RANGE[item.mode] ?? 40)
}

export function decideBotItem(world, kart, out) {
  const held = kart.trailing
  if (held) {
    // Objet tenu : continuer à appuyer tant qu'il sert de bouclier.
    kart.botItemWait -= world.dt
    out.item = keepsHolding(world, kart, ITEMS[held.itemId])
    return out
  }
  out.item = false
  if (!kart.item || kart.itemRoll > 0 || kart.spin > 0) {
    kart.botItemWait = -1
    return out
  }
  if (kart.botItemWait < 0) kart.botItemWait = THINK.min + world.random() * (THINK.max - THINK.min) / kart.skill
  kart.botItemWait -= world.dt
  if (kart.botItemWait > 0) return out
  // Toujours relâché entre deux usages (une charge par appui).
  out.item = !kart.itemHeld && wantsUse(world, kart, ITEMS[kart.item], out)
  if (out.item) kart.botItemWait = 0
  return out
}
