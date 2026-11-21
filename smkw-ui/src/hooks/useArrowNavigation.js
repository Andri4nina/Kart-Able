import { useCallback } from 'react'

const NEXT_KEYS = new Set(['ArrowDown', 'ArrowRight'])
const PREVIOUS_KEYS = new Set(['ArrowUp', 'ArrowLeft'])

// Déplace le focus entre les éléments [data-nav-item] d'un conteneur avec les flèches.
// Base de la future navigation à la manette (croix directionnelle = flèches).
export function useArrowNavigation() {
  return useCallback((event) => {
    const forward = NEXT_KEYS.has(event.key)
    if (!forward && !PREVIOUS_KEYS.has(event.key)) return
    if (event.target instanceof HTMLInputElement) return

    const items = [...event.currentTarget.querySelectorAll('[data-nav-item]:not(:disabled)')]
    if (items.length === 0) return
    const index = items.indexOf(document.activeElement)
    const nextIndex = index === -1 ? 0 : (index + (forward ? 1 : -1) + items.length) % items.length
    items[nextIndex].focus()
    event.preventDefault()
  }, [])
}
