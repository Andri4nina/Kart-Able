import { getGridSlot, START_GRID } from '../../config/startGrid'
import { getTrackGeometry } from '../track/trackGeometry'
import { getStartSlot } from '../track/trackLayout'

// Place de départ du joueur n° `order` dans la partie : sur la grille du circuit choisi, ou
// dans l'arène de démonstration pour les modes sans circuit. { x, z, yaw } (yaw oriente +Z,
// l'avant des modèles, dans le sens de course).
export function getRaceStartSlot(match, order) {
  const geometry = match?.trackId ? getTrackGeometry(match.trackId) : null
  if (geometry) return getStartSlot(geometry.path, order)
  const slot = getGridSlot(order)
  return { x: slot.x, z: slot.z, yaw: START_GRID.yaw }
}

// Emprise du circuit de la partie (vue d'ensemble), ou null dans l'arène.
export function getRaceBounds(match) {
  return match?.trackId ? (getTrackGeometry(match.trackId)?.bounds ?? null) : null
}
