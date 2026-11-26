import { MathUtils } from 'three'
import { TRICK } from '../../config/airTuning'

// Attitude en l'air d'un kart (aucune allocation) : figure (tonneau, salto ou vrille selon
// `kart.trickStyle`, un tour complet en TRICK.duration) et deltaplane (déployé en 0,25 s,
// légère oscillation, kart un peu cabré). En mouvement réduit, la figure se fait sans
// rotation complète (petit soubresaut) : l'information reste, pas le tournoiement.
const DEPLOY_RATE = 4
const GLIDE_PITCH = -0.12

export function writeAirPose(kart, delta, reducedMotion, visual, body, glider) {
  visual.glide = MathUtils.clamp(visual.glide + (kart.gliding ? delta : -delta) * DEPLOY_RATE, 0, 1)
  if (glider) {
    glider.visible = visual.glide > 0
    glider.scale.setScalar(visual.glide)
    glider.rotation.z = kart.gliding && !reducedMotion ? Math.sin(visual.phase * 0.08) * 0.06 - kart.controls.steer * 0.18 : 0
  }
  if (visual.glide > 0) body.rotation.x += GLIDE_PITCH * visual.glide
  if (kart.trick <= 0) return
  const t = 1 - kart.trick / TRICK.duration
  const turn = reducedMotion ? Math.sin(t * Math.PI) * 0.25 : (t * t * (3 - 2 * t)) * Math.PI * 2
  if (kart.trickStyle === 0) body.rotation.z += turn
  else if (kart.trickStyle === 1) body.rotation.x -= turn
  else body.rotation.y += turn
}
