import { ITEMS } from '../../config/items'
import { applyBoost } from '../race/kartBoost'
import { spawnHazard, spawnProjectile } from './itemEntities'

// Comportement de chaque objet à son activation (registre : un objet = une entrée, ajouter un
// objet ne modifie pas les autres). `activate(world, kart, item)` : true si l'objet a servi
// (une charge est alors consommée).
export const ITEM_BEHAVIORS = Object.freeze({
  boost: {
    activate: (_world, kart, item) => applyBoost(kart, item.boost),
  },
  trap: {
    // Posé derrière le kart.
    activate: (world, kart, item) => {
      const x = kart.x - Math.sin(kart.yaw) * item.dropBack
      const z = kart.z - Math.cos(kart.yaw) * item.dropBack
      return spawnHazard(world, item, x, z, kart)
    },
  },
  projectile: {
    // Lancé devant, il suit la route depuis la position du kart.
    activate: (world, kart, item) => spawnProjectile(world, item, kart),
  },
  shield: {
    activate: (_world, kart, item) => {
      kart.shield = item.duration
      return true
    },
  },
})

export function activateItem(world, kart, itemId) {
  const item = ITEMS[itemId]
  const behavior = item ? ITEM_BEHAVIORS[item.kind] : null
  return behavior ? behavior.activate(world, kart, item) : false
}
