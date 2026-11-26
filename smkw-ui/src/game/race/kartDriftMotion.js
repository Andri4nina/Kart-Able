import { DRIFT } from '../../config/driftTuning'
import { driftGrip, driftInward, driftYawTarget } from './kartDriftRates'
import { updateForward } from './kartSpeed'

// Mouvement d'un kart en drift (calcul pur, aucune allocation). Repère : avant = (sin, cos) ;
// un drift à droite (driftDir 1) fait décroître les angles.
// 1. Le braquage pilote la vitesse de rotation du kart (`kart.yawRate`), avec inertie.
// 2. La vitesse garde sa norme ; sa direction suit le nez : une part `carry` de la rotation
//    aussitôt, puis l'adhérence latérale résorbe l'écart restant (angle de glisse).
// 3. L'angle de glisse `kart.slip` = nez - direction de la vitesse : il ÉMERGE de la rotation et
//    de l'adhérence (jamais imposé), plafonné à DRIFT.maxAngle.
// 4. Vitesse : accélération normale, légère perte si l'on glisse fort.
const wrap = (angle) => angle - Math.round(angle / (Math.PI * 2)) * Math.PI * 2

export function stepDriftMotion(kart, controls, dt) {
  kart.driftSteer += (controls.steer - kart.driftSteer) * (1 - Math.exp(-DRIFT.steerResponse * dt))
  const inward = driftInward(kart)
  const moving = Math.hypot(kart.vx, kart.vz)

  // 1. Rotation du kart, vers sa cible avec inertie (poids).
  const target = driftYawTarget(kart, inward)
  kart.yawRate += (target - kart.yawRate) * (1 - Math.exp(-kart.stats.driftResponse * dt))
  const turn = -kart.yawRate * dt
  kart.yaw += turn

  // 2. Direction de la vitesse : part immédiate de la rotation, puis adhérence sur l'écart.
  let heading = moving > 1 ? kart.yaw - turn - wrap(kart.yaw - turn - Math.atan2(kart.vx, kart.vz)) : kart.yaw - kart.slip
  heading += turn * DRIFT.carry
  let slip = wrap(kart.yaw - heading) * Math.exp(-driftGrip(kart, inward) * dt)
  // 3. Garde-fou : jamais de toupie.
  slip = Math.max(-DRIFT.maxAngle, Math.min(DRIFT.maxAngle, slip))
  heading = kart.yaw - slip
  kart.slip = slip

  // 4. Norme de la vitesse.
  const angle = Math.abs(slip) / DRIFT.maxAngle
  const speed = Math.max(0, updateForward(kart, controls, moving, dt) - DRIFT.scrub * angle * angle * dt)
  kart.vx = Math.sin(heading) * speed
  kart.vz = Math.cos(heading) * speed
  return speed
}
