import { ITEM_BOXES } from '../../config/items'
import { activateItem, releaseHeld } from './itemBehaviors'
import { updateKartContacts } from './itemContacts'
import { createItemEntities, removeItemEntity, updateItemEntities } from './itemEntities'
import { placeItemBoxes } from './itemPlacement'
import { canReceiveItem, clearItem, consumeCharge, giveItem, rollItem } from './itemRules'

// Gestionnaire des objets d'une course (calcul pur, un pas fixe à la fois) : cases à objets
// (ramassage, réapparition, cases dorées au hasard), roulette à durée aléatoire, inventaire, activation, objets posés et projectiles.
// Indépendant du rendu : la scène et le HUD lisent `world.items` et l'état des karts.

export function createItemState(geometry, random) {
  const boxes = placeItemBoxes(geometry.track, geometry.path, geometry.island)
  for (const box of boxes) box.lucky = random() < ITEM_BOXES.luckyChance
  return { boxes, rareUntil: {}, ...createItemEntities() }
}

// Tirage à suspense : durée au hasard (plus longue pour une case dorée).
function startRoll(world, kart, lucky) {
  const { min, max } = ITEM_BOXES.roulette
  kart.itemRoll = min + world.random() * (max - min) + (lucky ? ITEM_BOXES.luckyRoulette : 0)
  kart.itemRollTotal = kart.itemRoll
  kart.itemLucky = lucky
  const item = rollItem(kart.position, world.karts.length, world.random(), lucky)
  const rareWait = ITEM_BOXES.rare[item]
  const blocked = rareWait && world.time < (world.items.rareUntil[item] ?? 0)
  if (rareWait && !blocked) world.items.rareUntil[item] = world.time + rareWait
  kart.itemPending = blocked ? ITEM_BOXES.fallback : item
}

function updateBoxes(world, dt) {
  const reach = ITEM_BOXES.radius + 0.6
  for (const box of world.items.boxes) {
    if (!box.active) {
      box.timer -= dt
      if (box.timer <= 0) {
        box.active = true
        box.lucky = world.random() < ITEM_BOXES.luckyChance
      }
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
      if (canReceiveItem(kart)) startRoll(world, kart, box.lucky)
      break
    }
  }
}

function updateTimers(kart, dt) {
  kart.shield = Math.max(0, kart.shield - dt)
  kart.spin = Math.max(0, kart.spin - dt)
  kart.overdrive = Math.max(0, kart.overdrive - dt)
  kart.shrink = Math.max(0, kart.shrink - dt)
  if (kart.goldTime > 0) {
    kart.goldTime -= dt
    if (kart.goldTime <= 0) clearItem(kart)
  }
}

function updateKartItem(world, kart, dt) {
  updateTimers(kart, dt)
  if (kart.itemRoll > 0) {
    kart.itemRoll -= dt
    if (kart.itemRoll <= 0) {
      kart.itemRoll = 0
      giveItem(kart, kart.itemPending)
      kart.itemPending = null
    }
  }
  // Activation sur un nouvel appui ; un objet tenu derrière le kart part au relâchement (en
  // tête-à-queue ou dans l'eau, il est perdu).
  const pressed = kart.controls.item && !kart.itemHeld
  const released = !kart.controls.item && kart.itemHeld
  kart.itemHeld = kart.controls.item
  if (kart.trailing && (kart.spin > 0 || kart.sinking > 0)) removeItemEntity(world, kart.trailing)
  else if (kart.trailing && released) releaseHeld(world, kart)
  else if (pressed && kart.item && activateItem(world, kart, kart.item)) consumeCharge(kart)
}

export function updateItems(world, dt) {
  updateBoxes(world, dt)
  for (const kart of world.karts) updateKartItem(world, kart, dt)
  updateItemEntities(world, dt)
  updateKartContacts(world)
}
