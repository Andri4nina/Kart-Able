import { writeTrackPoint } from './itemPlacement'
import { hitKart } from './kartHit'

// Objets posés et projectiles en course (calcul pur). Réserves de taille fixe créées au départ
// (pooling) : aucune allocation pendant la course ; une entrée inactive a `ttl` <= 0.
const HAZARD_POOL = 48
const PROJECTILE_POOL = 24
const OWNER_GRACE = 0.6 // s pendant lesquelles un objet ignore son lanceur
const point = { x: 0, z: 0, tx: 0, tz: 0, index: 0 }

export function createItemEntities() {
  return {
    hazards: Array.from({ length: HAZARD_POOL }, () => ({ itemId: null, x: 0, z: 0, ttl: 0, age: 0, radius: 1, owner: null })),
    projectiles: Array.from({ length: PROJECTILE_POOL }, () => ({ itemId: null, x: 0, z: 0, distance: 0, lateral: 0, speed: 0, ttl: 0, age: 0, radius: 1, owner: null })),
  }
}

// Plus ancienne entrée si la réserve est pleine.
function freeSlot(pool) {
  let oldest = pool[0]
  for (const entry of pool) {
    if (entry.ttl <= 0) return entry
    if (entry.age > oldest.age) oldest = entry
  }
  return oldest
}

export function spawnHazard(world, item, x, z, owner) {
  const hazard = freeSlot(world.items.hazards)
  Object.assign(hazard, { itemId: item.id, x, z, ttl: item.lifetime, age: 0, radius: item.radius, owner: owner.id })
  return true
}

export function spawnProjectile(world, item, owner) {
  const projectile = freeSlot(world.items.projectiles)
  const distance = owner.trackDistance + 2.5
  writeTrackPoint(world.geometry.path, distance, owner.lateral, point)
  Object.assign(projectile, {
    itemId: item.id,
    x: point.x,
    z: point.z,
    distance,
    lateral: owner.lateral,
    speed: Math.max(item.speed, owner.speed + 15),
    ttl: item.lifetime,
    age: 0,
    radius: item.radius,
    owner: owner.id,
  })
  return true
}

// Premier kart touché par l'entrée (cercle de rayon `radius` + gabarit du kart).
function findVictim(world, entry) {
  const reach = entry.radius + 0.7
  for (const kart of world.karts) {
    if (kart.sinking > 0 || kart.finished) continue
    if (kart.id === entry.owner && entry.age < OWNER_GRACE) continue
    const dx = kart.x - entry.x
    const dz = kart.z - entry.z
    if (dx * dx + dz * dz < reach * reach) return kart
  }
  return null
}

export function updateItemEntities(world, dt) {
  const { path } = world.geometry
  for (const hazard of world.items.hazards) {
    if (hazard.ttl <= 0) continue
    hazard.ttl -= dt
    hazard.age += dt
    const victim = findVictim(world, hazard)
    if (victim) {
      hitKart(victim)
      hazard.ttl = 0
    }
  }
  for (const projectile of world.items.projectiles) {
    if (projectile.ttl <= 0) continue
    projectile.ttl -= dt
    projectile.age += dt
    projectile.distance += projectile.speed * dt
    // Glisse doucement vers le centre de la route en avançant.
    projectile.lateral *= Math.exp(-0.8 * dt)
    writeTrackPoint(path, projectile.distance, projectile.lateral, point)
    projectile.x = point.x
    projectile.z = point.z
    const victim = findVictim(world, projectile)
    if (victim) {
      hitKart(victim)
      projectile.ttl = 0
    }
  }
}
