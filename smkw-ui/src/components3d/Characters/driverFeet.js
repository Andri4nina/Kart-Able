import { Vector3 } from 'three'

// Pieds rigués en IK (squelettes Quaternius...) : l'os « foot » n'est pas enfant du tibia mais
// de la racine. En pose assise, il resterait au sol sous le kart : on le rattache au bout du
// tibia une fois la pose calculée (driverRig).
const FOOT = /foot/i
const from = new Vector3()
const to = new Vector3()

// Os « foot » du même côté que la jambe, hors de sa chaîne ; null si le pied suit déjà le tibia.
export function detachedFoot(bones, leg) {
  let inChain = false
  leg.end.traverse((bone) => {
    if (FOOT.test(bone.name)) inChain = true
  })
  if (inChain) return null
  return bones.find((bone) => FOOT.test(bone.name) && !FOOT.test(bone.parent?.name ?? '') && Math.sign(bone.getWorldPosition(from).x) === leg.side) ?? null
}

// Place chaque pied détaché au bout de son tibia (pose assise calculée).
export function attachFeet(root, rig) {
  for (const leg of rig.legs) {
    if (!leg.foot) continue
    root.updateMatrixWorld(true)
    leg.end.getWorldPosition(to)
    leg.foot.parent.worldToLocal(to)
    leg.foot.position.copy(to)
  }
}
