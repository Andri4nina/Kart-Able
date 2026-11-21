// Un comportement = une fonction pure qui écrit la position et la cible désirées.
// CameraRig se charge du lissage. Chaque écran choisit son plan via SCREEN_META.camera
// (navigation/screens.js). Remplacer une caméra = remplacer une entrée ici
// (phase 2 : `game` deviendra une caméra de poursuite du kart).
import { PREVIEW_STAGE } from '../../config/characterPreview'

function orbit(config) {
  return {
    fov: config.fov,
    update({ time, aspect, reducedMotion }, outPosition, outTarget) {
      const angle = config.startAngle + (reducedMotion ? 0 : time * config.speed)
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      outPosition.set(cos * config.radius, config.height, sin * config.radius)

      // Vecteur "droite" de la caméra dans le plan XZ : (sin, 0, -cos).
      // Décaler la cible vers la gauche place l'objet vitrine à droite de l'écran.
      const offset = aspect > config.wideAspect ? config.sideOffset : 0
      outTarget.set(-sin * offset, config.focusY, cos * offset)
    },
  }
}

export const CAMERA_BEHAVIORS = {
  // Menu principal : orbite proche, vitrine à droite du menu.
  menu: orbit({ fov: 45, radius: 13, height: 5, speed: 0.08, startAngle: 0.9, focusY: 1.6, sideOffset: 3.6, wideAspect: 1.1 }),
  // Sous-menus : plan large et calme derrière les panneaux.
  menuWide: orbit({ fov: 50, radius: 18, height: 9, speed: 0.04, startAngle: 1.4, focusY: 0.6, sideOffset: 0, wideAspect: 1.1 }),
  // Lobby : plan bas, héroïque, vitrine à droite.
  lobby: orbit({ fov: 42, radius: 9.5, height: 2.8, speed: 0.05, startAngle: 1.9, focusY: 1.7, sideOffset: 3.2, wideAspect: 1.1 }),
  // Écrans de sélection (personnages, véhicules) : vue fixe sur la rangée de previews,
  // cadrée dans le haut de l'écran (mêmes constantes que l'UI, voir config/characterPreview.js).
  selection: {
    fov: PREVIEW_STAGE.camera.fov,
    update(_context, outPosition, outTarget) {
      outPosition.set(...PREVIEW_STAGE.camera.position)
      outTarget.set(...PREVIEW_STAGE.camera.target)
    },
  },
  // Jeu : vue fixe, FOV des réglages joueur (null).
  game: {
    fov: null,
    update(_context, outPosition, outTarget) {
      outPosition.set(0, 3.2, 9.5)
      outTarget.set(0, 1.2, 0)
    },
  },
}
