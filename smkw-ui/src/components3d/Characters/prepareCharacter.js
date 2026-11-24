import { AnimationMixer, Box3, Group, Vector3 } from 'three'
import { clone } from 'three/addons/utils/SkeletonUtils.js'
import { DRIVER_PELVIS_LIFT } from './characterAssets'
import { createDriverRig } from './driverRig'

// Mesures d'un modèle posé (boîte englobante précise, squelette compris), calculées une fois
// par fichier : tous les clones d'un même personnage ont la même pose de départ.
const metricsCache = new WeakMap()
const box = new Box3()

function measure(object) {
  object.updateMatrixWorld(true)
  box.setFromObject(object, true)
  const size = box.getSize(new Vector3())
  const center = box.getCenter(new Vector3())
  return { size, offset: new Vector3(-center.x, -box.min.y, -center.z) }
}

// Copie les matériaux et les teinte (modèle livré sans couleur). Renvoie les copies à libérer.
function tintMaterials(object, color) {
  const copies = []
  object.traverse((child) => {
    if (!child.isMesh) return
    const list = Array.isArray(child.material) ? child.material : [child.material]
    const tinted = list.map((material) => {
      const copy = material.clone()
      copy.color.set(color)
      copies.push(copy)
      return copy
    })
    child.material = Array.isArray(child.material) ? tinted : tinted[0]
  })
  return copies
}

// Prépare un personnage pour l'affichage : clone (squelette compris), pose (première image de
// son animation), orientation vers +Z, mise au sol et à la hauteur demandée.
// Renvoie { object, mixer, rig, dispose } ; `mixer` n'existe que pour une animation en boucle.
// `driver` : pose assise au volant (driverRig) si le squelette le permet ; le bassin est alors
// ramené à l'origine (le kart le pose sur son siège) et l'animation en boucle est coupée.
export function prepareCharacter(gltf, asset, { name, height, color, driver = false }) {
  const model = clone(gltf.scene)
  const copies = asset.tint && color ? tintMaterials(model, color) : []

  const clip = asset.clip ? gltf.animations.find((candidate) => candidate.name === asset.clip) : null
  const mixer = clip ? new AnimationMixer(model) : null
  if (mixer) {
    mixer.clipAction(clip).play()
    mixer.update(0)
  }

  const oriented = new Group()
  oriented.rotation.y = asset.yaw ?? 0
  oriented.add(model)

  let metrics = metricsCache.get(gltf.scene)
  if (!metrics) {
    metrics = measure(oriented)
    metricsCache.set(gltf.scene, metrics)
  }

  const grounded = new Group()
  grounded.position.copy(metrics.offset)
  grounded.add(oriented)

  const object = new Group()
  object.name = name
  object.scale.setScalar(height / Math.max(metrics.size.y, 1e-4))
  object.add(grounded)

  const rig = driver && asset.driverPose !== false ? createDriverRig(object) : null
  if (rig) object.position.set(-rig.hip.x, DRIVER_PELVIS_LIFT - rig.hip.y, -rig.hip.z)

  // `dispose` ne libère que les matériaux copiés (three les recrée s'ils resservent) ; il
  // n'arrête pas l'animation : en développement, React rejoue démontage et remontage.
  return {
    object,
    mixer: asset.loop && !rig ? mixer : null,
    rig,
    dispose: () => {
      for (const material of copies) material.dispose()
    },
  }
}
