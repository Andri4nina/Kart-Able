import { useFrame } from '@react-three/fiber'
import { Suspense, useEffect, useRef } from 'react'
import { PREVIEW_STAGE } from '../../config/characterPreview'
import { getDisplayedId, SELECTION_STATUS } from '../../game/selection/selectionRules'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { getMaterial, UNIT_GEOMETRIES } from '../Characters/characterResources'
import { PALETTE, PLAYER_COLORS } from '../World/palette'
import { breathe, hopHeight, swapPose, swayYaw, turntableYaw } from './previewAnimation'

const MODEL_BASE_Y = 0.15

// Preview d'un joueur : socle à sa couleur + modèle de l'élément présélectionné (ou confirmé)
// dans le store de l'écran. Un seul modèle par joueur : changer d'élément le remplace.
// `motion` : { baseYaw, idle: 'sway' (personnage) | 'turntable' (véhicule) }.
// useFrame est nécessaire ici (animation continue), mais ne fait que des calculs simples.
export function PreviewSlot({ playerId, colorIndex, x, scale, useStore, renderModel, motion }) {
  const selection = useStore((state) => state.selections[playerId])
  const reducedMotion = useReducedMotion()
  const pivotRef = useRef(null)
  const timeline = useRef({ swapAt: null, hopAt: null, pendingSwap: false, pendingHop: false })

  const itemId = getDisplayedId(selection)
  const confirmed = selection?.status === SELECTION_STATUS.CONFIRMED

  useEffect(() => {
    timeline.current.pendingSwap = true
  }, [itemId])

  useEffect(() => {
    if (confirmed) timeline.current.pendingHop = true
  }, [confirmed])

  useFrame(({ clock }) => {
    const pivot = pivotRef.current
    if (!pivot) return
    const t = clock.elapsedTime
    const line = timeline.current
    if (line.pendingSwap) Object.assign(line, { swapAt: t, pendingSwap: false })
    if (line.pendingHop) Object.assign(line, { hopAt: t, pendingHop: false })

    const swap = reducedMotion || line.swapAt === null ? { scale: 1, spin: 0 } : swapPose(t - line.swapAt)
    const hop = reducedMotion || line.hopAt === null ? 0 : hopHeight(t - line.hopAt)
    const turning = motion.idle === 'turntable'
    const idle = reducedMotion || (confirmed && !turning) ? 0 : turning ? turntableYaw(t) : swayYaw(t, colorIndex)
    const rest = reducedMotion || turning ? 0 : breathe(t, colorIndex)

    pivot.scale.setScalar(swap.scale)
    pivot.rotation.y = motion.baseYaw + idle + swap.spin
    pivot.position.y = MODEL_BASE_Y + hop + rest
  })

  return (
    <group position={[x, 0, PREVIEW_STAGE.lineupZ]} scale={scale}>
      <mesh geometry={UNIT_GEOMETRIES.cylinder} material={getMaterial(PALETTE.asphalt)} position-y={0.06} scale={[2, 0.12, 2]} />
      <mesh
        geometry={UNIT_GEOMETRIES.cylinder}
        material={getMaterial(PLAYER_COLORS[colorIndex % PLAYER_COLORS.length], { glow: confirmed })}
        position-y={0.135}
        scale={[1.8, 0.03, 1.8]}
      />
      <group ref={pivotRef}>
        {itemId ? (
          <Suspense key={itemId} fallback={null}>
            {renderModel(itemId, playerId)}
          </Suspense>
        ) : null}
      </group>
    </group>
  )
}
