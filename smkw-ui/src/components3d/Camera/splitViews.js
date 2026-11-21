import { PerspectiveCamera } from 'three'

// Caméras et cases de l'écran partagé, allouées une fois au niveau module (aucune allocation
// par frame). Écrites par SplitScreenRenderer, lues par les hooks de test.
export const MAX_SPLIT_VIEWS = 8

export const splitCameras = Array.from({ length: MAX_SPLIT_VIEWS }, () => new PerspectiveCamera(65, 1, 0.1, 900))

const views = Array.from({ length: MAX_SPLIT_VIEWS }, () => ({ playerId: null, pixels: [0, 0, 0, 0] }))
let viewCount = 0

export function setSplitViewCount(count) {
  viewCount = count
}

// Mémorise la case rendue (pixels CSS : gauche, haut, largeur, hauteur ; origine en haut à gauche).
export function recordSplitView(cell, playerId, left, top, width, height) {
  const view = views[cell]
  view.playerId = playerId
  view.pixels[0] = left
  view.pixels[1] = top
  view.pixels[2] = width
  view.pixels[3] = height
}

// render_game_to_text : cases rendues à la dernière frame (null hors écran partagé).
export function describeSplitScreen() {
  if (viewCount === 0) return null
  const round = (value) => Number(value.toFixed(2))
  return views.slice(0, viewCount).map(({ playerId, pixels }, cell) => {
    const { position } = splitCameras[cell]
    return { playerId, pixels: [...pixels], camera: [round(position.x), round(position.y), round(position.z)] }
  })
}
