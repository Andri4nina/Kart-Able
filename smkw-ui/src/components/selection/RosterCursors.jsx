import { Lock } from 'lucide-react'
import { motion } from 'motion/react'
import { cursorTransition } from '../../animations/variants'
import { getPlayerColors } from '../players/playerVisuals'

// Curseurs des joueurs (P1...P8) posés sur une carte du roster. Chaque puce garde le même
// layoutId d'une carte à l'autre : elle glisse quand le joueur change de présélection.
// `className` : position verticale (par défaut sous le bord haut de la carte).
export function RosterCursors({ cursors, className = 'top-2.5' }) {
  return (
    <div className={`absolute inset-x-2 flex flex-wrap justify-center gap-1 ${className}`}>
      {cursors.map((cursor) => (
        <motion.span
          key={cursor.id}
          layoutId={`cursor-${cursor.id}`}
          transition={cursorTransition}
          className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 font-display text-[10px] leading-none text-brand-ink ${getPlayerColors(cursor.index).bg}`}
        >
          {cursor.confirmed ? <Lock aria-hidden="true" className="size-2.5" strokeWidth={3} /> : null}
          {cursor.id}
        </motion.span>
      ))}
    </div>
  )
}
