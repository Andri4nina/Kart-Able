// Réserve de particules (calcul pur, tableaux typés, aucune allocation après création) :
// anneau de `capacity` particules, la plus ancienne est réutilisée quand la réserve est pleine.
// Chaque particule : position, vitesse, durée de vie, taille (début -> fin), gravité, couleur.
export function createParticlePool(capacity) {
  const floats = () => new Float32Array(capacity)
  return {
    capacity,
    next: 0,
    x: floats(), y: floats(), z: floats(),
    vx: floats(), vy: floats(), vz: floats(),
    age: floats(), life: floats(),
    size: floats(), grow: floats(), gravity: floats(), drag: floats(),
    r: floats(), g: floats(), b: floats(),
    // 1 : particule éteinte déjà cachée dans le rendu (writeParticles.js).
    hidden: new Uint8Array(capacity),
  }
}

// `spec` : { x, y, z, vx, vy, vz, life, size, grow, gravity, drag, color } (objet réutilisé
// par l'appelant ; `grow` : taille finale / taille initiale).
export function emitParticle(pool, spec) {
  const i = pool.next
  pool.next = (i + 1) % pool.capacity
  pool.x[i] = spec.x
  pool.y[i] = spec.y
  pool.z[i] = spec.z
  pool.vx[i] = spec.vx
  pool.vy[i] = spec.vy
  pool.vz[i] = spec.vz
  pool.age[i] = 0
  pool.life[i] = spec.life
  pool.size[i] = spec.size
  pool.grow[i] = spec.grow ?? 1
  pool.gravity[i] = spec.gravity ?? 0
  pool.drag[i] = spec.drag ?? 0
  pool.r[i] = spec.color.r
  pool.g[i] = spec.color.g
  pool.b[i] = spec.color.b
}

export function updateParticlePool(pool, dt) {
  for (let i = 0; i < pool.capacity; i += 1) {
    if (pool.age[i] >= pool.life[i]) continue
    pool.age[i] += dt
    const damping = Math.exp(-pool.drag[i] * dt)
    pool.vx[i] *= damping
    pool.vz[i] *= damping
    pool.vy[i] = pool.vy[i] * damping - pool.gravity[i] * dt
    pool.x[i] += pool.vx[i] * dt
    pool.y[i] += pool.vy[i] * dt
    pool.z[i] += pool.vz[i] * dt
  }
}

export function clearParticlePool(pool) {
  pool.age.fill(0)
  pool.life.fill(0)
}
