import { addBoneTurn, createBoneMotion } from './boneMotion'
import { findDriverBones } from './driverPose'

// Attente animée des personnages sans animation en boucle (sélection, podium) : ils respirent,
// tournent la tête et balancent un peu les bras. Repérage des os comme pour la pose de pilote ;
// sans squelette exploitable : null (le socle les anime en bloc).
const SPINE = /(spine|chest|abdomen|torso)/i
const HEAD = /head/i

function findIdleBones(root) {
  const rig = findDriverBones(root)
  if (rig) return { spine: rig.spine, head: rig.head, arms: rig.arms }
  const bones = []
  root.traverse((child) => {
    if (child.isBone) bones.push(child)
  })
  return { spine: bones.find((bone) => SPINE.test(bone.name)) ?? null, head: bones.find((bone) => HEAD.test(bone.name)) ?? null, arms: [] }
}

export function createIdleMotion(root, seed = 0) {
  const found = findIdleBones(root)
  const parts = [
    { key: 'spine', motion: createBoneMotion(root, found.spine) },
    { key: 'head', motion: createBoneMotion(root, found.head) },
    ...found.arms.map((arm) => ({ key: 'arm', side: arm.side, motion: createBoneMotion(root, arm.top) })),
  ].filter((part) => part.motion)
  if (!parts.length) return null
  for (const part of parts) part.base = part.motion.bone.quaternion.clone()
  let time = seed

  function update(delta) {
    time += delta
    for (const part of parts) {
      part.motion.bone.quaternion.copy(part.base)
      if (part.key === 'spine') addBoneTurn(part.motion, Math.sin(time * 2) * 0.035, 0, Math.sin(time * 0.9) * 0.03)
      else if (part.key === 'head') addBoneTurn(part.motion, Math.sin(time * 1.3) * 0.06, Math.sin(time * 0.6) * 0.3, Math.sin(time * 0.8) * 0.05)
      else addBoneTurn(part.motion, Math.sin(time * 1.6 + part.side) * 0.08, 0, part.side * (0.03 + Math.sin(time * 2) * 0.03))
    }
  }

  return { update }
}
