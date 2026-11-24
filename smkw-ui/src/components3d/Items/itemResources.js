import { BoxGeometry, CylinderGeometry, IcosahedronGeometry, MeshStandardMaterial, OctahedronGeometry } from 'three'
import { PALETTE } from '../World/palette'

// Formes et matériaux partagés des objets en course (créés une fois, jamais par frame).
export const ITEM_GEOMETRIES = {
  boxShell: new BoxGeometry(1.15, 1.15, 1.15),
  boxCore: new OctahedronGeometry(0.36),
  slick: new CylinderGeometry(1.25, 1.25, 0.04, 20),
  orb: new IcosahedronGeometry(0.42, 1),
}

export const ITEM_MATERIALS = {
  boxShell: new MeshStandardMaterial({ color: PALETTE.sky, emissive: PALETTE.sky, emissiveIntensity: 0.35, transparent: true, opacity: 0.55, roughness: 0.2, flatShading: true }),
  boxCore: new MeshStandardMaterial({ color: PALETTE.yellow, emissive: PALETTE.yellow, emissiveIntensity: 0.8, flatShading: true }),
  slick: new MeshStandardMaterial({ color: '#15151c', roughness: 0.05, metalness: 0.4 }),
  orb: new MeshStandardMaterial({ color: PALETTE.purple, emissive: PALETTE.purple, emissiveIntensity: 1, flatShading: true }),
}
