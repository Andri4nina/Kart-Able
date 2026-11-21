import { useEffect, useState } from 'react'
import { useBindingsStore } from '../stores/bindingsStore'
import { getBindingProfile } from './bindingDefaults'
import { captureGamepadButton, captureKey } from './bindingCapture'

// Assignation interactive : `start(profileId, action, slot)` attend la prochaine touche (ou le
// prochain bouton pour les manettes), l'enregistre via le store et garde le résultat (`notice` :
// assignée, échangée, refusée...) pour l'afficher. La capture s'arrête au démontage.
export function useBindingCapture() {
  const [capture, setCapture] = useState(null)
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    if (!capture) return undefined
    const finish = (result) => {
      setCapture(null)
      setNotice(result)
    }
    const handlers = {
      onInput: (input) => finish(useBindingsStore.getState().assign(capture.profileId, capture.action, capture.slot, input)),
      onCancel: () => finish(null),
    }
    const kind = getBindingProfile(capture.profileId)?.kind
    return kind === 'gamepad' ? captureGamepadButton(handlers) : captureKey(handlers)
  }, [capture])

  const start = (profileId, action, slot) => {
    setNotice(null)
    setCapture({ profileId, action, slot })
  }

  const clear = (profileId, action, slot) => {
    setCapture(null)
    setNotice(useBindingsStore.getState().clear(profileId, action, slot))
  }

  const cancel = () => setCapture(null)

  const reset = (profileId) => {
    setCapture(null)
    useBindingsStore.getState().reset(profileId)
    setNotice({ type: 'reset', profileId })
  }

  return { capture, notice, start, cancel, clear, reset }
}
