import { DodecahedronGeometry, DoubleSide, MeshStandardMaterial, PlaneGeometry, Shape, ShapeGeometry } from 'three'
import { PAD_SIZE } from '../../game/track/trackFeatures'
import { PALETTE } from '../World/palette'

// Formes et matériaux des éléments de route (créés une fois) : pad d'accélération (plaque
// sombre, trois chevrons lumineux pointés vers l'avant) et rocher à facettes.
function chevron() {
  const w = PAD_SIZE.width / 2 - 0.25
  const shape = new Shape()
  shape.moveTo(-w, 0)
  shape.lineTo(0, 0.9)
  shape.lineTo(w, 0)
  shape.lineTo(w, 0.45)
  shape.lineTo(0, 1.35)
  shape.lineTo(-w, 0.45)
  shape.closePath()
  // Plan XY -> sol (X, Z) : l'avant du chevron (+Y) devient +Z, le sens de course.
  return new ShapeGeometry(shape).rotateX(Math.PI / 2)
}

export const FEATURE_GEOMETRIES = {
  padPlate: new PlaneGeometry(PAD_SIZE.width, PAD_SIZE.length).rotateX(-Math.PI / 2),
  chevron: chevron(),
  rock: new DodecahedronGeometry(1, 0),
}

export const FEATURE_MATERIALS = {
  padPlate: new MeshStandardMaterial({ color: '#1d2230', roughness: 0.4, metalness: 0.3, polygonOffset: true, polygonOffsetFactor: -2 }),
  chevron: new MeshStandardMaterial({ color: PALETTE.orange, emissive: PALETTE.orange, emissiveIntensity: 1.2, side: DoubleSide, polygonOffset: true, polygonOffsetFactor: -4 }),
}

const rockMaterials = new Map()
export function getRockMaterial(color) {
  if (!rockMaterials.has(color)) rockMaterials.set(color, new MeshStandardMaterial({ color, roughness: 0.9, flatShading: true }))
  return rockMaterials.get(color)
}
