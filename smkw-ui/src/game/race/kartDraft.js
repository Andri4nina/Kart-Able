import { DRAFT, WRONG_WAY } from '../../config/raceFeel'
import { applyBoost } from './kartBoost'

// Aspiration et sens interdit (calcul pur, une fois par frame de `dt` secondes).
// Aspiration : un kart au sol, assez rapide, dans le sillage d'un autre (cône derrière lui)
// remplit `draft` ; pleine, elle donne le turbo BOOSTS.draft. `drafting` : dans un sillage
// (effet de vent, visuel). Pas en drift ; un temps de recharge après chaque turbo. Pilotes
// ordinateur compris : ils en profitent aussi.
function findSlipstream(kart, karts) {
  const fx = Math.sin(kart.yaw)
  const fz = Math.cos(kart.yaw)
  for (const other of karts) {
    if (other === kart || other.sinking > 0) continue
    const dx = other.x - kart.x
    const dz = other.z - kart.z
    const along = dx * fx + dz * fz
    if (along < DRAFT.minGap || along > DRAFT.range) continue
    const side = Math.abs(dx * -fz + dz * fx)
    if (side < DRAFT.width + along * DRAFT.widthGrow && Math.abs(other.y - kart.y) < 2) return true
  }
  return false
}

function updateDraft(kart, karts, dt) {
  const fast = kart.speed > kart.stats.maxSpeed * kart.topFactor * DRAFT.minSpeed
  kart.draftCooldown = Math.max(0, kart.draftCooldown - dt)
  const able = fast && !kart.airborne && !kart.driftDir && kart.sinking <= 0 && kart.spin <= 0 && kart.draftCooldown === 0
  kart.drafting = able && findSlipstream(kart, karts)
  if (!kart.drafting) {
    kart.draft = Math.max(0, kart.draft - dt * DRAFT.decay)
    return
  }
  kart.draft += dt
  if (kart.draft >= DRAFT.charge) {
    kart.draft = 0
    kart.drafting = false
    kart.draftCooldown = DRAFT.cooldown
    applyBoost(kart, 'draft')
  }
}

// Sens interdit : rouler à contresens du circuit plus de WRONG_WAY.delay secondes.
function updateWrongWay(kart, path, dt) {
  const i = kart.trackIndex
  const facing = Math.sin(kart.yaw) * path.tx[i] + Math.cos(kart.yaw) * path.tz[i]
  const backwards = !kart.finished && kart.speed > WRONG_WAY.minSpeed && facing < WRONG_WAY.facing
  kart.wrongWayTime = backwards ? kart.wrongWayTime + dt : facing > 0 ? 0 : kart.wrongWayTime
  kart.wrongWay = kart.wrongWayTime >= WRONG_WAY.delay
}

export function updateKartAssists(world, dt) {
  for (const kart of world.karts) {
    if (kart.remote) continue
    updateDraft(kart, world.karts, dt)
    if (!kart.isBot) updateWrongWay(kart, world.geometry.path, dt)
  }
}

// Progression de l'aspiration (0..1), pour l'affichage.
export const getDraftLevel = (kart) => Math.min(1, kart.draft / DRAFT.charge)
