import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { MeshStandardMaterial } from 'three'
import { BOOSTS } from '../../config/kartTuning'
import { getRaceKart } from '../../game/race/raceSession'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { UNIT_GEOMETRIES } from '../Characters/characterResources'
import { PALETTE } from '../World/palette'
import { FLAME_GEOMETRY, FLAME_STYLES, GLOW_GEOMETRY, RING_GEOMETRY, RING_MATERIAL, SPARK_GLOWS, writeFlame } from './kartFlame'

// Retours visuels attachés au kart, lus dans son état à chaque frame (aucun re-render) :
// - deux réacteurs à l'arrière pendant un turbo (flamme à trois couches, couleur de la source),
//   onde de choc à l'allumage ; les braises et la fumée sont des particules (Effects) ;
// - lueur aux roues arrière pendant un drift, à la couleur du palier (blanc, bleu, orange) ;
// - bulle translucide tant que l'objet Bulle protège le kart.
const REAR = -0.95
const EXHAUSTS = [-0.28, 0.28]
const BUBBLE_MATERIAL = new MeshStandardMaterial({ color: PALETTE.sky, emissive: PALETTE.sky, emissiveIntensity: 0.4, transparent: true, opacity: 0.28, depthWrite: false })
const GLOW_SIZES = [0.14, 0.26, 0.34]

function Exhaust({ x, register }) {
  return (
    <group position={[x, 0.38, REAR]} rotation-x={-Math.PI / 2} ref={register} visible={false}>
      <mesh name="outer" geometry={FLAME_GEOMETRY} material={FLAME_STYLES.nitro.outer} />
      <mesh name="mid" geometry={FLAME_GEOMETRY} material={FLAME_STYLES.nitro.mid} />
      <mesh name="core" geometry={FLAME_GEOMETRY} material={FLAME_STYLES.nitro.core} />
    </group>
  )
}

export function KartEffects({ racerId }) {
  const exhaustsRef = useRef([])
  const stateRef = useRef({ phase: 0, ring: 0, boosting: false })
  const leftGlowRef = useRef(null)
  const rightGlowRef = useRef(null)
  const ringRef = useRef(null)
  const bubbleRef = useRef(null)
  // Anneau propre au kart : son opacité varie (le matériau partagé reste intact).
  const [ringMaterial] = useState(() => RING_MATERIAL.clone())
  useEffect(() => () => ringMaterial.dispose(), [ringMaterial])
  const reducedMotion = useReducedMotion()
  const register = (index) => (group) => {
    exhaustsRef.current[index] = group ? { group, outer: group.children[0], mid: group.children[1], core: group.children[2] } : null
  }

  useFrame((_, delta) => {
    const kart = getRaceKart(racerId)
    const ring = ringRef.current
    const exhausts = exhaustsRef.current
    const state = stateRef.current
    if (!ring || exhausts.length < 2 || !exhausts[0] || !exhausts[1]) return
    state.phase += delta * 40
    if (bubbleRef.current) bubbleRef.current.visible = Boolean(kart && kart.shield > 0)
    const drifting = Boolean(kart?.driftDir) && kart.sinking === 0 && !kart.airborne
    const glows = [leftGlowRef.current, rightGlowRef.current]
    glows.forEach((glow, side) => {
      if (!glow) return
      glow.visible = drifting
      if (!drifting) return
      glow.material = SPARK_GLOWS[kart.driftTier]
      glow.scale.setScalar(GLOW_SIZES[kart.driftTier] * (0.7 + 0.3 * Math.abs(Math.sin(state.phase * (side ? 1.3 : 1)))))
    })

    const boosting = Boolean(kart && kart.boost > 0 && kart.sinking === 0)
    if (boosting && !state.boosting) state.ring = 1
    state.boosting = boosting
    state.ring = Math.max(0, state.ring - delta * 3.5)
    ring.visible = state.ring > 0 && !reducedMotion
    ring.scale.setScalar(0.8 + (1 - state.ring) * 3.2)
    ring.material.opacity = state.ring
    const style = FLAME_STYLES[BOOSTS[kart?.boostSource]?.effect] ?? FLAME_STYLES.nitro
    const power = boosting ? Math.min(1, kart.boost / 0.35) : 0
    exhausts.forEach((parts, index) => {
      parts.group.visible = boosting
      if (boosting) writeFlame(parts, style, power, reducedMotion ? 0.5 : Math.abs(Math.sin(state.phase * (1.1 + index * 0.37))))
    })
  })

  return (
    <group name="kart-effects">
      <mesh ref={bubbleRef} geometry={UNIT_GEOMETRIES.sphere} material={BUBBLE_MATERIAL} position={[0, 0.7, 0]} scale={[2.4, 2.1, 2.9]} visible={false} />
      <mesh ref={leftGlowRef} geometry={GLOW_GEOMETRY} material={SPARK_GLOWS[0]} position={[-0.55, 0.14, REAR + 0.1]} visible={false} />
      <mesh ref={rightGlowRef} geometry={GLOW_GEOMETRY} material={SPARK_GLOWS[0]} position={[0.55, 0.14, REAR + 0.1]} visible={false} />
      {EXHAUSTS.map((x, index) => (
        <Exhaust key={x} x={x} register={register(index)} />
      ))}
      <mesh ref={ringRef} geometry={RING_GEOMETRY} material={ringMaterial} position={[0, 0.45, REAR - 0.3]} visible={false} />
    </group>
  )
}
