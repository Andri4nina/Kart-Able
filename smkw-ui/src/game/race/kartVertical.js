import { RELIEF } from '../../config/kartTuning'
import { getGroundHeight, getSlope } from '../track/trackHeight'

// Hauteur d'un kart sur le relief (calcul pur, aucune allocation) :
// - au sol, il suit la pente et sa vitesse verticale suit celle du terrain ; la pente freine en
//   montée et pousse en descente (gravité arcade le long de la route) ;
// - sur une crête prise vite, le terrain descend plus vite que le kart : il décolle, retombe
//   sous la gravité et se repose (petit saut naturel) ;
// - sur un circuit plat, tout reste à 0.
export function updateKartVertical(kart, geometry, dt) {
  if (!geometry.relief) return
  const forwardX = Math.sin(kart.yaw)
  const forwardZ = Math.cos(kart.yaw)
  const ground = getGroundHeight(geometry, kart.x, kart.z)
  kart.vy -= RELIEF.gravity * dt
  kart.y += kart.vy * dt
  // Au-dessus du sol : en vol (même de quelques centimètres, sinon le kart ne décollerait
  // jamais) ; `airborne` (contrôle réduit, affichage) seulement au-delà du seuil.
  if (kart.y > ground) {
    kart.airborne = kart.y > ground + RELIEF.airThreshold
    return
  }
  kart.airborne = false
  kart.slope = getSlope(geometry, kart.x, kart.z, forwardX, forwardZ)
  kart.y = ground
  kart.vy = kart.speed * kart.slope
  // Gravité le long de la pente, appliquée à la vitesse vers l'avant.
  const push = -RELIEF.slopeGravity * kart.slope * dt
  kart.vx += forwardX * push
  kart.vz += forwardZ * push
}

// Pose au sol (départ, réapparition).
export function placeOnGround(kart, geometry) {
  kart.y = getGroundHeight(geometry, kart.x, kart.z)
  kart.vy = 0
  kart.airborne = false
  kart.slope = 0
}
