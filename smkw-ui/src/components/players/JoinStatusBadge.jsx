import { CircleCheck } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { statusPopVariants } from '../../animations/variants'
import { useTranslation } from '../../i18n/useTranslation'

// Statut d'entrée d'un joueur : "Arrivée" pendant l'animation, puis badge READY (pop).
export function JoinStatusBadge({ joining, colorClass }) {
  const { t } = useTranslation()
  return (
    <div className="flex h-7 items-center lg:h-6">
      <AnimatePresence mode="wait" initial={false}>
        {joining ? (
          <motion.span
            key="joining"
            variants={statusPopVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/60"
          >
            {t('local.joining')}
          </motion.span>
        ) : (
          <motion.span
            key="ready"
            variants={statusPopVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`inline-flex -skew-x-12 items-center px-3 py-1 text-brand-ink ${colorClass}`}
          >
            <span className="inline-flex skew-x-12 items-center gap-1.5 font-display text-sm uppercase leading-none">
              <CircleCheck aria-hidden="true" className="size-4" strokeWidth={3} />
              {t('local.ready')}
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}
