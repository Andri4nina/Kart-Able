import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { MeshStandardMaterial } from 'three'
import { BOOSTS } from '../../config/kartTuning'
import { getRaceKart } from '../../game/race/raceSession'
import { getMaterial, UNIT_GEOMETRIES } from '../Characters/characterResources'
import { PALETTE } from '../World/palette'

// Retours visuels de conduite, lus dans l'état du kart à chaque frame (aucun re-render) :
// - étincelles aux roues arrière pendant un drift, couleur et taille selon le palier chargé
//   (blanc : rien encore, bleu, orange, violet : mini-turbo 1, 2, 3), qui crépitent ;
// - flamme à l'arrière pendant un turbo, à la couleur de sa source, qui faiblit à la fin ;
// - bulle translucide tant que l'objet Bulle protège le kart.
const SPARK_MATERIALS = [PALETTE.white, PALETTE.blue, PALETTE.orange, PALETTE.purple].map((color) => getMaterial(color, { glow: true }))
const SPARK_SIZES = [0.12, 0.22, 0.3, 0.38]
const FLAME_MATERIALS = Object.fromEntries(['blue', 'orange', 'purple'].map((key) => [key, getMaterial(PALETTE[key], { glow: true })]))
const FLAME_CORE = getMaterial(PALETTE.yellow, { glow: true })
const REAR = -0.95
// Bulle (objet) : sphère translucide autour du kart et du pilote.
const BUBBLE_MATERIAL = new MeshStandardMaterial({ color: PALETTE.sky, emissive: PALETTE.sky, emissiveIntensity: 0.4, transparent: true, opacity: 0.28, depthWrite: false })

function showSpark(spark, tier, flicker) {
  spark.material = SPARK_MATERIALS[tier]
  spark.scale.setScalar(SPARK_SIZES[tier] * flicker)
}

export function KartEffects({ racerId }) {
  const leftRef = useRef(null)
  const rightRef = useRef(null)
  const flameRef = useRef(null)
  const coreRef = useRef(null)
  const bubbleRef = useRef(null)
  const phase = useRef(0)

  useFrame((_, delta) => {
    const kart = getRaceKart(racerId)
    const left = leftRef.current
    const right = rightRef.current
    const flame = flameRef.current
    const core = coreRef.current
    if (!left || !right || !flame || !core) return
    phase.current += delta * 40
    if (bubbleRef.current) bubbleRef.current.visible = Boolean(kart && kart.shield > 0)
    const drifting = Boolean(kart?.driftDir) && kart.sinking === 0
    left.visible = drifting
    right.visible = drifting
    if (drifting) {
      showSpark(left, kart.driftTier, 0.75 + 0.25 * Math.abs(Math.sin(phase.current)))
      showSpark(right, kart.driftTier, 0.75 + 0.25 * Math.abs(Math.cos(phase.current * 1.3)))
    }
    const boosting = Boolean(kart && kart.boost > 0 && kart.sinking === 0)
    flame.visible = boosting
    core.visible = boosting
    if (!boosting) return
    const power = Math.min(1, kart.boost / 0.4) * (0.85 + 0.15 * Math.sin(phase.current))
    flame.material = FLAME_MATERIALS[BOOSTS[kart.boostSource]?.effect] ?? FLAME_MATERIALS.orange
    flame.scale.set(0.42 * power, 0.95 * power, 0.42 * power)
    core.scale.set(0.22 * power, 0.55 * power, 0.22 * power)
  })

  return (
    <group name="kart-effects">
      <mesh ref={bubbleRef} geometry={UNIT_GEOMETRIES.sphere} material={BUBBLE_MATERIAL} position={[0, 0.7, 0]} scale={[2.4, 2.1, 2.9]} visible={false} />
      <mesh ref={leftRef} geometry={UNIT_GEOMETRIES.sphere} material={SPARK_MATERIALS[0]} position={[-0.5, 0.12, REAR]} visible={false} />
      <mesh ref={rightRef} geometry={UNIT_GEOMETRIES.sphere} material={SPARK_MATERIALS[0]} position={[0.5, 0.12, REAR]} visible={false} />
      <mesh ref={flameRef} geometry={UNIT_GEOMETRIES.cone} material={FLAME_CORE} position={[0, 0.35, REAR - 0.4]} rotation-x={-Math.PI / 2} visible={false} />
      <mesh ref={coreRef} geometry={UNIT_GEOMETRIES.cone} material={FLAME_CORE} position={[0, 0.35, REAR - 0.3]} rotation-x={-Math.PI / 2} visible={false} />
    </group>
  )
}
