import { Box3, Group, Vector3 } from 'three'

const box = new Box3()
const size = new Vector3()
const center = new Vector3()

// Sans carte d'environnement, les matériaux très métalliques paraissent noirs :
// on les adoucit (copie du matériau, l'original du cache reste intact).
function softenMetal(object) {
  object.traverse((child) => {
    if (!child.isMesh) return
    const materials = Array.isArray(child.material) ? child.material : [child.material]
    const adjusted = materials.map((material) => {
      if (!(material?.metalness > 0.6)) return material
      const copy = material.clone()
      copy.metalness = 0.35
      return copy
    })
    child.material = Array.isArray(child.material) ? adjusted : adjusted[0]
  })
}

// Normalise un modèle importé : centré en X/Z, posé sur le sol (y = 0), mis à la longueur
// voulue, puis tourné pour que l'avant regarde +Z. Renvoie un groupe prêt à afficher.
export function normalizeModel(object, { length, yaw = 0, name }) {
  softenMetal(object)
  object.updateMatrixWorld(true)
  box.setFromObject(object)
  box.getSize(size)
  box.getCenter(center)

  object.position.set(-center.x, -box.min.y, -center.z)

  const scaled = new Group()
  scaled.scale.setScalar(length / Math.max(size.x, size.z, 1e-3))
  scaled.add(object)

  const oriented = new Group()
  oriented.name = name
  oriented.rotation.y = yaw
  oriented.add(scaled)
  return oriented
}
