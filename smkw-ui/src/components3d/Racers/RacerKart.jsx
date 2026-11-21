import { useFrame } from '@react-three/fiber'
import { Suspense, useRef } from 'react'
import { MathUtils } from 'three'
import { getCharacterColor, getCharacterScale } from '../../config/characters'
import { MAX_FRAME_DELTA } from '../../config/gameConfig'
import { RACE } from '../../config/race'
import { getRaceKart } from '../../game/race/raceSession'
import { CHARACTER_HEIGHTS } from '../Characters/characterAssets'
import { CharacterModel } from '../Characters/CharacterModel'
import { getVehicleSeat } from '../Vehicles/vehicleAssets'
import { VehicleModel } from '../Vehicles/VehicleModel'
import { KartEffects } from './KartEffects'

// Le corps du kart pivote vers l'intérieur pendant un drift (rad), et s'enfonce dans l'eau.
const DRIFT_ANGLE = 0.38
const DRIFT_LAMBDA = 10
const SINK_DEPTH = 1.6

// Kart d'un pilote (joueur ou ordinateur) : véhicule GLB à la couleur de son personnage, le
// personnage au volant à la taille de son gabarit. Sa position est lue chaque frame dans la
// course (game/race) ; sans course (modes d'arène), il reste sur sa place de départ `slot`.
export function RacerKart({ racer, slot }) {
  const rootRef = useRef(null)
  const bodyRef = useRef(null)
  const seat = getVehicleSeat(racer.vehicleId)

  useFrame((_, delta) => {
    const kart = getRaceKart(racer.id)
    const root = rootRef.current
    const body = bodyRef.current
    if (!kart || !root || !body) return
    const sunk = kart.sinking > 0 ? SINK_DEPTH * (1 - kart.sinking / RACE.respawnDelay) : 0
    root.position.set(kart.x, -sunk, kart.z)
    root.rotation.y = kart.yaw
    const lean = -kart.driftDir * DRIFT_ANGLE
    body.rotation.y = MathUtils.damp(body.rotation.y, lean, DRIFT_LAMBDA, Math.min(delta, MAX_FRAME_DELTA))
  })

  return (
    <group ref={rootRef} name={`racer-${racer.id}`} position={[slot.x, 0, slot.z]} rotation-y={slot.yaw}>
      <group ref={bodyRef}>
        {racer.vehicleId ? (
          <Suspense fallback={null}>
            <VehicleModel vehicleId={racer.vehicleId} paint={getCharacterColor(racer.characterId)} />
          </Suspense>
        ) : null}
        {racer.characterId ? (
          <group position={[0, seat.y, seat.z]}>
            <Suspense fallback={null}>
              <CharacterModel characterId={racer.characterId} height={CHARACTER_HEIGHTS.driver * getCharacterScale(racer.characterId)} />
            </Suspense>
          </group>
        ) : null}
        <KartEffects racerId={racer.id} />
      </group>
    </group>
  )
}
