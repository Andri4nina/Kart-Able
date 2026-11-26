import { AnimatePresence, motion } from 'motion/react'
import { DURATION, EASE_OUT } from '../../../animations/transitions'
import { useTranslation } from '../../../i18n/useTranslation'
import { useRaceStore } from '../../../stores/raceStore'

const shown = { opacity: 1, scale: 1, transition: { duration: DURATION.fast, ease: EASE_OUT } }
const exit = { opacity: 0, scale: 1.6, transition: { duration: DURATION.base, ease: EASE_OUT } }

// Compte à rebours du départ, au-dessus de toutes les cases : 3, 2, 1, puis « Partez ! ».
// Chaque chiffre arrive grossi et s'efface en s'agrandissant. Le « 3 » est en jaune : c'est le
// moment d'accélérer pour le départ turbo (config/race.js START_COUNTDOWN).
export function StartCountdown() {
  const { t } = useTranslation()
  const countdown = useRaceStore((state) => state.countdown)
  const go = useRaceStore((state) => state.go)
  const label = go ? t('race.go') : countdown ? String(countdown) : null
  const tone = go || countdown === 3 ? 'bg-brand-yellow text-brand-ink' : 'bg-brand-ink/90 text-white'

  return (
    <div role="status" aria-label={label ? (go ? label : t('race.countdown', { value: countdown })) : undefined} className="pointer-events-none absolute inset-x-0 top-[12%] flex justify-center">
      <AnimatePresence>
        {label ? (
          <motion.p
            key={label}
            id="start-countdown"
            data-countdown={go ? 'go' : countdown}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={shown}
            exit={exit}
            className={`absolute -skew-x-12 px-6 py-1 font-display text-6xl uppercase leading-none shadow-[6px_6px_0_0_rgb(0_0_0/0.35)] sm:text-8xl ${tone}`}
          >
            <span className="inline-block skew-x-12">{label}</span>
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
