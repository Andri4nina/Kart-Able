import { clashItems, placeHeld } from './itemClashes'
import { hitKart } from './kartHit'
import { stepProjectile } from './projectileMotion'

// Objets posés (pièges) et projectiles en course (calcul pur). Réserves de taille fixe créées au
// départ (pooling) : aucune allocation pendant la course ; une entrée inactive a `ttl` <= 0.
// `held` : identifiant du kart qui tient l'objet derrière lui (null une fois posé ou lancé).
const HAZARD_POOL = 48
const PROJECTILE_POOL = 24
const OWNER_GRACE = 0.6 // s pendant lesquelles un objet lancé ignore son lanceur

const hazardEntry = () => ({ itemId: null, x: 0, z: 0, ttl: 0, age: 0, radius: 1, owner: null, held: null })
const projectileEntry = () => ({ itemId: null, mode: null, x: 0, y: 0, z: 0, vx: 0, vz: 0, distance: 0, race: 0, lateral: 0, speed: 0, ttl: 0, age: 0, radius: 1, owner: null, held: null, target: null, trackIndex: 0, trackDistance: 0, offRoad: false, bounces: 0 })

export function createItemEntities() {
  return {
    hazards: Array.from({ length: HAZARD_POOL }, hazardEntry),
    projectiles: Array.from({ length: PROJECTILE_POOL }, projectileEntry),
  }
}

// Plus ancienne entrée si la réserve est pleine (jamais un objet tenu).
function freeSlot(pool) {
  let oldest = null
  for (const entry of pool) {
    if (entry.ttl <= 0) return entry
    if (!entry.held && (!oldest || entry.age > oldest.age)) oldest = entry
  }
  return oldest ?? pool[0]
}

// Objet tenu derrière le kart : piège (pool `hazards`) ou projectile (pool `projectiles`).
export function holdItem(world, item, kart) {
  const pool = item.kind === 'trap' ? world.items.hazards : world.items.projectiles
  const entry = freeSlot(pool)
  Object.assign(entry, { itemId: item.id, mode: item.mode ?? null, ttl: Infinity, age: 0, radius: item.radius, owner: kart.id, held: kart.id, y: 0 })
  kart.trailing = entry
  placeHeld(entry, kart)
  return true
}

export function spawnProjectile(world, item, kart) {
  const entry = freeSlot(world.items.projectiles)
  Object.assign(entry, { itemId: item.id, mode: item.mode, ttl: item.lifetime, age: 0, radius: item.radius, owner: kart.id, held: null, y: 0, x: kart.x, z: kart.z })
  return entry
}

// Premier kart touché par l'entrée (cercle de rayon `radius` + gabarit du kart).
function findVictim(world, entry) {
  const reach = entry.radius + 0.7
  for (const kart of world.karts) {
    if (kart.sinking > 0 || kart.finished) continue
    if (kart.id === entry.owner && (entry.held || entry.age < OWNER_GRACE)) continue
    const dx = kart.x - entry.x
    const dz = kart.z - entry.z
    if (dx * dx + dz * dz < reach * reach) return kart
  }
  return null
}

function expire(world, entry) {
  entry.ttl = 0
  if (!entry.held) return
  const owner = world.kartsById.get(entry.held)
  if (owner?.trailing === entry) owner.trailing = null
  entry.held = null
}

export function updateItemEntities(world, dt) {
  const { hazards, projectiles } = world.items
  for (const entry of hazards) {
    if (entry.ttl <= 0) continue
    entry.age += dt
    if (!entry.held) entry.ttl -= dt
  }
  for (const entry of projectiles) {
    if (entry.ttl <= 0) continue
    entry.age += dt
    if (entry.held) continue
    entry.ttl -= dt
    if (!stepProjectile(world, entry, dt)) entry.ttl = 0
  }
  for (const pool of [hazards, projectiles]) {
    for (const entry of pool) {
      if (entry.ttl <= 0 || entry.mode === 'leader') continue
      if (entry.held) placeHeld(entry, world.kartsById.get(entry.held))
      const victim = findVictim(world, entry)
      if (victim) {
        hitKart(victim)
        expire(world, entry)
      }
    }
  }
  clashItems(world, expire)
}

export { expire as removeItemEntity }
