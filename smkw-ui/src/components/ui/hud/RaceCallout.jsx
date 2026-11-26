import { CircleAlert, Flag, OctagonAlert, RotateCcw } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { DURATION, EASE_OUT } from '../../../animations/transitions'
import { useTranslation } from '../../../i18n/useTranslation'
import { useRaceStore } from '../../../stores/raceStore'
import { useSessionStore } from '../../../stores/sessionStore'

// Annonces au centre de la case d'un joueur, comme les jeux de kart de salon :
// - nouveau tour (« Tour 2 ») et « Dernier tour ! » pendant LAP_SHOWN ms ;
// - « Faux départ » tant que le moteur est calé ; « Sens interdit » tant qu'on roule à l'envers.
// L'alerte la plus urgente l'emporte. Arrivé : rien (FinishBanner prend le relais).
const LAP_SHOWN = 2200

function useLapAnnounce(playerId) {
  const lap = useRaceStore((state) => state.standings[playerId]?.lap ?? 0)
  const previous = useRef(lap)
  const [shown, setShown] = useState(null)
  useEffect(() => {
    const grew = previous.current < lap && previous.current >= 1
    previous.current = lap
    if (!grew) return undefined
    setShown(lap)
    const timer = setTimeout(() => setShown(null), LAP_SHOWN)
    return () => clearTimeout(timer)
  }, [lap])
  return shown
}

function pickCallout(entry, lap, laps) {
  if (!entry || entry.finished) return null
  if (entry.stalled) return { id: 'falseStart', icon: OctagonAlert, tone: 'bg-brand-red' }
  if (entry.wrongWay) return { id: 'wrongWay', icon: RotateCcw, tone: 'bg-brand-red' }
  if (lap === null) return null
  if (lap === laps) return { id: 'finalLap', icon: Flag, tone: 'bg-brand-yellow text-brand-ink' }
  return { id: `lap${lap}`, key: 'newLap', icon: CircleAlert, tone: 'bg-brand-ink/90' }
}

export function RaceCallout({ playerId }) {
  const { t } = useTranslation()
  const entry = useRaceStore((state) => state.standings[playerId])
  const laps = useSessionStore((state) => state.match?.laps ?? 0)
  const lap = useLapAnnounce(playerId)
  const callout = pickCallout(entry, lap, laps)
  const Icon = callout?.icon

  return (
    <div className="pointer-events-none absolute inset-x-0 top-[22%] flex justify-center">
      <AnimatePresence>
        {callout ? (
          <motion.div
            key={callout.id}
            role="status"
            data-callout={callout.key ?? callout.id}
            initial={{ opacity: 0, scale: 1.4 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: DURATION.base, ease: EASE_OUT } }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: DURATION.fast } }}
            className={`flex -skew-x-12 items-center gap-2 px-4 py-1.5 text-white shadow-[6px_6px_0_0_rgb(0_0_0/0.35)] @md:gap-3 @md:px-6 @md:py-2.5 ${callout.tone}`}
          >
            <Icon aria-hidden="true" className="size-5 skew-x-12 @md:size-8" strokeWidth={2.5} />
            <span className="skew-x-12 font-display text-xl uppercase leading-none @md:text-4xl">
              {t(`race.callout.${callout.key ?? callout.id}`, { lap })}
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
