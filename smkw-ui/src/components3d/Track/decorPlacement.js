import { RACE } from '../../config/race'
import { getCurvature, sampleTrack, yawOf } from '../../game/track/trackLayout'

// Placement du décor de course (pur, déduit du chemin) : portique et drapeaux sur la ligne,
// tribunes et lampadaires le long de la ligne droite de départ (côté extérieur), tours à
// bannière à l'extérieur des virages les plus serrés. Tout est posé au-delà de la clôture du
// hors-piste (RACE.fence) : aucun décor qu'on traverserait. Les limites : TrackBarriers.
const TOWER_CURVATURE = 0.011
const OUTSIDE = RACE.fence

// Point à `lateral` m à droite de la ligne médiane, à la distance `distance`.
function lateralPoint(path, distance, lateral) {
  const p = sampleTrack(path, distance)
  return { x: p.x - p.tz * lateral, z: p.z + p.tx * lateral, point: p }
}

export function placeDecor(path, bounds) {
  const start = sampleTrack(path, 0)
  // Extérieur de la boucle : le côté qui s'éloigne du centre du circuit.
  const outside = (-start.tz * (start.x - bounds.centerX) + start.tx * (start.z - bounds.centerZ)) > 0 ? 1 : -1
  const decor = { gantry: [], flag: [], stand: [], towerRed: [], towerGreen: [], light: [] }

  // Le portique et les murets sont longs selon leur axe X : on oriente leur axe Z (portique)
  // dans le sens de course, ou en travers (murets) pour les aligner.
  decor.gantry.push({ x: start.x, z: start.z, yaw: yawOf(start.tx, start.tz), scale: (start.width + 4) / 1.26 })
  for (const sign of [-1, 1]) {
    const flag = lateralPoint(path, 1, sign * (start.width / 2 + OUTSIDE + 1.5))
    decor.flag.push({ x: flag.x, z: flag.z, yaw: yawOf(start.tx, start.tz) })
  }
  for (let along = -42; along <= 42; along += 7) {
    const stand = lateralPoint(path, along, outside * (start.width / 2 + OUTSIDE + 6))
    decor.stand.push({ x: stand.x, z: stand.z, yaw: yawOf(stand.point.tx, stand.point.tz) + (outside > 0 ? Math.PI / 2 : -Math.PI / 2) })
  }
  for (let along = -60; along <= 60; along += 24) {
    for (const sign of [-1, 1]) {
      const light = lateralPoint(path, along, sign * (start.width / 2 + OUTSIDE + 1.5))
      decor.light.push({ x: light.x, z: light.z, yaw: yawOf(light.point.tx, light.point.tz) + (sign > 0 ? Math.PI / 2 : -Math.PI / 2) })
    }
  }

  let lastTower = -Infinity
  for (let i = 0; i < path.count; i += 1) {
    const distance = i * path.step
    const curvature = getCurvature(path, i)
    const outer = curvature > 0 ? -1 : 1
    if (Math.abs(curvature) > TOWER_CURVATURE && distance - lastTower > 90 && distance > 60 && distance < path.length - 80) {
      lastTower = distance
      const tower = lateralPoint(path, distance, outer * (path.width[i] / 2 + OUTSIDE + 3))
      const list = decor.towerRed.length <= decor.towerGreen.length ? decor.towerRed : decor.towerGreen
      list.push({ x: tower.x, z: tower.z, yaw: yawOf(tower.point.tx, tower.point.tz) })
    }
  }
  return decor
}
