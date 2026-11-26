import { RACE } from '../../config/race'
import { distanceToLakeEdge } from './lakes'

// Limites de chaque côté de la route (calcul pur, une fois par circuit), en mètres depuis le
// bord, par échantillon. Côté droit (+1) = (-tz, tx), comme kart.lateral.
// - En général : clôture basse à RACE.fence m (hors-piste praticable, mais lent) ;
// - près d'un lac (bord de l'eau à moins de `waterFence.reach` m) : ouverte jusque dans l'eau,
//   on peut y tomber ;
// - là où une autre portion de la route passe tout près (raccourci possible) : muret au ras de
//   la route (RACE.shortcut). `walls.left / right` : 1 sur ces échantillons (rendu du muret).
const PROBE_STEP = 0.5
const STRIDE = 2

function waterEdge(track, path, i, side) {
  const half = path.width[i] / 2
  const rightX = -path.tz[i] * side
  const rightZ = path.tx[i] * side
  for (let d = 0; d <= RACE.waterFence.reach; d += PROBE_STEP) {
    const x = path.x[i] + rightX * (half + d)
    const z = path.z[i] + rightZ * (half + d)
    for (const lake of track.lakes) if (distanceToLakeEdge(lake, x, z) < 0) return d
  }
  return null
}

// Côté (-1, 0, 1) vers lequel une autre portion de route est trop proche, ou 0.
function shortcutSides(path, i) {
  const { gap, separation } = RACE.shortcut
  let sides = 0
  const half = path.width[i] / 2
  for (let j = 0; j < path.count; j += STRIDE) {
    const along = Math.abs(j - i) * path.step
    if (Math.min(along, path.length - along) < separation) continue
    const dx = path.x[j] - path.x[i]
    const dz = path.z[j] - path.z[i]
    const distance = Math.hypot(dx, dz) - half - path.width[j] / 2
    if (distance > gap) continue
    // Seulement ce qui est sur le côté (pas devant ou derrière dans l'axe de la route).
    const lateral = dx * -path.tz[i] + dz * path.tx[i]
    if (Math.abs(lateral) < Math.abs(dx * path.tx[i] + dz * path.tz[i])) continue
    sides |= lateral > 0 ? 2 : 1
  }
  return sides
}

// Muret prolongé de EXTEND m de chaque côté (on ne le contourne pas par son extrémité) ; les
// petits trous entre deux murets sont comblés du même coup.
const EXTEND = 8

function dilate(flags, path) {
  const reach = Math.round(EXTEND / path.step)
  const out = new Uint8Array(flags.length)
  for (let i = 0; i < flags.length; i += 1) {
    if (!flags[i]) continue
    for (let k = -reach; k <= reach; k += 1) out[(i + k + flags.length) % flags.length] = 1
  }
  return out
}

export function buildFences(track, path) {
  const water = { left: new Float32Array(path.count).fill(-1), right: new Float32Array(path.count).fill(-1) }
  const close = { left: new Uint8Array(path.count), right: new Uint8Array(path.count) }
  for (let i = 0; i < path.count; i += 1) {
    water.left[i] = waterEdge(track, path, i, -1) ?? -1
    water.right[i] = waterEdge(track, path, i, 1) ?? -1
    const sides = shortcutSides(path, i)
    close.left[i] = sides & 1 ? 1 : 0
    close.right[i] = sides & 2 ? 1 : 0
  }
  const walls = { left: dilate(close.left, path), right: dilate(close.right, path) }
  const limits = { left: new Float32Array(path.count), right: new Float32Array(path.count) }
  for (const side of ['left', 'right']) {
    for (let i = 0; i < path.count; i += 1) {
      // L'eau l'emporte : elle barre déjà le raccourci (on y tombe).
      if (water[side][i] >= 0) walls[side][i] = 0
      limits[side][i] = water[side][i] >= 0 ? water[side][i] + RACE.waterFence.into : walls[side][i] ? RACE.shortcut.fence : RACE.fence
    }
  }
  return { ...limits, walls }
}
