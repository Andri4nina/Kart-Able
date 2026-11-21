import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { Color } from 'three'
import { MAX_FRAME_DELTA } from '../../config/gameConfig'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { getScreenMeta, isSelectionScreen } from '../../navigation/screens'
import { useMatchSetupStore } from '../../stores/matchSetupStore'
import { selectCurrentScreen, useNavigationStore } from '../../stores/navigationStore'
import { BlobShadow } from './BlobShadow'
import { GEOMETRIES, MATERIALS } from './demoResources'
import { MODE_COLORS, PALETTE } from './palette'
import { PODIUM_TOP } from './Podium'

const BASE_Y = 2
const BOB_AMPLITUDE = 0.18
const HALO_TILT = Math.PI / 2 - 0.35
const COLOR_LAMBDA = 6

const DEFAULT_COLOR = new Color(PALETTE.yellow)
const MODE_TARGETS = Object.fromEntries(Object.entries(MODE_COLORS).map(([id, hex]) => [id, new Color(hex)]))

function colorDistance(a, b) {
  return Math.abs(a.r - b.r) + Math.abs(a.g - b.g) + Math.abs(a.b - b.b)
}

// Couleur visée : celle du mode choisi pendant le parcours du menu, sinon la couleur de marque.
function getTargetColor() {
  const screen = selectCurrentScreen(useNavigationStore.getState())
  if (getScreenMeta(screen).step === null) return DEFAULT_COLOR
  return MODE_TARGETS[useMatchSetupStore.getState().modeId] ?? DEFAULT_COLOR
}

// Objet vitrine : rotation + flottement calculés depuis l'horloge (déterministe),
// aucun état React. En mouvement réduit, la pose reste fixe et la couleur change sans fondu.
export function ShowcaseGem() {
  const gemRef = useRef(null)
  const haloRef = useRef(null)
  const shadowRef = useRef(null)
  const reducedMotion = useReducedMotion()
  // Masquée sur les écrans de sélection : les previews prennent la vedette.
  const hidden = useNavigationStore((state) => isSelectionScreen(selectCurrentScreen(state)))

  useFrame(({ clock }, delta) => {
    const t = reducedMotion ? 0 : clock.elapsedTime
    const bob = Math.sin(t * 1.6) * BOB_AMPLITUDE

    gemRef.current.position.y = BASE_Y + bob
    gemRef.current.rotation.set(Math.sin(t * 0.5) * 0.15, t * 0.7, 0)
    haloRef.current.position.y = BASE_Y + bob * 0.5
    haloRef.current.rotation.y = t * -0.9
    shadowRef.current.scale.setScalar(1.1 - bob)

    const material = MATERIALS.gem
    const target = getTargetColor()
    if (!material.color.equals(target)) {
      const blend = reducedMotion ? 1 : 1 - Math.exp(-COLOR_LAMBDA * Math.min(delta, MAX_FRAME_DELTA))
      material.color.lerp(target, blend)
      if (colorDistance(material.color, target) < 0.002) material.color.copy(target)
      material.emissive.copy(material.color)
    }
  })

  return (
    <group userData={{ kind: 'showcase' }} visible={!hidden}>
      <mesh ref={gemRef} name="showcase-gem" geometry={GEOMETRIES.gem} material={MATERIALS.gem} position-y={BASE_Y} />
      <group ref={haloRef} position-y={BASE_Y}>
        <mesh geometry={GEOMETRIES.halo} material={MATERIALS.white} rotation-x={HALO_TILT} />
      </group>
      <BlobShadow ref={shadowRef} y={PODIUM_TOP + 0.01} scale={1.1} />
    </group>
  )
}
