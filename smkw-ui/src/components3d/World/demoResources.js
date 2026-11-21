import {
  BoxGeometry,
  CircleGeometry,
  ConeGeometry,
  CylinderGeometry,
  IcosahedronGeometry,
  MeshBasicMaterial,
  MeshStandardMaterial,
  TorusGeometry,
} from 'three'
import { PALETTE } from './palette'

// Géométries et matériaux partagés au niveau module : une seule instance GPU par
// ressource, quel que soit le nombre de props. Base naturelle pour l'instancing plus tard.

export const GEOMETRIES = {
  coneBase: new BoxGeometry(0.8, 0.08, 0.8),
  coneBody: new ConeGeometry(0.32, 0.9, 16),
  coneBand: new CylinderGeometry(0.145, 0.195, 0.14, 16, 1, true),
  tire: new TorusGeometry(0.42, 0.18, 10, 20),
  podium: new CylinderGeometry(2.4, 2.6, 0.4, 32),
  podiumRing: new TorusGeometry(2.45, 0.06, 6, 48),
  gem: new IcosahedronGeometry(0.85, 0),
  halo: new TorusGeometry(1.35, 0.05, 6, 48),
  blob: new CircleGeometry(1, 24),
}

export const MATERIALS = {
  cone: new MeshStandardMaterial({ color: PALETTE.orange, roughness: 0.6 }),
  white: new MeshStandardMaterial({ color: PALETTE.white, roughness: 0.5 }),
  rubber: new MeshStandardMaterial({ color: PALETTE.rubber, roughness: 0.9, flatShading: true }),
  asphalt: new MeshStandardMaterial({ color: PALETTE.asphalt, roughness: 0.85 }),
  yellow: new MeshStandardMaterial({ color: PALETTE.yellow, roughness: 0.4 }),
  red: new MeshStandardMaterial({ color: PALETTE.red, roughness: 0.4 }),
  gem: new MeshStandardMaterial({
    color: PALETTE.yellow,
    emissive: PALETTE.yellow,
    emissiveIntensity: 0.18,
    roughness: 0.35,
    metalness: 0.1,
    flatShading: true,
  }),
  // Ombre "blob" : un disque transparent, bien moins coûteux qu'un shadow map.
  blob: new MeshBasicMaterial({ color: '#000000', transparent: true, opacity: 0.2, depthWrite: false }),
}
