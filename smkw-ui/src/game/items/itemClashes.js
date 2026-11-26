// Objets entre eux (calcul pur) : un objet tenu suit son kart ; deux objets qui se touchent
// (projectile contre piège, projectile contre projectile) se détruisent, comme dans la
// référence : un objet tenu derrière soi arrête ainsi un tir venu de derrière.
const HELD_BACK = { hazard: 1.3, projectile: 1.25 }

export function placeHeld(entry, kart) {
  if (!kart) return
  const back = entry.mode ? HELD_BACK.projectile : HELD_BACK.hazard
  entry.x = kart.x - Math.sin(kart.yaw) * back
  entry.z = kart.z - Math.cos(kart.yaw) * back
}

const touching = (a, b) => (a.x - b.x) ** 2 + (a.z - b.z) ** 2 < (a.radius + b.radius) ** 2

export function clashItems(world, expire) {
  const { hazards, projectiles } = world.items
  for (let i = 0; i < projectiles.length; i += 1) {
    const shot = projectiles[i]
    if (shot.ttl <= 0 || shot.mode === 'leader') continue
    for (const trap of hazards) {
      if (trap.ttl > 0 && touching(shot, trap) && !(shot.held && shot.held === trap.held)) {
        expire(world, trap)
        expire(world, shot)
        break
      }
    }
    if (shot.ttl <= 0) continue
    for (let j = i + 1; j < projectiles.length; j += 1) {
      const other = projectiles[j]
      if (other.ttl > 0 && other.mode !== 'leader' && touching(shot, other)) {
        expire(world, other)
        expire(world, shot)
        break
      }
    }
  }
}
