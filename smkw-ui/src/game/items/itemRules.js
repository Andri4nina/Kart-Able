import { ITEM_DISTRIBUTION, ITEMS } from '../../config/items'

// Règles pures des objets : tirage selon la place, inventaire.

// Poids d'un objet pour une place relative `rank` (0 = en tête, 1 = dernier).
function weightAt(id, rank) {
  const { front, middle, back } = ITEM_DISTRIBUTION
  if (rank <= 0.5) return front[id] + (middle[id] - front[id]) * (rank / 0.5)
  return middle[id] + (back[id] - middle[id]) * ((rank - 0.5) / 0.5)
}

// Objet tiré pour un kart à la place `position` sur `total`, `roll` dans [0, 1[ ; une case
// dorée (`lucky`) tire dans ITEM_DISTRIBUTION.lucky, quelle que soit la place.
export function rollItem(position, total, roll, lucky = false) {
  const rank = total > 1 ? (position - 1) / (total - 1) : 0
  const ids = Object.keys(ITEMS)
  const weight = (id) => Math.max(0, lucky ? ITEM_DISTRIBUTION.lucky[id] ?? 0 : weightAt(id, rank))
  let sum = 0
  for (const id of ids) sum += weight(id)
  let target = roll * sum
  for (const id of ids) {
    target -= weight(id)
    if (target < 0) return id
  }
  return ids[0]
}

// Champs « objets » d'un kart (game/race/raceKart.js) : objet en main et charges, tirage en
// cours (durée, case dorée, résultat), bouton tenu, objet tenu derrière le kart (entité, ou
// null), bulle, tête-à-queue, surcharge, rétrécissement, nitro d'or (s restantes).
export function createItemFields() {
  return {
    item: null,
    itemCharges: 0,
    itemRoll: 0,
    itemRollTotal: 0,
    itemLucky: false,
    itemPending: null,
    itemHeld: false,
    trailing: null,
    shield: 0,
    spin: 0,
    overdrive: 0,
    shrink: 0,
    goldTime: 0,
  }
}

// Le kart peut-il prendre un objet ? (rien en main ni tenu derrière, aucun tirage en cours)
export function canReceiveItem(kart) {
  return !kart.item && !kart.trailing && kart.itemRoll <= 0
}

export function giveItem(kart, itemId) {
  kart.item = itemId
  kart.itemCharges = ITEMS[itemId]?.charges ?? 1
}

// Consomme une charge ; l'objet disparaît à la dernière.
export function consumeCharge(kart) {
  kart.itemCharges -= 1
  if (kart.itemCharges <= 0) clearItem(kart)
}

export function clearItem(kart) {
  kart.item = null
  kart.itemCharges = 0
  kart.itemLucky = false
  kart.goldTime = 0
}
