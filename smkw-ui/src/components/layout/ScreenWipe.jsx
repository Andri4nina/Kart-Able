import { motion } from 'motion/react'
import { wipeTransition } from '../../animations/variants'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useNavigationStore } from '../../stores/navigationStore'

// Balayage plein écran joué quand on entre en jeu ou qu'on en sort
// (une seule div, transform GPU). Remonté via `key` : rien à nettoyer, il finit hors écran.
export function ScreenWipe() {
  const wipeId = useNavigationStore((state) => state.wipeId)
  const reducedMotion = useReducedMotion()

  if (wipeId === 0 || reducedMotion) return null

  return (
    <motion.div
      key={wipeId}
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-0 z-30 w-[140%] -skew-x-12 border-r-[14px] border-brand-yellow bg-brand-red"
      initial={{ x: '-120%' }}
      animate={{ x: '120%' }}
      transition={wipeTransition}
    />
  )
}
