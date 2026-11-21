import { getCurvature } from '../track/trackLayout'

// Pilote ordinateur (calcul pur, aucune allocation) : il vise un point du tracé devant lui, sur
// sa trajectoire préférée (`kart.lane`, -1 gauche .. 1 droite), et lève le pied avant les
// virages trop serrés pour sa maniabilité. Sert aussi de pilote automatique après l'arrivée.
const LOOK_BASE = 7 // m
const LOOK_TIME = 0.45 // s de trajet ajoutées à la visée
const STEER_GAIN = 2.4
const CORNER_MARGIN = 0.6

function wrapAngle(angle) {
  return angle - Math.round(angle / (Math.PI * 2)) * Math.PI * 2
}

export function driveBot(kart, path, out) {
  const ahead = Math.round((LOOK_BASE + Math.max(0, kart.speed) * LOOK_TIME) / path.step)
  const i = (kart.trackIndex + ahead) % path.count
  const lane = kart.lane * Math.max(0, path.width[i] / 2 - 2.5)
  const targetX = path.x[i] - path.tz[i] * lane
  const targetZ = path.z[i] + path.tx[i] * lane
  const error = wrapAngle(Math.atan2(targetX - kart.x, targetZ - kart.z) - kart.yaw)
  out.steer = Math.max(-1, Math.min(1, -error * STEER_GAIN))

  // Vitesse de passage du virage à venir : vitesse de rotation possible / courbure.
  const curvature = Math.max(
    Math.abs(getCurvature(path, i, 6)),
    Math.abs(getCurvature(path, (i + ahead) % path.count, 6)),
  )
  const cornerSpeed = curvature > 1e-4 ? (kart.stats.turnRate * CORNER_MARGIN) / curvature : Infinity
  const target = Math.min(kart.stats.maxSpeed * kart.topFactor, cornerSpeed)
  // Bien orienté seulement : face au mauvais côté, on tourne d'abord sans accélérer fort.
  const aligned = Math.abs(error) < 1.2
  out.throttle = kart.speed < target ? (aligned ? 1 : 0.5) : 0
  out.brake = kart.speed > target + 5 ? 1 : 0
  out.drift = false
  out.item = false
  return out
}
