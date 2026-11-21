import { useSyncExternalStore } from 'react'
import { useSettingsStore } from '../stores/settingsStore'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(onChange) {
  const media = window.matchMedia(QUERY)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

const getSnapshot = () => window.matchMedia(QUERY).matches
const getServerSnapshot = () => false

export function isSystemReducedMotion() {
  return getSnapshot()
}

// Source de vérité unique : préférence système, sauf si le joueur force un mode.
// Utilisable côté UI comme côté scène 3D.
export function useReducedMotion() {
  const motion = useSettingsStore((state) => state.motion)
  const system = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  if (motion === 'system') return system
  return motion === 'reduced'
}
