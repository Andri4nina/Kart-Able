import { getGroundHeight } from '../../game/track/trackHeight'
import { RAMP_GEOMETRIES, RAMP_MATERIALS } from './rampResources'

// Tremplins d'un circuit (game/track/trackJumps.js) : coin posé sur la route, bandes en travers
// qui montent vers la lèvre lumineuse. Rampe de vol en bleu, sur toute la largeur, devant la
// brèche du deltaplane. Quelques maillages par circuit : pas d'instances.
const STRIPES = [0.2, 0.45, 0.7]

function Ramp({ geometry, ramp }) {
  const style = ramp.glide ? RAMP_MATERIALS.glide : RAMP_MATERIALS.trick
  const y = getGroundHeight(geometry, ramp.x, ramp.z) + 0.02
  const pitch = Math.atan(ramp.height / ramp.length)
  return (
    <group position={[ramp.x, y, ramp.z]} rotation-y={Math.atan2(ramp.tx, ramp.tz)} name={ramp.glide ? 'glide-ramp' : 'trick-ramp'}>
      <mesh geometry={RAMP_GEOMETRIES.wedge} material={style.body} scale={[ramp.width, ramp.height, ramp.length]} castShadow receiveShadow />
      {STRIPES.map((t) => (
        <mesh
          key={t}
          geometry={RAMP_GEOMETRIES.stripe}
          material={style.stripe}
          position={[0, ramp.height * t + 0.03, ramp.length * (t - 0.5)]}
          rotation-x={-pitch}
          scale={[ramp.width * 0.92, 1, 1]}
        />
      ))}
      <mesh geometry={RAMP_GEOMETRIES.lip} material={style.lip} position={[0, ramp.height, ramp.length / 2 - 0.12]} scale={[ramp.width, 1, 1]} />
    </group>
  )
}

export function TrackRamps({ geometry }) {
  if (!geometry.ramps.length) return null
  return (
    <group name="track-ramps">
      {geometry.ramps.map((ramp) => (
        <Ramp key={`ramp-${ramp.distance}-${ramp.x}`} geometry={geometry} ramp={ramp} />
      ))}
    </group>
  )
}
