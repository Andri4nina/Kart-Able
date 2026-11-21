import { BoxGeometry, ConeGeometry, CylinderGeometry, MeshStandardMaterial, SphereGeometry } from 'three'

// Géométries unitaires partagées : chaque pièce d'un modèle est une de ces formes mise
// à l'échelle. Aucun modèle ne crée sa propre géométrie (pas de duplication GPU).
export const UNIT_GEOMETRIES = {
  box: new BoxGeometry(1, 1, 1),
  cone: new ConeGeometry(0.5, 1, 10),
  cylinder: new CylinderGeometry(0.5, 0.5, 1, 18),
  sphere: new SphereGeometry(0.5, 18, 12),
}

const materialCache = new Map()

// Un matériau par couleur (et par variante lumineuse), réutilisé par tous les modèles.
export function getMaterial(color, { glow = false, rough = 0.55 } = {}) {
  const key = `${color}:${glow}:${rough}`
  if (!materialCache.has(key)) {
    materialCache.set(
      key,
      new MeshStandardMaterial({
        color,
        roughness: rough,
        metalness: 0.1,
        flatShading: true,
        emissive: glow ? color : '#000000',
        emissiveIntensity: glow ? 0.9 : 0,
      }),
    )
  }
  return materialCache.get(key)
}
