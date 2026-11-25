import { Color } from 'three'
import { emitParticle } from './particlePool'

// Outils partagés des émetteurs de particules : description réutilisée (aucune allocation),
// tirages au hasard, position locale d'un kart, gerbe circulaire.
export const spec = { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, life: 0, size: 0, grow: 1, gravity: 0, drag: 0, color: new Color('#ffffff') }
export const pick = (list) => list[Math.floor(Math.random() * list.length)]
export const spread = (amount) => (Math.random() - 0.5) * 2 * amount

// Point local (lx, ly, lz) du kart, orienté selon son lacet et sa glisse de drift.
export function place(kart, angle, lx, ly, lz) {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  spec.x = kart.x + lx * cos + lz * sin
  spec.y = kart.y + ly
  spec.z = kart.z - lx * sin + lz * cos
}

// Nombre de particules à émettre pour un débit (par seconde) sur `dt`, arrondi au hasard.
export const count = (perSecond, dt) => Math.floor(perSecond * dt + Math.random())

export function burst(pool, kart, amount, colors, { speed, up, life, size, gravity, height = 0.4 }) {
  for (let k = 0; k < amount; k += 1) {
    const a = Math.random() * Math.PI * 2
    const v = speed * (0.4 + Math.random() * 0.6)
    Object.assign(spec, { x: kart.x + spread(0.5), y: kart.y + height, z: kart.z + spread(0.5), vx: Math.cos(a) * v, vy: up * (0.5 + Math.random()), vz: Math.sin(a) * v, life: life * (0.6 + Math.random() * 0.4), size, grow: 1.4, gravity, drag: 1, color: pick(colors) })
    emitParticle(pool, spec)
  }
}

