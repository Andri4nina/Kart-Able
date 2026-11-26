import { Color } from 'three'
import { count, place, spec, spread } from './emitterKit'
import { emitParticle } from './particlePool'

// Fumée des pots d'échappement de chaque kart (visuel seulement) : petites bouffées grises en
// continu, plus denses à l'accélération, une bouffée plus sombre quand on remet les gaz. Rien
// pendant un turbo (les flammes et leur fumée prennent le relais) ni dans l'eau.
const PIPES = [-0.28, 0.28]
const PIPE_Y = 0.36
const PIPE_Z = -1
const LIGHT = [new Color('#d7dbe1'), new Color('#c3c8d0'), new Color('#e6e8ec')]
const DARK = new Color('#5d6068')

function puff(kart, x, color, size, kick) {
  place(kart, kart.yaw, x + spread(0.04), PIPE_Y, PIPE_Z)
  const fx = Math.sin(kart.yaw)
  const fz = Math.cos(kart.yaw)
  Object.assign(spec, {
    vx: kart.vx * 0.35 - fx * kick + spread(0.35),
    vy: 0.45 + Math.random() * 0.45,
    vz: kart.vz * 0.35 - fz * kick + spread(0.35),
    life: 0.5 + Math.random() * 0.3,
    size,
    grow: 3.4,
    gravity: -0.6,
    drag: 2.2,
    color,
  })
}

export function emitExhaust(kart, pools, dt, rate, memory) {
  const throttle = kart.controls.throttle
  const revving = throttle > 0 && !memory.throttle
  memory.throttle = throttle > 0
  if (kart.boost > 0 || kart.sinking > 0 || kart.finished) return
  for (const x of PIPES) {
    if (revving) {
      for (let k = Math.round(3 * rate); k > 0; k -= 1) {
        puff(kart, x, DARK, 0.16, 2.4)
        emitParticle(pools.puff, spec)
      }
    }
    for (let k = count((throttle > 0 ? 9 : 4) * rate, dt); k > 0; k -= 1) {
      puff(kart, x, LIGHT[k % LIGHT.length], 0.09 + throttle * 0.04, 1.2 + throttle)
      emitParticle(pools.puff, spec)
    }
  }
}
