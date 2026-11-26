import { sampleTrack } from './trackLayout'

// Rampes et passages en deltaplane d'un circuit (calcul pur, une fois par circuit), d'après
// config/tracks.js :
// - ramps : [fraction du tour, position latérale -1..1, largeur m ?] : tremplins à figures ;
// - gliders : [fraction du tour, longueur m] : rampe de vol sur toute la largeur, puis la route
//   s'interrompt au-dessus de l'eau sur `longueur` m (un lac est ajouté sous la brèche) : seul
//   le deltaplane, déployé en quittant la rampe, permet de passer.
export const RAMP = Object.freeze({ length: 5.5, height: 1.05, width: 8 })
export const GLIDE_RAMP = Object.freeze({ length: 7, height: 1.9 })
const GAP_SHORE = 4 // m d'eau avant et après la brèche
const GAP_SIDE = 24 // m d'eau de part et d'autre de la route

function rampAt(path, distance, lateral, width, shape, glide) {
  const p = sampleTrack(path, distance)
  return {
    x: p.x - p.tz * lateral,
    z: p.z + p.tx * lateral,
    tx: p.tx,
    tz: p.tz,
    width,
    length: shape.length,
    height: shape.height,
    glide,
    distance,
    index: Math.round(distance / path.step) % path.count,
  }
}

export function placeJumps(track, path) {
  const ramps = (track.ramps ?? []).map(([fraction, side, width = RAMP.width]) => {
    const point = sampleTrack(path, fraction * path.length)
    return rampAt(path, fraction * path.length, side * Math.max(0, point.width / 2 - width / 2 - 1), width, RAMP, false)
  })
  const gaps = new Uint8Array(path.count)
  const gapLakes = []
  for (const [fraction, length] of track.gliders ?? []) {
    const start = fraction * path.length
    ramps.push(rampAt(path, start, 0, sampleTrack(path, start).width + 6, GLIDE_RAMP, true))
    const from = start + GLIDE_RAMP.length / 2 + 0.5
    for (let d = from; d < from + length; d += path.step / 2) gaps[Math.floor(d / path.step) % path.count] = 1
    const mid = sampleTrack(path, from + length / 2)
    gapLakes.push({ x: mid.x, z: mid.z, rx: length / 2 + GAP_SHORE, rz: mid.width / 2 + GAP_SIDE, angle: Math.atan2(mid.tz, mid.tx) })
  }
  return { ramps, gaps, gapLakes }
}

// Rampe sous le point (x, z) : `out.height` (m au-dessus de la route), `out.slope` (pente dans
// la direction (dx, dz)), `out.glide` (rampe de vol). Sans rampe : hauteur 0.
export function readRamp(ramps, x, z, dx, dz, out) {
  out.height = 0
  out.slope = 0
  out.glide = false
  for (const ramp of ramps) {
    const rx = x - ramp.x
    const rz = z - ramp.z
    const along = rx * ramp.tx + rz * ramp.tz
    if (Math.abs(along) > ramp.length / 2 || Math.abs(-rx * ramp.tz + rz * ramp.tx) > ramp.width / 2) continue
    out.height = (ramp.height * (along + ramp.length / 2)) / ramp.length
    out.slope = (ramp.height / ramp.length) * (dx * ramp.tx + dz * ramp.tz)
    out.glide = ramp.glide
    return out
  }
  return out
}
