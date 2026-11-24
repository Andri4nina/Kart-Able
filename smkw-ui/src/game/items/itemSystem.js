import { ITEM_BOXES } from '../../config/items'
import { activateItem } from './itemBehaviors'
import { createItemEntities, updateItemEntities } from './itemEntities'
import { placeItemBoxes } from './itemPlacement'
import { canReceiveItem, consumeCharge, giveItem, rollItem } from './itemRules'

// Gestionnaire des objets d'une course (calcul pur, un pas fixe à la fois) : cases à objets
// (ramassage, réapparition), roulette, inventaire, activation, objets posés et projectiles.
// Indépendant du rendu : la scène et le HUD lisent `world.items` et l'état des karts.

export function createItemState(geometry) {
  return { boxes: placeItemBoxes(geometry.track, geometry.path), ...createItemEntities() }
}

function updateBoxes(world, dt) {
  const reach = ITEM_BOXES.radius + 0.6
  for (const box of world.items.boxes) {
    if (!box.active) {
      box.timer -= dt
      if (box.timer <= 0) box.active = true
      continue
    }
    for (const kart of world.karts) {
      if (kart.sinking > 0 || kart.finished) continue
      const dx = kart.x - box.x
      const dz = kart.z - box.z
      if (dx * dx + dz * dz > reach * reach) continue
      box.active = false
      box.timer = ITEM_BOXES.respawn
      // Case cassée même les mains pleines ; l'objet seulement si l'emplacement est libre.
      if (canReceiveItem(kart)) {
        kart.itemRoll = ITEM_BOXES.roulette
        kart.itemPending = rollItem(kart.position, world.karts.length, world.random())
      }
      break
    }
  }
}

function updateKartItem(world, kart, dt) {
  kart.shield = Math.max(0, kart.shield - dt)
  kart.spin = Math.max(0, kart.spin - dt)
  if (kart.itemRoll > 0) {
    kart.itemRoll -= dt
    if (kart.itemRoll <= 0) {
      kart.itemRoll = 0
      giveItem(kart, kart.itemPending)
      kart.itemPending = null
    }
  }
  // Activation sur un nouvel appui (pas en tête-à-queue : les commandes sont coupées).
  const pressed = kart.controls.item && !kart.itemHeld
  kart.itemHeld = kart.controls.item
  if (pressed && kart.item && activateItem(world, kart, kart.item)) consumeCharge(kart)
}

export function updateItems(world, dt) {
  updateBoxes(world, dt)
  for (const kart of world.karts) updateKartItem(world, kart, dt)
  updateItemEntities(world, dt)
}
