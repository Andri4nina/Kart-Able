import { updateTrackIndex } from './trackTracking'

// Kart piloté par une autre machine (réseau local, calcul pur) : il n'est pas simulé ici, il
// glisse vers le dernier état reçu (kart.net, net/netRace.js), prolongé par sa vitesse pour
// masquer le délai entre deux messages ; trop loin (réapparition), il y saute directement.
const FOLLOW = 12 // 1/s
const SNAP_DISTANCE = 10 // m

function wrapAngle(angle) {
  return angle - Math.round(angle / (Math.PI * 2)) * Math.PI * 2
}

export function stepRemoteKart(world, kart, dt) {
  const net = kart.net
  if (!net) return
  net.age += dt
  const lead = Math.min(net.age, 0.25)
  const x = net.x + net.vx * lead
  const z = net.z + net.vz * lead
  const blend = 1 - Math.exp(-FOLLOW * dt)
  const far = Math.hypot(x - kart.x, z - kart.z) > SNAP_DISTANCE
  kart.x = far ? x : kart.x + (x - kart.x) * blend
  kart.z = far ? z : kart.z + (z - kart.z) * blend
  kart.y = far ? net.y : kart.y + (net.y - kart.y) * blend
  kart.yaw += wrapAngle(net.yaw - kart.yaw) * (far ? 1 : blend)
  Object.assign(kart, { vx: net.vx, vz: net.vz, vy: net.vy, speed: net.speed, driftDir: net.driftDir, driftTier: net.driftTier })
  Object.assign(kart, { hop: net.hop, gliding: Boolean(net.gliding), trick: net.trick, trickStyle: net.trickStyle, spin: net.spin, sinking: net.sinking })
  kart.shield = net.shield ? 1 : 0
  kart.boost = net.boostSource ? 0.2 : 0
  kart.boostSource = net.boostSource
  kart.airborne = net.y > 0.3 && (net.gliding || Math.abs(net.vy) > 0.5)
  if (kart.progress.lap !== net.lap || kart.progress.nextGate !== net.nextGate) {
    kart.progress = Object.freeze({ ...kart.progress, lap: net.lap, nextGate: net.nextGate })
  }
  if (net.finished && !kart.finished) {
    kart.finished = true
    kart.finishTime = net.finishTime
    world.finishCount += 1
    kart.finishOrder = world.finishCount
  }
  updateTrackIndex(world.geometry.path, kart)
  // Voie d'eau : déduite de sa position (sillage, tangage), comme pour un kart local.
  kart.onWater = world.geometry.water[kart.trackIndex] === 1 && !kart.airborne
}
