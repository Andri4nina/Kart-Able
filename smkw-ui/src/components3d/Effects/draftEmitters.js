import { Color } from 'three'
import { DRAFT } from '../../config/raceFeel'
import { count, place, spec, spread } from './emitterKit'
import { emitParticle } from './particlePool'

// Aspiration (game/race/kartDraft.js) : filets de vent blancs qui glissent le long du kart,
// plus denses à mesure que la jauge se remplit. Visuel seulement.
const WIND = new Color('#f4f8ff')

export function emitDraft(kart, pools, dt, rate) {
  if (!kart.drafting) return
  const fx = Math.sin(kart.yaw)
  const fz = Math.cos(kart.yaw)
  const level = Math.min(1, kart.draft / DRAFT.charge)
  for (let k = count((30 + 60 * level) * rate, dt); k > 0; k -= 1) {
    const side = (Math.random() < 0.5 ? -1 : 1) * (0.8 + Math.random() * 0.6)
    place(kart, kart.yaw, side, 0.3 + Math.random() * 1.1, 1.6 + Math.random())
    const back = 10 + Math.random() * 6
    Object.assign(spec, { vx: kart.vx - fx * back + spread(0.3), vy: spread(0.2), vz: kart.vz - fz * back + spread(0.3), life: 0.22, size: 0.05, grow: 1, gravity: 0, drag: 0, color: WIND })
    emitParticle(pools.glow, spec)
  }
}
