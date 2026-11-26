import { getCurvature } from '../track/trackLayout'
import { applyBotDrift } from './botDrift'
import { chooseBotLateral } from './botLine'

// Pilote ordinateur (calcul pur, aucune allocation) : il vise un point du tracé devant lui, sur
// sa trajectoire préférée (`kart.lane`, -1 gauche .. 1 droite, déviée par botLine.js pour
// éviter les rochers et prendre les pads), et lève le pied avant les
// virages trop serrés pour sa maniabilité ; il drifte dans les virages marqués (botDrift.js).
// Sert aussi de pilote automatique après l'arrivée.
const LOOK_BASE = 7 // m
const LOOK_TIME = 0.45 // s de trajet ajoutées à la visée
const STEER_GAIN = 2.4
const CORNER_MARGIN = 0.6
const DRIFT_MARGIN = 0.95 // en drift, le kart tourne plus serré : virage pris plus vite
const FAR_LOOK = 2.2 // la visée lointaine (anticipation du drift) est à FAR_LOOK x la visée

function wrapAngle(angle) {
  return angle - Math.round(angle / (Math.PI * 2)) * Math.PI * 2
}

export function driveBot(kart, geometry, out, dt = 0) {
  const { path } = geometry
  const ahead = Math.round((LOOK_BASE + Math.max(0, kart.speed) * LOOK_TIME) / path.step)
  const i = (kart.trackIndex + ahead) % path.count
  const half = Math.max(0, path.width[i] / 2 - 2.5)
  // En drift, le kart glisse vers l'extérieur : il vise le milieu de la route.
  const lane = chooseBotLateral(geometry, kart, kart.lane * half * (kart.driftDir ? 0.25 : 1), half)
  const targetX = path.x[i] - path.tz[i] * lane
  const targetZ = path.z[i] + path.tx[i] * lane
  // Visée avec le nez : en drift, la trajectoire rejoint le nez (adhérence), on anticipe donc.
  const error = wrapAngle(Math.atan2(targetX - kart.x, targetZ - kart.z) - kart.yaw)
  out.steer = Math.max(-1, Math.min(1, -error * STEER_GAIN))

  // Vitesse de passage du virage à venir : vitesse de rotation possible / courbure.
  const curvature = Math.max(
    Math.abs(getCurvature(path, i, 6)),
    Math.abs(getCurvature(path, (i + ahead) % path.count, 6)),
  )
  const margin = kart.driftDir ? DRIFT_MARGIN : CORNER_MARGIN
  const cornerSpeed = curvature > 1e-4 ? (kart.stats.turnRate * margin) / curvature : Infinity
  const target = Math.min(kart.stats.maxSpeed * kart.topFactor, cornerSpeed)
  // Bien orienté seulement : face au mauvais côté, on tourne d'abord sans accélérer fort.
  const aligned = Math.abs(error) < 1.2
  out.throttle = kart.speed < target ? (aligned ? 1 : 0.5) : 0
  out.brake = kart.speed > target + 5 ? 1 : 0
  out.drift = false
  out.item = false
  if (!kart.finished) {
    const far = (kart.trackIndex + Math.round(ahead * FAR_LOOK)) % path.count
    const here = kart.trackIndex
    const turnAhead = wrapAngle(Math.atan2(path.tx[far], path.tz[far]) - Math.atan2(path.tx[here], path.tz[here]))
    applyBotDrift(kart, out, turnAhead, dt)
    // Tremplin : une figure à chaque saut (nouvel appui sur Drift dans la fenêtre).
    if (kart.trickWindow > 0 && !kart.trickPending) out.drift = !kart.driftHeld
  }
  return out
}
