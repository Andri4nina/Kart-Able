import { useEffect, useRef } from 'react'
import { useTelemetryStore } from '../stores/telemetryStore'

// Abonnement transitoire à la télémétrie : le listener écrit directement dans le DOM
// (via des refs) au lieu de provoquer un re-render React à chaque frame.
export function useTelemetryListener(listener) {
  const listenerRef = useRef(listener)

  useEffect(() => {
    listenerRef.current = listener
  })

  useEffect(() => {
    listenerRef.current(useTelemetryStore.getState())
    return useTelemetryStore.subscribe((state) => listenerRef.current(state))
  }, [])
}
