import { Color } from 'three'
import { DIVE } from '../../game/track/trackDives'

// Vue sous l'eau (plongées, game/track/trackDives.js) : quand la caméra d'une case passe sous la
// surface, brouillard bleu et proche, fond de la même couleur, le temps du rendu de cette case.
const DEEP = new Color('#0c5c86')
const FOG = { near: 4, far: 90 }
const saved = { color: new Color(), background: new Color(), near: 0, far: 0 }

// Seulement pendant une plongée du kart suivi (pas dans la tranchée d'un croisement, aussi sous
// le niveau de l'eau mais à l'air libre).
export function isUnderwater(camera, kart) {
  return Boolean(kart?.underwater) && camera.position.y < DIVE.surface
}

// Renvoie true si la scène a été modifiée (à rétablir avec restoreUnderwater).
export function applyUnderwater(scene, camera, kart) {
  const fog = scene.fog
  if (!fog || !isUnderwater(camera, kart) || !scene.background?.isColor) return false
  saved.color.copy(fog.color)
  saved.background.copy(scene.background)
  saved.near = fog.near
  saved.far = fog.far
  fog.color.copy(DEEP)
  scene.background.copy(DEEP)
  Object.assign(fog, FOG)
  return true
}

export function restoreUnderwater(scene) {
  scene.fog.color.copy(saved.color)
  scene.background.copy(saved.background)
  scene.fog.near = saved.near
  scene.fog.far = saved.far
}
