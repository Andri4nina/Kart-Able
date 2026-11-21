import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { getDriftTier } from '../../game/race/kartPhysics'
import { getRaceKart } from '../../game/race/raceSession'
import { getMaterial, UNIT_GEOMETRIES } from '../Characters/characterResources'
import { PALETTE } from '../World/palette'

// Retours visuels de conduite, lus dans l'état du kart à chaque frame (aucun re-render) :
// - étincelles aux roues arrière pendant un drift, couleur et taille selon le palier chargé
//   (blanc : rien encore, bleu : petit turbo, orange : grand turbo) ;
// - flamme à l'arrière pendant un turbo.
const SPARK_MATERIALS = [getMaterial(PALETTE.white, { glow: true }), getMaterial(PALETTE.sky, { glow: true }), getMaterial(PALETTE.orange, { glow: true })]
const SPARK_SIZES = [0.16, 0.24, 0.32]
const FLAME_MATERIAL = getMaterial(PALETTE.yellow, { glow: true })
const REAR = -0.95

function showSpark(spark, tier) {
  spark.material = SPARK_MATERIALS[tier]
  spark.scale.setScalar(SPARK_SIZES[tier])
}

export function KartEffects({ racerId }) {
  const leftRef = useRef(null)
  const rightRef = useRef(null)
  const flameRef = useRef(null)

  useFrame(() => {
    const kart = getRaceKart(racerId)
    const left = leftRef.current
    const right = rightRef.current
    const flame = flameRef.current
    if (!left || !right || !flame) return
    const drifting = Boolean(kart?.driftDir) && kart.sinking === 0
    left.visible = drifting
    right.visible = drifting
    if (drifting) {
      const tier = getDriftTier(kart.driftCharge)
      showSpark(left, tier)
      showSpark(right, tier)
    }
    flame.visible = Boolean(kart && kart.boost > 0 && kart.sinking === 0)
  })

  return (
    <group name="kart-effects">
      <mesh ref={leftRef} geometry={UNIT_GEOMETRIES.sphere} material={SPARK_MATERIALS[0]} position={[-0.5, 0.12, REAR]} visible={false} />
      <mesh ref={rightRef} geometry={UNIT_GEOMETRIES.sphere} material={SPARK_MATERIALS[0]} position={[0.5, 0.12, REAR]} visible={false} />
      <mesh
        ref={flameRef}
        geometry={UNIT_GEOMETRIES.cone}
        material={FLAME_MATERIAL}
        position={[0, 0.35, REAR - 0.35]}
        rotation-x={-Math.PI / 2}
        scale={[0.4, 0.8, 0.4]}
        visible={false}
      />
    </group>
  )
}
