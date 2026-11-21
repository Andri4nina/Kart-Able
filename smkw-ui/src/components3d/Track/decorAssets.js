import bannerTowerGreenUrl from '../../assets/models/racing/bannerTowerGreen.glb'
import bannerTowerRedUrl from '../../assets/models/racing/bannerTowerRed.glb'
import barrierWallUrl from '../../assets/models/racing/barrierWall.glb'
import flagCheckersUrl from '../../assets/models/racing/flagCheckers.glb'
import grandStandCoveredUrl from '../../assets/models/racing/grandStandCovered.glb'
import lightPostModernUrl from '../../assets/models/racing/lightPostModern.glb'
import overheadLightsUrl from '../../assets/models/racing/overheadLights.glb'

// Décor de course : Kenney « Racing Kit » (CC0, domaine public), repris du portfolio.
// Les modèles Kenney sont à l'échelle d'une tuile de route (1) : `scale` les met à l'échelle
// du jeu (route de 17 à 20 m, kart de 2 m).
export const DECOR_MODELS = Object.freeze({
  gantry: { url: overheadLightsUrl },
  flag: { url: flagCheckersUrl, scale: 5 },
  stand: { url: grandStandCoveredUrl, scale: 7 },
  towerRed: { url: bannerTowerRedUrl, scale: 7 },
  towerGreen: { url: bannerTowerGreenUrl, scale: 7 },
  barrier: { url: barrierWallUrl, scale: 4 },
  light: { url: lightPostModernUrl, scale: 10 },
})

// Pièces d'un modèle GLB, avec leur matrice dans le modèle (pour InstancedParts).
export function getModelParts(scene) {
  scene.updateMatrixWorld(true)
  const parts = []
  scene.traverse((child) => {
    if (child.isMesh) parts.push({ geometry: child.geometry, material: child.material, matrix: child.matrixWorld.clone() })
  })
  return parts
}
