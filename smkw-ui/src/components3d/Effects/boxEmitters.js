import { Color } from 'three'
import { getGroundHeight } from '../../game/track/trackHeight'
import { PALETTE } from '../World/palette'
import { emitParticle } from './particlePool'

// Case à objets qui éclate quand un kart la prend : éclats lumineux à sa couleur (cristal ou
// case dorée). `memory` : état actif précédent de chaque case.
const CRYSTAL = [new Color(PALETTE.sky), new Color('#ffffff'), new Color('#ff8de1')]
const GOLD = [new Color(PALETTE.yellow), new Color('#fff3b0'), new Color(PALETTE.orange)]
const spec = { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, life: 0, size: 0, grow: 1, gravity: 10, drag: 1.2, color: CRYSTAL[0] }

export function emitBoxBursts(world, pools, rate, memory) {
  const { boxes } = world.items
  for (let i = 0; i < boxes.length; i += 1) {
    const box = boxes[i]
    const was = memory[i] ?? box.active
    memory[i] = box.active
    if (!was || box.active) continue
    const colors = box.lucky ? GOLD : CRYSTAL
    const y = getGroundHeight(world.geometry, box.x, box.z) + 1
    for (let k = Math.round(26 * rate); k > 0; k -= 1) {
      const a = Math.random() * Math.PI * 2
      const v = 3 + Math.random() * 4
      Object.assign(spec, { x: box.x, y, z: box.z, vx: Math.cos(a) * v, vy: 2 + Math.random() * 4, vz: Math.sin(a) * v, life: 0.45 + Math.random() * 0.35, size: 0.1, color: colors[k % colors.length] })
      emitParticle(pools.glow, spec)
    }
  }
}
