import { Color } from 'three'
import { BOOSTS } from '../../config/kartTuning'
import { PALETTE } from '../World/palette'
import { count, pick, place, spec, spread } from './emitterKit'
import { emitParticle } from './particlePool'
import { emitTrail } from './trailPool'

// Turbo façon voiture-fusée (visuel seulement), à la couleur de sa source (BOOSTS.effect : nitro,
// mini-turbo bleu ou orange au relâchement du drift, départ, pad...) :
// - deux rubans lumineux qui flottent derrière les échappements et s'étirent sur la route
//   parcourue (pool de traînées `boost`), plus larges au début du turbo ;
// - boules de feu qui jaillissent des échappements, grossissent et s'éteignent ;
// - braises rapides et fumée.
const REAR = -1.05
const EXHAUSTS = [-0.28, 0.28]
const SEGMENT = 0.35
const palette = (core, mid, outer) => [new Color(core), new Color(mid), new Color(outer)]
const COLORS = {
  nitro: palette('#fff3c4', PALETTE.yellow, PALETTE.orange),
  orange: palette('#ffe0b0', PALETTE.orange, '#ff4d1a'),
  blue: palette('#e8f6ff', PALETTE.blue, '#1b5cff'),
  purple: palette('#fbe8ff', PALETTE.purple, '#c13bff'),
}
const SMOKE = new Color('#d9dde3')
const point = { x: 0, z: 0 }

function exhaustPoint(kart, side, out) {
  const cos = Math.cos(kart.yaw)
  const sin = Math.sin(kart.yaw)
  out.x = kart.x + side * cos + REAR * sin
  out.z = kart.z - side * sin + REAR * cos
}

function emitRibbons(kart, trails, memory, colors, power) {
  memory.boost ??= EXHAUSTS.map(() => ({ x: 0, z: 0, on: false }))
  for (let i = 0; i < EXHAUSTS.length; i += 1) {
    const last = memory.boost[i]
    exhaustPoint(kart, EXHAUSTS[i], point)
    const gap = Math.hypot(point.x - last.x, point.z - last.z)
    if (!last.on || gap > 5) {
      Object.assign(last, point, { on: true })
      continue
    }
    if (gap < SEGMENT) continue
    emitTrail(trails.boost, last.x, last.z, point.x, point.z, kart.y + 0.42, 0.05 + 0.1 * power, 0.45, colors[2])
    last.x = point.x
    last.z = point.z
  }
}

export function emitBoostFx(kart, pools, trails, dt, rate, memory) {
  const boosting = kart.boost > 0 && kart.sinking === 0
  if (!boosting) {
    if (memory.boost) for (const last of memory.boost) last.on = false
    return
  }
  const colors = COLORS[BOOSTS[kart.boostSource]?.effect] ?? COLORS.nitro
  const power = Math.min(1, kart.boost / 0.6)
  const fx = Math.sin(kart.yaw)
  const fz = Math.cos(kart.yaw)
  if (!kart.airborne || kart.gliding) emitRibbons(kart, trails, memory, colors, power)
  for (const side of EXHAUSTS) {
    for (let k = count(55 * rate, dt); k > 0; k -= 1) {
      place(kart, kart.yaw, side + spread(0.08), 0.4, REAR)
      const v = 4 + Math.random() * 4
      Object.assign(spec, { vx: kart.vx * 0.7 - fx * v + spread(0.6), vy: spread(0.5) + 0.3, vz: kart.vz * 0.7 - fz * v + spread(0.6), life: 0.18 + Math.random() * 0.12, size: 0.12, grow: 2.4, gravity: -1, drag: 3, color: pick(colors) })
      emitParticle(pools.glow, spec)
    }
  }
  for (let k = count(70 * rate, dt); k > 0; k -= 1) {
    place(kart, kart.yaw, spread(0.3), 0.4, REAR - 0.3)
    const v = 8 + Math.random() * 7
    Object.assign(spec, { vx: kart.vx * 0.5 - fx * v + spread(1.4), vy: spread(0.9) + 0.4, vz: kart.vz * 0.5 - fz * v + spread(1.4), life: 0.25 + Math.random() * 0.15, size: 0.07, grow: 1, gravity: 0, drag: 4, color: colors[0] })
    emitParticle(pools.glow, spec)
  }
  for (let k = count(18 * rate, dt); k > 0; k -= 1) {
    place(kart, kart.yaw, spread(0.2), 0.45, REAR - 1.4)
    Object.assign(spec, { vx: spread(0.4), vy: 0.3, vz: spread(0.4), life: 0.55, size: 0.22, grow: 2.6, gravity: -0.3, drag: 2, color: SMOKE })
    emitParticle(pools.puff, spec)
  }
}
