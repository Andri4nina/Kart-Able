import { ITEMS } from '../../config/items'
import { applyBoost } from '../race/kartBoost'
import { holdItem, spawnProjectile } from './itemEntities'
import { strikeKart } from './kartHit'
import { launchProjectile } from './projectileMotion'

// Comportement de chaque objet à son activation (registre par `kind` : ajouter un objet ne
// modifie pas les autres). `activate(world, kart, item)` : true si une charge est consommée.
// Les objets `trail` sont d'abord tenus derrière le kart (releaseHeld les pose ou les lance).
export const ITEM_BEHAVIORS = Object.freeze({
  boost: {
    activate: (_world, kart, item) => applyBoost(kart, item.boost),
  },
  // Nitro d'or : le premier appui lance le compte à rebours ; chaque appui donne un turbo.
  // L'objet disparaît à la fin (itemSystem.js), jamais par charge.
  goldBoost: {
    activate: (_world, kart, item) => {
      if (kart.goldTime <= 0) kart.goldTime = item.duration
      applyBoost(kart, item.boost)
      return false
    },
  },
  trap: { activate: (world, kart, item) => holdItem(world, item, kart) },
  projectile: {
    activate: (world, kart, item) => {
      if (item.trail) return holdItem(world, item, kart)
      launchProjectile(world, spawnProjectile(world, item, kart), kart, false)
      return true
    },
  },
  shield: {
    activate: (_world, kart, item) => {
      kart.shield = item.duration
      return true
    },
  },
  overdrive: {
    activate: (_world, kart, item) => {
      kart.overdrive = item.duration
      kart.spin = 0
      kart.shrink = 0
      return applyBoost(kart, item.boost)
    },
  },
  storm: {
    activate: (world, kart, item) => {
      for (const other of world.karts) if (other !== kart) strikeKart(other, item)
      return true
    },
  },
})

export function activateItem(world, kart, itemId) {
  const item = ITEMS[itemId]
  const behavior = item ? ITEM_BEHAVIORS[item.kind] : null
  return behavior ? behavior.activate(world, kart, item) : false
}

// Bouton relâché : piège posé où il est, projectile lancé (vers l'arrière en freinant).
export function releaseHeld(world, kart) {
  const entry = kart.trailing
  kart.trailing = null
  if (!entry || entry.held !== kart.id) return
  if (!entry.mode) {
    entry.held = null
    entry.ttl = ITEMS[entry.itemId].lifetime
    entry.age = 0
    return
  }
  launchProjectile(world, entry, kart, kart.controls.brake > 0.5)
}
