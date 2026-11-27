import { Quaternion, Vector3 } from 'three'
import { detachedFoot } from './driverFeet'

// Pose de pilote assis, calculée sur n'importe quel squelette (Mixamo, Rigify, exports
// Sketchfab...) sans connaître ses axes : les membres sont repérés par leur nom (chaîne
// cuisse > tibia, bras > avant-bras), leur côté par leur position, puis orientés vers une
// direction voulue dans le repère du personnage (regard +Z, haut +Y, gauche +X).
// Les poses sont calculées une fois à la préparation du modèle.
const LEG = /(leg|thigh|tigh|shin)/i
const ARM = /arm/i
const NOT_LIMB = /armature|root/i
const SPINE = /(spine|chest|abdomen|torso)/i
const HEAD = /head/i

const from = new Vector3()
const to = new Vector3()
const direction = new Vector3()
const delta = new Quaternion()
const world = new Quaternion()
const parent = new Quaternion()
const axis = new Vector3()

const firstBoneChild = (bone) => bone?.children.find((child) => child.isBone) ?? null

// Os le plus haut d'une chaîne dont le nom correspond (son parent ne correspond pas).
function chainTops(bones, regex) {
  return bones.filter((bone) => regex.test(bone.name) && !NOT_LIMB.test(bone.name) && !regex.test(bone.parent?.name ?? ''))
}

function limb(root, top) {
  const middle = firstBoneChild(top)
  // Bout de chaîne : os, sinon simple repère (« _end » des exports FBX2glTF, sans os).
  const end = firstBoneChild(middle) ?? middle?.children[0] ?? null
  if (!middle || !end) return null
  root.updateMatrixWorld(true)
  return { top, middle, end, side: Math.sign(top.getWorldPosition(from).x) || 1 }
}

export function findDriverBones(root) {
  const bones = []
  root.traverse((child) => {
    if (child.isBone) bones.push(child)
  })
  const legs = chainTops(bones, LEG).map((bone) => limb(root, bone)).filter(Boolean)
  const arms = chainTops(bones, ARM).map((bone) => limb(root, bone)).filter(Boolean)
  if (legs.length < 2 || arms.length < 2) return null
  for (const leg of legs) leg.foot = detachedFoot(bones, leg)
  return {
    legs: legs.slice(0, 2),
    arms: arms.slice(0, 2),
    spine: chainTops(bones, SPINE)[0] ?? null,
    head: bones.find((bone) => HEAD.test(bone.name)) ?? null,
  }
}

// Oriente `bone` pour que le segment vers `child` suive `x, y, z` (repère du personnage).
function aim(root, bone, child, x, y, z) {
  root.updateMatrixWorld(true)
  bone.getWorldPosition(from)
  child.getWorldPosition(to)
  direction.set(x, y, z).normalize()
  delta.setFromUnitVectors(to.sub(from).normalize(), direction)
  bone.getWorldQuaternion(world)
  bone.parent.getWorldQuaternion(parent)
  bone.quaternion.copy(parent.invert().multiply(delta.multiply(world)))
}

// Rotation ajoutée autour d'un axe du repère du personnage.
function turn(root, bone, ax, ay, az, angle) {
  if (!bone || !angle) return
  root.updateMatrixWorld(true)
  delta.setFromAxisAngle(axis.set(ax, ay, az), angle)
  bone.getWorldQuaternion(world)
  bone.parent.getWorldQuaternion(parent)
  bone.quaternion.copy(parent.invert().multiply(delta.multiply(world)))
}

// `steer` : -1 volant à gauche .. 1 à droite ; `arms` : 'wheel' | 'cheer' | 'panic'.
export function applyDriverPose(root, rig, { steer = 0, arms = 'wheel' }) {
  turn(root, rig.spine, 0, 0, 1, steer * 0.16)
  turn(root, rig.spine, 1, 0, 0, arms === 'cheer' ? -0.15 : 0.12)
  turn(root, rig.head, 0, 1, 0, -steer * 0.4)
  for (const leg of rig.legs) {
    aim(root, leg.top, leg.middle, leg.side * 0.2, 0.08, 1)
    aim(root, leg.middle, leg.end, leg.side * 0.06, -0.6, 1)
  }
  for (const arm of rig.arms) {
    const { side } = arm
    if (arms === 'cheer') {
      aim(root, arm.top, arm.middle, side * 0.45, 1, 0.15)
      aim(root, arm.middle, arm.end, side * 0.15, 1, 0.1)
    } else if (arms === 'panic') {
      aim(root, arm.top, arm.middle, side, 0.5, 0.25)
      aim(root, arm.middle, arm.end, side * 0.6, 0.9, 0.3)
    } else {
      // Le volant tourne : la main du côté opposé au virage monte, l'autre descend.
      const raise = side * steer
      aim(root, arm.top, arm.middle, side * (0.32 - 0.1 * raise), -0.8 + 0.35 * raise, 0.62)
      aim(root, arm.middle, arm.end, -side * (0.28 + 0.1 * raise), 0.12 + 0.25 * raise, 1)
    }
  }
}

export function posedBones(rig) {
  const list = [rig.spine, rig.head].filter(Boolean)
  for (const chain of [...rig.legs, ...rig.arms]) list.push(chain.top, chain.middle)
  return list
}
