import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { MeshBasicMaterial, SphereGeometry } from 'three'
import { getRaceKart } from '../../game/race/raceSession'
import { useReducedMotion } from '../../hooks/useReducedMotion'

// Bulles qui montent derrière le kart pendant une plongée (game/track/trackDives.js) : quelques
// petites sphères qui s'élèvent en boucle. Lues dans l'état du kart chaque frame.
const BUBBLE_GEOMETRY = new SphereGeometry(1, 8, 6)
const BUBBLE_MATERIAL = new MeshBasicMaterial({ color: '#e8fbff', transparent: true, opacity: 0.7, depthWrite: false })
const BUBBLES = [
  [-0.35, 0.0, 0.09],
  [0.3, 0.3, 0.07],
  [0.0, 0.55, 0.11],
  [-0.2, 0.75, 0.06],
  [0.4, 0.15, 0.08],
  [0.15, 0.9, 0.05],
]
const RISE = 2.6 // m avant de réapparaître en bas

export function KartBubbles({ racerId }) {
  const groupRef = useRef(null)
  const reducedMotion = useReducedMotion()

  useFrame(({ clock }) => {
    const group = groupRef.current
    const kart = getRaceKart(racerId)
    if (!group) return
    group.visible = Boolean(kart?.underwater) && kart.sinking === 0
    if (!group.visible) return
    const t = reducedMotion ? 0 : clock.elapsedTime
    group.children.forEach((bubble, i) => {
      const [x, phase] = BUBBLES[i]
      const rise = ((t * 1.4 + phase * RISE) % RISE) / RISE
      bubble.position.set(x + Math.sin(t * 3 + i) * 0.08, 0.4 + rise * RISE, -1.1 - rise * 0.6)
      bubble.scale.setScalar(BUBBLES[i][2] * (0.6 + rise))
    })
  })

  return (
    <group ref={groupRef} visible={false}>
      {BUBBLES.map((bubble) => (
        <mesh key={bubble[1]} geometry={BUBBLE_GEOMETRY} material={BUBBLE_MATERIAL} />
      ))}
    </group>
  )
}
