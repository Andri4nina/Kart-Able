import { MathUtils, Quaternion, Vector3 } from 'three'
import { applyDriverPose, findDriverBones, posedBones } from './driverPose'

// Pilote animé au volant. À la préparation : poses clés calculées sur le squelette (centre,
// volant à gauche / à droite, bras levés à l'arrivée, bras écartés sur un choc). À chaque
// frame : mélange de ces poses selon l'état du kart (aucune allocation, aucun mixer).
// Modèle sans squelette exploitable : null (le kart l'anime en bloc, voir RacerKart).
const POSES = { center: { steer: 0 }, left: { steer: -1 }, right: { steer: 1 }, cheer: { arms: 'cheer' }, panic: { arms: 'panic' } }
const pelvis = new Vector3()

function snapshot(bones) {
  return bones.map((bone) => bone.quaternion.clone())
}

function restore(bones, quaternions) {
  bones.forEach((bone, i) => bone.quaternion.copy(quaternions[i]))
}

export function createDriverRig(root) {
  const rig = findDriverBones(root)
  if (!rig) return null
  const bones = posedBones(rig)
  const base = snapshot(bones)
  const poses = {}
  for (const [name, spec] of Object.entries(POSES)) {
    restore(bones, base)
    applyDriverPose(root, rig, spec)
    poses[name] = snapshot(bones)
  }
  restore(bones, poses.center)
  root.updateMatrixWorld(true)
  // Bassin (parent des cuisses) : c'est lui qu'on pose sur le siège.
  rig.legs[0].top.parent.getWorldPosition(pelvis)
  const hip = pelvis.clone()

  const state = { steer: 0, cheer: 0, panic: 0 }
  const work = new Quaternion()

  // `input` : { steer -1..1, cheer 0/1, panic 0/1 } ; amorti pour des gestes souples.
  function update(input, delta) {
    state.steer = MathUtils.damp(state.steer, input.steer, 8, delta)
    state.cheer = MathUtils.damp(state.cheer, input.cheer, 5, delta)
    state.panic = MathUtils.damp(state.panic, input.panic, 14, delta)
    const side = state.steer > 0 ? poses.right : poses.left
    const amount = Math.abs(state.steer)
    for (let i = 0; i < bones.length; i += 1) {
      work.copy(poses.center[i])
      if (amount > 1e-3) work.slerp(side[i], amount)
      if (state.panic > 1e-3) work.slerp(poses.panic[i], state.panic)
      if (state.cheer > 1e-3) work.slerp(poses.cheer[i], state.cheer)
      bones[i].quaternion.copy(work)
    }
  }

  return { hip, update }
}
