import { Color } from 'three'
import { PALETTE } from '../World/palette'
import { emitTrail } from './trailPool'

// Traînées du drift (visuel seulement) : marques de gomme laissées par les deux roues arrière
// sur l'asphalte (elles s'effacent en quelques secondes) et, dès le palier bleu, une traînée
// lumineuse à la couleur du palier derrière chaque roue. Un segment tous les SEGMENT mètres
// parcourus, relié au précédent (ruban continu). `memory` : dernier point de chaque roue.
const SEGMENT = 0.55
const REAR = -0.85
const WHEEL = 0.55
const SKID = new Color('#16161a')
export const TIER_COLORS = [new Color(PALETTE.white), new Color(PALETTE.blue), new Color(PALETTE.orange), new Color(PALETTE.purple)]

function wheelPoint(kart, angle, side, out) {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  out.x = kart.x + side * WHEEL * cos + REAR * sin
  out.z = kart.z - side * WHEEL * sin + REAR * cos
}

const point = { x: 0, z: 0 }

export function emitKartTrails(kart, pools, memory) {
  const marking = kart.driftDir !== 0 && kart.hop === 0 && !kart.airborne && kart.sinking === 0
  memory.trail ??= [{ x: 0, z: 0, on: false }, { x: 0, z: 0, on: false }]
  const angle = kart.yaw
  for (let w = 0; w < 2; w += 1) {
    const last = memory.trail[w]
    if (!marking) {
      last.on = false
      continue
    }
    wheelPoint(kart, angle, w === 0 ? -1 : 1, point)
    const gap = Math.hypot(point.x - last.x, point.z - last.z)
    if (!last.on || gap > 4) {
      Object.assign(last, point, { on: true })
      continue
    }
    if (gap < SEGMENT) continue
    if (!kart.offRoad) emitTrail(pools.skid, last.x, last.z, point.x, point.z, kart.y + 0.045, 0.26, 3.2, SKID)
    if (kart.driftTier > 0) emitTrail(pools.streak, last.x, last.z, point.x, point.z, kart.y + 0.07, 0.1 + kart.driftTier * 0.03, 0.32, TIER_COLORS[kart.driftTier])
    last.x = point.x
    last.z = point.z
  }
}
