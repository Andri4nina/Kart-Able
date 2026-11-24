import { useFrame } from '@react-three/fiber'
import { Suspense, useRef, useState } from 'react'
import { getCharacterColor, getCharacterScale } from '../../config/characters'
import { MAX_FRAME_DELTA } from '../../config/gameConfig'
import { getRaceKart } from '../../game/race/raceSession'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { CHARACTER_HEIGHTS } from '../Characters/characterAssets'
import { CharacterModel } from '../Characters/CharacterModel'
import { getVehicleSeat } from '../Vehicles/vehicleAssets'
import { VehicleModel } from '../Vehicles/VehicleModel'
import { KartEffects } from './KartEffects'
import { writeKartPose } from './kartPose'

// Kart d'un pilote (joueur ou ordinateur) : véhicule GLB à la couleur de son personnage, le
// personnage assis au volant à la taille de son gabarit. Sa position est lue chaque frame dans
// la course (game/race) ; sans course (modes d'arène), il reste sur sa place de départ `slot`.
// L'attitude (saut, glisse, roulis, secousse) et les gestes du pilote : kartPose.js.
export function RacerKart({ racer, slot }) {
  const rootRef = useRef(null)
  const bodyRef = useRef(null)
  const driverRef = useRef(null)
  // Objets stables modifiés en place chaque frame (aucune allocation, aucun re-render).
  const [driverInput] = useState(() => ({ steer: 0, cheer: 0, panic: 0 }))
  const [visual] = useState(() => ({ slip: 0, roll: 0, pitch: 0, phase: 0, idle: 0 }))
  const reducedMotion = useReducedMotion()
  const seat = getVehicleSeat(racer.vehicleId)

  useFrame((_, delta) => {
    const kart = getRaceKart(racer.id)
    if (!kart || !rootRef.current || !bodyRef.current || !driverRef.current) return
    writeKartPose(kart, Math.min(delta, MAX_FRAME_DELTA), reducedMotion, visual, {
      root: rootRef.current,
      body: bodyRef.current,
      driver: driverRef.current,
      input: driverInput,
    })
  })

  return (
    <group ref={rootRef} name={`racer-${racer.id}`} position={[slot.x, slot.y ?? 0, slot.z]} rotation-y={slot.yaw}>
      <group ref={bodyRef}>
        {racer.vehicleId ? (
          <Suspense fallback={null}>
            <VehicleModel vehicleId={racer.vehicleId} paint={getCharacterColor(racer.characterId)} />
          </Suspense>
        ) : null}
        <group ref={driverRef} position={[0, seat.y, seat.z]}>
          {racer.characterId ? (
            <Suspense fallback={null}>
              <CharacterModel
                characterId={racer.characterId}
                height={CHARACTER_HEIGHTS.driver * getCharacterScale(racer.characterId)}
                driver={driverInput}
              />
            </Suspense>
          ) : null}
        </group>
        <KartEffects racerId={racer.id} />
      </group>
    </group>
  )
}
