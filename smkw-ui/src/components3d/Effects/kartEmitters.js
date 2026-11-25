import { Color } from 'three'
import { DRIFT } from '../../config/kartTuning'
import { PALETTE } from '../World/palette'
import { burst, count, pick, place, spec, spread } from './emitterKit'
import { emitParticle } from './particlePool'

// Émetteurs de particules d'un kart (visuels seulement, lus dans l'état de course) :
// - drift : fumée de pneus, puis étincelles aux roues arrière dès le palier bleu, orange
//   ensuite ; gerbe au déclenchement du mini-turbo ;
// - turbo : braises éjectées par le réacteur (nitro), traînée de fumée ;
// - hors-piste : mottes de terre et d'herbe arrachées ;
// - chute dans l'eau : grande gerbe ; choc : éclats blancs.
// `rate` : facteur global (mouvement réduit : moins de particules).
const TIER_COLORS = [new Color(PALETTE.white), new Color(PALETTE.blue), new Color(PALETTE.orange)]
const EMBER = [new Color('#fff3b0'), new Color(PALETTE.yellow), new Color(PALETTE.orange)]
const SMOKE = new Color('#d9dde3')
const SPLASH = [new Color('#ffffff'), new Color(PALETTE.sky)]
const REAR = -0.85
const WHEEL = 0.55
function emitDrift(kart, angle, pools, dt, rate) {
  const fx = Math.sin(angle)
  const fz = Math.cos(angle)
  for (const side of [-1, 1]) {
    for (let k = count(16 * rate, dt); k > 0; k -= 1) {
      place(kart, angle, side * WHEEL, 0.15, REAR)
      Object.assign(spec, { vx: -fx * 2 + spread(0.6), vy: 0.6 + Math.random() * 0.6, vz: -fz * 2 + spread(0.6), life: 0.7, size: 0.28, grow: 3, gravity: -0.4, drag: 2.5, color: SMOKE })
      emitParticle(pools.puff, spec)
    }
    if (kart.driftTier === 0) continue
    const color = TIER_COLORS[kart.driftTier]
    for (let k = count((kart.driftTier === 1 ? 70 : 110) * rate, dt); k > 0; k -= 1) {
      place(kart, angle, side * WHEEL, 0.1, REAR)
      const out = -kart.driftDir * (1 + Math.random() * 3)
      Object.assign(spec, { vx: -fx * 4 + Math.cos(angle) * out + spread(1), vy: 1.5 + Math.random() * 3, vz: -fz * 4 - Math.sin(angle) * out + spread(1), life: 0.18 + Math.random() * 0.2, size: kart.driftTier === 1 ? 0.05 : 0.07, grow: 1, gravity: 14, drag: 1, color })
      emitParticle(pools.glow, spec)
    }
  }
}

function emitBoost(kart, angle, pools, dt, rate) {
  const fx = Math.sin(angle)
  const fz = Math.cos(angle)
  for (let k = count(90 * rate, dt); k > 0; k -= 1) {
    place(kart, angle, spread(0.25), 0.4, REAR - 0.5)
    const v = 7 + Math.random() * 6
    Object.assign(spec, { vx: kart.vx * 0.5 - fx * v + spread(1.2), vy: spread(0.8) + 0.4, vz: kart.vz * 0.5 - fz * v + spread(1.2), life: 0.22 + Math.random() * 0.15, size: 0.09, grow: 1, gravity: 0, drag: 4, color: pick(EMBER) })
    emitParticle(pools.glow, spec)
  }
  for (let k = count(22 * rate, dt); k > 0; k -= 1) {
    place(kart, angle, spread(0.2), 0.45, REAR - 1.4)
    Object.assign(spec, { vx: spread(0.4), vy: 0.3, vz: spread(0.4), life: 0.55, size: 0.22, grow: 2.6, gravity: -0.3, drag: 2, color: SMOKE })
    emitParticle(pools.puff, spec)
  }
}

function emitOffRoad(kart, angle, pools, dt, rate, dirt) {
  if (!kart.offRoad || kart.airborne || Math.abs(kart.speed) < 6) return
  const fx = Math.sin(angle)
  const fz = Math.cos(angle)
  for (let k = count(Math.abs(kart.speed) * 1.6 * rate, dt); k > 0; k -= 1) {
    place(kart, angle, (Math.random() < 0.5 ? -1 : 1) * WHEEL, 0.12, REAR)
    Object.assign(spec, { vx: -fx * 2.5 + spread(1.5), vy: 2 + Math.random() * 2.5, vz: -fz * 2.5 + spread(1.5), life: 0.55, size: 0.1 + Math.random() * 0.06, grow: 1, gravity: 12, drag: 0.5, color: pick(dirt) })
    emitParticle(pools.chunk, spec)
  }
}

// Une frame : tous les karts. `memory` garde l'état précédent de chaque kart (événements).
export function emitKartParticles(world, pools, dt, rate, dirt, memory) {
  for (const kart of world.karts) {
    let previous = memory.get(kart.id)
    if (!previous) {
      previous = { sinking: false, hits: kart.hits, driftDir: 0, driftTier: 0 }
      memory.set(kart.id, previous)
    }
    const sinking = kart.sinking > 0
    if (sinking && !previous.sinking) burst(pools.chunk, kart, Math.round(60 * rate), SPLASH, { speed: 4, up: 7, life: 1, size: 0.22, gravity: 13, height: 0.1 })
    if (kart.hits > previous.hits) burst(pools.glow, kart, Math.round(14 * rate), TIER_COLORS, { speed: 5, up: 3, life: 0.35, size: 0.06, gravity: 10 })
    // Fin d'un drift chargé avec turbo : gerbe à la couleur du palier.
    const released = previous.driftDir && !kart.driftDir && previous.driftTier > 0 && kart.boost > 0
    if (released) burst(pools.glow, kart, Math.round(30 * rate), [TIER_COLORS[previous.driftTier]], { speed: 5, up: 3, life: 0.4, size: 0.07, gravity: 8, height: 0.2 })
    previous.sinking = sinking
    previous.hits = kart.hits
    previous.driftDir = kart.driftDir
    previous.driftTier = kart.driftTier
    if (sinking) continue
    const angle = kart.yaw - kart.driftDir * DRIFT.slipAngle
    if (kart.driftDir && !kart.airborne) emitDrift(kart, angle, pools, dt, rate)
    if (kart.boost > 0) emitBoost(kart, kart.yaw, pools, dt, rate)
    emitOffRoad(kart, angle, pools, dt, rate, dirt)
  }
}
