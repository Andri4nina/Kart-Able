import { advance, useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { restartRace, setAutopilot } from '../../game/race/raceSession'
import { buildTextState } from '../../game/textState'
import { injectDeviceInput } from '../../input/inputManager'
import { describeSplitScreen } from '../Camera/splitViews'
import { probePreview } from './previewProbe'

const STEP_SECONDS = 1 / 60
const STEP_MS = STEP_SECONDS * 1000

// Hooks de test du workflow "develop-web-game" (docs/TESTING.md) :
// - window.advanceTime(ms)       : bascule en temps manuel et avance de pas fixes de 1/60 s
// - window.render_game_to_text() : état courant du jeu en JSON concis
// - window.resumeRealtime()      : revient à la boucle temps réel (debug manuel)
// - window.setAutopilot(id, on)  : le pilote ordinateur conduit le kart d'un joueur (course)
// - window.restartRace()         : nouveau départ de la course en cours
export function TestBridge() {
  const get = useThree((state) => state.get)

  useEffect(() => {
    let manualTime = 0

    const enterManualTime = (state) => {
      if (state.frameloop === 'never') return
      // setFrameloop('never') arrête l'horloge ; autoStart=false l'empêche de
      // repartir toute seule, pour que chaque pas vaille exactement STEP_SECONDS.
      state.setFrameloop('never')
      state.clock.autoStart = false
      manualTime = 0
    }

    window.advanceTime = (ms = STEP_MS) => {
      const state = get()
      enterManualTime(state)
      const steps = Math.max(1, Math.round(ms / STEP_MS))
      for (let i = 0; i < steps; i += 1) {
        manualTime += STEP_SECONDS
        advance(manualTime, true, get())
      }
    }

    // Simule une action d'un périphérique : ('keyboard-1' | 'keyboard-2' | 'pointer' | 'gamepad-N', action).
    // Une manette inconnue est créée à la volée (permet de tester 8 joueurs sans matériel).
    window.simulatePlayerInput = (deviceId, action) => injectDeviceInput(deviceId, action)

    window.setAutopilot = (racerId, enabled = true) => setAutopilot(racerId, enabled)
    window.restartRace = () => Boolean(restartRace())

    window.resumeRealtime = () => {
      const state = get()
      state.clock.autoStart = true
      state.setFrameloop('always')
    }

    window.render_game_to_text = () => {
      const { camera, scene, frameloop } = get()
      return JSON.stringify({
        ...buildTextState({ camera, scene, timeControl: frameloop === 'never' ? 'manual' : 'realtime' }),
        preview: probePreview(scene, camera),
        splitScreen: describeSplitScreen(),
      })
    }

    return () => {
      delete window.advanceTime
      delete window.simulatePlayerInput
      delete window.resumeRealtime
      delete window.setAutopilot
      delete window.restartRace
      delete window.render_game_to_text
    }
  }, [get])

  return null
}
