import { AdditiveBlending, CylinderGeometry, DoubleSide, IcosahedronGeometry, MeshBasicMaterial, MeshStandardMaterial, OctahedronGeometry, RingGeometry, TorusGeometry } from 'three'
import { PALETTE } from '../World/palette'

// Formes et matériaux partagés des objets en course (créés une fois, jamais par frame).
// Case à objets : cristal à facettes translucide (teinte par instance, qui change avec le
// temps ; dorée pour une case dorée), cœur lumineux en étoile, anneau en orbite, halo au sol.
export const ITEM_GEOMETRIES = {
  boxShell: new IcosahedronGeometry(0.78, 0),
  boxCore: new OctahedronGeometry(0.34, 0).scale(1, 1.45, 1),
  boxRing: new TorusGeometry(0.98, 0.045, 5, 36),
  boxHalo: new RingGeometry(0.75, 1.05, 32).rotateX(-Math.PI / 2),
  slick: new CylinderGeometry(1.25, 1.25, 0.04, 20),
  orb: new IcosahedronGeometry(0.42, 1),
}

export const ITEM_MATERIALS = {
  boxShell: new MeshStandardMaterial({ color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 0.08, transparent: true, opacity: 0.78, roughness: 0.08, metalness: 0.2, flatShading: true }),
  boxCore: new MeshBasicMaterial({ color: '#ffffff', toneMapped: false }),
  boxRing: new MeshBasicMaterial({ color: '#ffffff', blending: AdditiveBlending, transparent: true, depthWrite: false, toneMapped: false }),
  boxHalo: new MeshBasicMaterial({ color: '#ffffff', blending: AdditiveBlending, transparent: true, opacity: 0.55, depthWrite: false, side: DoubleSide, toneMapped: false }),
  slick: new MeshStandardMaterial({ color: '#15151c', roughness: 0.05, metalness: 0.4 }),
  orb: new MeshStandardMaterial({ color: PALETTE.purple, emissive: PALETTE.purple, emissiveIntensity: 1, flatShading: true }),
}
