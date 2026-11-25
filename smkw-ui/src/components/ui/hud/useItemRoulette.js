import { useEffect, useState } from 'react'
import { useReducedMotion } from '../../../hooks/useReducedMotion'
import { ROULETTE_ORDER } from './itemIcons'

// Roulette à suspense d'un tirage d'objet : les icônes défilent vite puis ralentissent jusqu'à
// la fin du tirage (`rollTime` s, publié par la course), dans un ordre au hasard, sans répéter
// deux fois la même. Renvoie { id, step } (step change à chaque cran : animation du cran).
// En mouvement réduit : pas de défilement (une seule icône fixe).
const FAST_MS = 45
const SLOW_MS = 330

export function useItemRoulette(rolling, rollTime) {
  const reducedMotion = useReducedMotion()
  const [state, setState] = useState({ id: ROULETTE_ORDER[0], step: 0 })

  useEffect(() => {
    if (!rolling || reducedMotion) return undefined
    const start = performance.now()
    const total = Math.max(0.3, rollTime ?? 1.3) * 1000
    let timer = null
    const tick = () => {
      setState((previous) => {
        const others = ROULETTE_ORDER.filter((id) => id !== previous.id)
        return { id: others[Math.floor(Math.random() * others.length)], step: previous.step + 1 }
      })
      const progress = Math.min(1, (performance.now() - start) / total)
      timer = setTimeout(tick, FAST_MS + (SLOW_MS - FAST_MS) * progress ** 2.2)
    }
    tick()
    return () => clearTimeout(timer)
  }, [rolling, rollTime, reducedMotion])

  return state
}
