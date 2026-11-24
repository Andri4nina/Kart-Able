import { ITEM_DISTRIBUTION, ITEMS } from '../../config/items'

// Règles pures des objets : tirage selon la place, inventaire.

// Poids d'un objet pour une place relative `rank` (0 = en tête, 1 = dernier).
function weightAt(id, rank) {
  const { front, middle, back } = ITEM_DISTRIBUTION
  if (rank <= 0.5) return front[id] + (middle[id] - front[id]) * (rank / 0.5)
  return middle[id] + (back[id] - middle[id]) * ((rank - 0.5) / 0.5)
}

// Objet tiré pour un kart à la place `position` sur `total`, `roll` dans [0, 1[.
export function rollItem(position, total, roll) {
  const rank = total > 1 ? (position - 1) / (total - 1) : 0
  const ids = Object.keys(ITEMS)
  let sum = 0
  for (const id of ids) sum += Math.max(0, weightAt(id, rank))
  let target = roll * sum
  for (const id of ids) {
    target -= Math.max(0, weightAt(id, rank))
    if (target < 0) return id
  }
  return ids[0]
}

// Le kart peut-il prendre un objet ? (rien en main, aucun tirage en cours)
export function canReceiveItem(kart) {
  return !kart.item && kart.itemRoll <= 0
}

export function giveItem(kart, itemId) {
  kart.item = itemId
  kart.itemCharges = ITEMS[itemId]?.charges ?? 1
}

// Consomme une charge ; l'objet disparaît à la dernière.
export function consumeCharge(kart) {
  kart.itemCharges -= 1
  if (kart.itemCharges <= 0) {
    kart.item = null
    kart.itemCharges = 0
  }
}
