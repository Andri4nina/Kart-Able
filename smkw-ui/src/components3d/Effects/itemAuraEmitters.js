import { Color } from 'three'
import { burst, count, pick, place, spec, spread } from './emitterKit'
import { emitParticle } from './particlePool'

// Effets des objets sur un kart (visuels seulement) : surcharge = étincelles arc-en-ciel autour
// du kart ; orage = éclair blanc et jaune à l'instant où le kart rapetisse.
const RAINBOW = ['#ff4d5e', '#ffb02e', '#ffe94a', '#3ddc84', '#3aa0ff', '#c45cff'].map((hex) => new Color(hex))
const BOLT = [new Color('#ffffff'), new Color('#ffe94a')]

export function emitItemAura(kart, pools, dt, rate, previous) {
  if (kart.shrink > 0 && !(previous.shrink > 0)) burst(pools.glow, kart, Math.round(40 * rate), BOLT, { speed: 3, up: 9, life: 0.45, size: 0.09, gravity: 4, height: 1.2 })
  previous.shrink = kart.shrink
  if (kart.overdrive <= 0) return
  for (let k = count(120 * rate, dt); k > 0; k -= 1) {
    place(kart, kart.yaw, spread(0.9), 0.2 + Math.random() * 1.2, spread(1.3))
    Object.assign(spec, { vx: kart.vx * 0.6 + spread(1.5), vy: 1 + Math.random() * 2, vz: kart.vz * 0.6 + spread(1.5), life: 0.35, size: 0.08, grow: 1, gravity: 0, drag: 2, color: pick(RAINBOW) })
    emitParticle(pools.glow, spec)
  }
}
