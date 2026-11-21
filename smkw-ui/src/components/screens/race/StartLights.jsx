import { AnimatePresence, motion } from 'motion/react'
import { DURATION, EASE_OUT } from '../../../animations/transitions'
import { START_LIGHTS } from '../../../config/race'
import { useTranslation } from '../../../i18n/useTranslation'
import { useRaceStore } from '../../../stores/raceStore'

const LAMPS_PER_COLUMN = 2
const shown = { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE_OUT } }
const hidden = { opacity: 0, y: -24, transition: { duration: DURATION.fast, ease: EASE_OUT } }

// Une colonne du portique : deux feux rouges, allumés ensemble.
function LightColumn({ lit }) {
  const lamp = lit ? 'bg-brand-red shadow-[0_0_18px_4px_var(--color-brand-red)]' : 'bg-white/10'
  return (
    <div className="flex flex-col gap-1.5 bg-black/55 p-1.5 sm:gap-2 sm:p-2">
      {Array.from({ length: LAMPS_PER_COLUMN }, (_, row) => (
        <span key={row} className={`block size-6 rounded-full border-2 border-black/70 transition-colors duration-100 sm:size-9 lg:size-11 ${lamp}`} />
      ))}
    </div>
  )
}

// Feux de départ façon Formule 1, au-dessus de toutes les cases : cinq colonnes s'allument une
// par seconde, puis s'éteignent toutes ensemble après un délai imprévisible : « Partez ! ».
export function StartLights() {
  const { t } = useTranslation()
  const counting = useRaceStore((state) => state.phase === 'countdown')
  const lightsOn = useRaceStore((state) => state.lightsOn)
  const go = useRaceStore((state) => state.go)

  return (
    <AnimatePresence>
      {counting || go ? (
        <motion.div
          key="start-lights"
          role="status"
          aria-label={go ? t('race.go') : t('race.lights', { count: lightsOn, total: START_LIGHTS.count })}
          className="pointer-events-none absolute inset-x-0 top-[14%] flex flex-col items-center gap-3"
          initial={hidden}
          animate={shown}
          exit={hidden}
        >
          <div id="start-lights" data-lights-on={lightsOn} className="flex gap-1.5 bg-brand-ink/90 p-2 shadow-[6px_6px_0_0_rgb(0_0_0/0.35)] sm:gap-2.5 sm:p-3">
            {Array.from({ length: START_LIGHTS.count }, (_, column) => (
              <LightColumn key={column} lit={column < lightsOn} />
            ))}
          </div>
          {go ? (
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: DURATION.fast, ease: EASE_OUT } }}
              className="-skew-x-12 bg-brand-yellow px-5 py-1 font-display text-3xl uppercase text-brand-ink shadow-[5px_5px_0_0_rgb(0_0_0/0.35)] sm:text-5xl"
            >
              {t('race.go')}
            </motion.p>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
