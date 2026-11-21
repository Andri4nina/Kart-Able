import { PerspectiveCamera } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { MathUtils, Vector3 } from 'three'
import { MAX_FRAME_DELTA } from '../../config/gameConfig'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { getScreenMeta } from '../../navigation/screens'
import { selectCurrentScreen, useNavigationStore } from '../../stores/navigationStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { CAMERA_BEHAVIORS } from './cameraBehaviors'

const POSITION_LAMBDA = 2.6
const TARGET_LAMBDA = 3.2
const FOV_LAMBDA = 4

// Vecteurs réutilisés : aucune allocation par frame.
const desiredPosition = new Vector3()
const desiredTarget = new Vector3()
const behaviorContext = { time: 0, aspect: 1, reducedMotion: false }

function dampVector(current, goal, lambda, delta) {
  current.set(
    MathUtils.damp(current.x, goal.x, lambda, delta),
    MathUtils.damp(current.y, goal.y, lambda, delta),
    MathUtils.damp(current.z, goal.z, lambda, delta),
  )
}

// Caméra par défaut de la scène. Lit l'écran courant et le comportement associé
// sans s'abonner (getState dans useFrame) : aucun re-render lors des transitions.
export function CameraRig() {
  const cameraRef = useRef(null)
  const lookTarget = useRef(new Vector3())
  const initialized = useRef(false)
  const reducedMotion = useReducedMotion()

  useFrame((state, delta) => {
    const camera = cameraRef.current
    if (!camera) return

    const screen = selectCurrentScreen(useNavigationStore.getState())
    const behavior = CAMERA_BEHAVIORS[getScreenMeta(screen).camera] ?? CAMERA_BEHAVIORS.menu
    behaviorContext.time = state.clock.elapsedTime
    behaviorContext.aspect = state.size.width / Math.max(1, state.size.height)
    behaviorContext.reducedMotion = reducedMotion
    behavior.update(behaviorContext, desiredPosition, desiredTarget)
    const desiredFov = behavior.fov ?? useSettingsStore.getState().fov
    const previousFov = camera.fov

    if (reducedMotion || !initialized.current) {
      camera.position.copy(desiredPosition)
      lookTarget.current.copy(desiredTarget)
      camera.fov = desiredFov
      initialized.current = true
    } else {
      const dt = Math.min(delta, MAX_FRAME_DELTA)
      dampVector(camera.position, desiredPosition, POSITION_LAMBDA, dt)
      dampVector(lookTarget.current, desiredTarget, TARGET_LAMBDA, dt)
      camera.fov = MathUtils.damp(camera.fov, desiredFov, FOV_LAMBDA, dt)
    }

    camera.lookAt(lookTarget.current)
    if (Math.abs(camera.fov - previousFov) > 1e-4) camera.updateProjectionMatrix()
  })

  return <PerspectiveCamera ref={cameraRef} makeDefault near={0.1} far={250} />
}
