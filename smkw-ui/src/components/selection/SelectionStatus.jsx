import { Check, Lock, MousePointer2 } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { statusSwapVariants } from '../../animations/selectionVariants'
import { useTranslation } from '../../i18n/useTranslation'
import { getPlayerColors } from '../players/playerVisuals'

// Statut de sélection d'un joueur : présélection, personnage pris par un autre, ou confirmé.
export function SelectionStatus({ confirmed, reservedBy, colorIndex }) {
  const { t } = useTranslation()
  const state = confirmed ? 'confirmed' : reservedBy ? 'reserved' : 'selecting'

  const { icon: Icon, label, className } = {
    confirmed: {
      icon: Check,
      label: t('selection.confirmed'),
      className: `${getPlayerColors(colorIndex).bg} text-brand-ink`,
    },
    reserved: {
      icon: Lock,
      label: t('selection.reservedBy', { player: reservedBy }),
      className: 'bg-brand-yellow text-brand-ink',
    },
    selecting: {
      icon: MousePointer2,
      label: t('selection.preselected'),
      className: 'bg-white/10 text-white/75',
    },
  }[state]

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={state}
        variants={statusSwapVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={`inline-flex -skew-x-12 items-center px-2 py-0.5 ${className}`}
      >
        <span className="inline-flex skew-x-12 items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
          <Icon aria-hidden="true" className="size-3" strokeWidth={3} />
          {label}
        </span>
      </motion.span>
    </AnimatePresence>
  )
}
