import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { CircleGeometry, MeshBasicMaterial } from 'three'
import { getRaceKart } from '../../game/race/raceSession'
import { useReducedMotion } from '../../hooks/useReducedMotion'

// Sillage d'écume sous le kart sur une voie d'eau (game/track/trackWaterways.js) : une nappe
// blanche qui s'allonge vers l'arrière avec la vitesse. Lue dans l'état du kart chaque frame.
const WAKE_GEOMETRY = new CircleGeometry(1, 20).rotateX(-Math.PI / 2)
const WAKE_MATERIAL = new MeshBasicMaterial({ color: '#f4fdff', transparent: true, opacity: 0.4, depthWrite: false })

export function KartWake({ racerId }) {
  const ref = useRef(null)
  const reducedMotion = useReducedMotion()

  useFrame(({ clock }) => {
    const wake = ref.current
    const kart = getRaceKart(racerId)
    if (!wake) return
    wake.visible = Boolean(kart?.onWater) && kart.sinking === 0
    if (!wake.visible) return
    const speed = Math.min(1, Math.abs(kart.speed) / 28)
    const ripple = reducedMotion ? 0 : Math.sin(clock.elapsedTime * 9) * 0.06
    wake.scale.set(1.5 + speed * 0.5 + ripple, 1, 1.6 + speed * 2.6)
    wake.position.z = -speed * 1.6
  })

  return <mesh ref={ref} geometry={WAKE_GEOMETRY} material={WAKE_MATERIAL} position-y={0.06} visible={false} renderOrder={2} />
}
