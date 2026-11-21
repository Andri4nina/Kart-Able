import { Box3, Vector3 } from 'three'

// Tests uniquement : position à l'écran (en % de la fenêtre) de chaque preview 3D,
// pour vérifier l'alignement avec les étiquettes et l'en-tête sans capture d'écran.
const box = new Box3()
const corner = new Vector3()

function toScreenPercent(point, camera) {
  corner.copy(point).project(camera)
  return { x: ((corner.x + 1) / 2) * 100, y: ((1 - corner.y) / 2) * 100 }
}

export function probePreview(scene, camera) {
  const stage = scene.getObjectByName('character-preview-stage')
  if (!stage) return null
  camera.updateMatrixWorld()
  return stage.children.map((slot) => {
    box.setFromObject(slot)
    const top = toScreenPercent(new Vector3((box.min.x + box.max.x) / 2, box.max.y, (box.min.z + box.max.z) / 2), camera)
    const bottom = toScreenPercent(new Vector3((box.min.x + box.max.x) / 2, box.min.y, box.max.z), camera)
    const left = toScreenPercent(new Vector3(box.min.x, box.min.y, box.max.z), camera)
    const right = toScreenPercent(new Vector3(box.max.x, box.min.y, box.max.z), camera)
    const round = (value) => Math.round(value * 10) / 10
    let model = null
    slot.traverse((object) => {
      if (!model && /^(character|vehicle)-/.test(object.name)) model = object.name
    })
    // Centre du socle (point d'alignement des étiquettes), pas du volume du modèle.
    const pedestal = toScreenPercent(slot.getWorldPosition(new Vector3()), camera)
    return {
      model,
      centerX: round(pedestal.x),
      left: round(left.x),
      right: round(right.x),
      top: round(top.y),
      bottom: round(bottom.y),
    }
  })
}
