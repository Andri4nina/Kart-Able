import { Quaternion, Vector3 } from 'three'

// Rotations ajoutées à un os autour des axes du personnage (X gauche, Y haut, Z regard),
// par-dessus sa pose du moment : animation procédurale sans connaître les axes du squelette.
// Les axes sont ramenés dans le repère de l'os une fois, dans la pose de référence.
const AXES = [new Vector3(1, 0, 0), new Vector3(0, 1, 0), new Vector3(0, 0, 1)]
const world = new Quaternion()
const step = new Quaternion()

export function createBoneMotion(root, bone) {
  if (!bone) return null
  root.updateMatrixWorld(true)
  bone.getWorldQuaternion(world)
  root.getWorldQuaternion(step)
  const toBone = world.invert().multiply(step)
  const axes = AXES.map((axis) => axis.clone().applyQuaternion(toBone).normalize())
  return { bone, axes }
}

// `pitch` (autour de X : en avant si positif), `yaw` (autour de Y), `roll` (autour de Z).
export function addBoneTurn(motion, pitch, yaw, roll) {
  if (!motion) return
  const { bone, axes } = motion
  if (pitch) bone.quaternion.multiply(step.setFromAxisAngle(axes[0], pitch))
  if (yaw) bone.quaternion.multiply(step.setFromAxisAngle(axes[1], yaw))
  if (roll) bone.quaternion.multiply(step.setFromAxisAngle(axes[2], roll))
}
