import { Box3, Group, Quaternion, Vector3 } from 'three'

// Roues d'un véhicule importé (modèle normalisé, avant = +Z) : repérées automatiquement, sans
// nom imposé dans le fichier. Une roue est une pièce basse, ronde vue de côté (hauteur ~
// longueur), écartée de l'axe, dont le bas touche le sol ; les pièces d'une même roue (pneu,
// jante) sont regroupées. Chaque pièce est placée sous un pivot au centre de sa roue, qui tourne
// autour de l'essieu (axe X du kart) ; les roues avant braquent aussi (axe Y). Squelettes : les
// os nommés « wheel » tournent sur eux-mêmes. Renvoie null si aucune roue n'est trouvée.
const box = new Box3()
const size = new Vector3()
const center = new Vector3()
const parentQuaternion = new Quaternion()
const KART_X = new Vector3(1, 0, 0)
const KART_Y = new Vector3(0, 1, 0)

function isWheelShape() {
  const diameter = Math.max(size.y, size.z)
  if (diameter < 0.16 || diameter > 0.95) return false
  if (Math.abs(size.y - size.z) / diameter > 0.28 || size.x > diameter * 1.4) return false
  return center.y - size.y / 2 < 0.14 && Math.abs(center.x) > 0.15
}

function localAxis(parent, axis) {
  parent.getWorldQuaternion(parentQuaternion).invert()
  return axis.clone().applyQuaternion(parentQuaternion)
}

function findWheelMeshes(root) {
  const clusters = new Map()
  root.traverse((child) => {
    if (!child.isMesh || child.isSkinnedMesh) return
    box.setFromObject(child)
    box.getSize(size)
    box.getCenter(center)
    if (!isWheelShape()) return
    // Une roue = un côté et un essieu (pneu et jante ensemble, même vitesse de rotation).
    const key = `${Math.sign(center.x)}:${Math.round(center.z / 0.4)}`
    const cluster = clusters.get(key) ?? { meshes: [], center: new Vector3(), radius: 0 }
    cluster.meshes.push(child)
    cluster.center.add(center)
    cluster.radius = Math.max(cluster.radius, Math.max(size.y, size.z) / 2)
    clusters.set(key, cluster)
  })
  return [...clusters.values()].map((cluster) => ({ ...cluster, center: cluster.center.divideScalar(cluster.meshes.length) }))
}

function pivotMesh(mesh, wheelCenter) {
  const parent = mesh.parent
  const local = parent.worldToLocal(wheelCenter.clone())
  const pivot = new Group()
  pivot.name = `${mesh.name}-wheel-pivot`
  pivot.position.copy(local)
  parent.add(pivot)
  mesh.position.sub(local)
  pivot.add(mesh)
  return { node: pivot, base: new Quaternion(), spinAxis: localAxis(parent, KART_X), steerAxis: localAxis(parent, KART_Y) }
}

export function buildWheelRig(root) {
  root.updateMatrixWorld(true)
  const parts = []
  for (const cluster of findWheelMeshes(root)) {
    for (const mesh of cluster.meshes) parts.push({ ...pivotMesh(mesh, cluster.center), radius: cluster.radius, front: cluster.center.z > 0 })
  }
  root.traverse((child) => {
    // Os de roue le plus haut de sa chaîne (il entraîne les autres) ; jamais le volant.
    const isWheelBone = (bone) => bone?.isBone && /wheel/i.test(bone.name) && !/steer/i.test(bone.name)
    if (!isWheelBone(child) || isWheelBone(child.parent)) return
    child.getWorldPosition(center)
    const base = child.quaternion.clone()
    parts.push({ node: child, base, spinAxis: localAxis(child, KART_X), steerAxis: localAxis(child, KART_Y), radius: 0.22, front: center.z > 0 })
  })
  return parts.length ? { parts, angle: 0 } : null
}

const spin = new Quaternion()
const steer = new Quaternion()

// Une frame : rotation des roues selon la vitesse (m/s) et braquage des roues avant (rad).
export function writeWheelRig(rig, speed, steerAngle, delta) {
  rig.angle = (rig.angle + speed * delta) % (Math.PI * 2000)
  for (const part of rig.parts) {
    spin.setFromAxisAngle(part.spinAxis, rig.angle / part.radius)
    if (part.front) spin.premultiply(steer.setFromAxisAngle(part.steerAxis, steerAngle))
    part.node.quaternion.copy(part.base).multiply(spin)
  }
}
