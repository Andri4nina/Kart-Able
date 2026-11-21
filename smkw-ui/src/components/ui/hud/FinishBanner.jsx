import { Flag } from 'lucide-react'
import { motion } from 'motion/react'
import { DURATION, EASE_OUT } from '../../../animations/transitions'
import { useTranslation } from '../../../i18n/useTranslation'
import { useRaceStore } from '../../../stores/raceStore'

// Bandeau d'arrivée au centre de la case du joueur : sa place finale. Le kart continue en
// pilote automatique jusqu'à l'écran des résultats.
export function FinishBanner({ playerId }) {
  const { t } = useTranslation()
  const position = useRaceStore((state) => (state.standings[playerId]?.finished ? state.standings[playerId].position : null))
  if (position === null) return null

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <motion.div
        role="status"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1, transition: { duration: DURATION.base, ease: EASE_OUT } }}
        className="flex -skew-x-12 items-center gap-3 bg-brand-ink/90 px-4 py-2 shadow-[6px_6px_0_0_rgb(0_0_0/0.35)] @md:px-6 @md:py-3"
      >
        <Flag aria-hidden="true" className="size-5 skew-x-12 text-brand-yellow @md:size-8" strokeWidth={2.5} />
        <span className="skew-x-12 font-display text-xl uppercase leading-none text-white @md:text-4xl">{t('race.finished')}</span>
        <span className="skew-x-12 font-display text-xl leading-none text-brand-yellow @md:text-4xl">
          {position}
          {t('hud.ordinal', { ordinal: position })}
        </span>
      </motion.div>
    </div>
  )
}
