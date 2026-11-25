import { Route } from 'lucide-react'
import { motion } from 'motion/react'
import { DURATION, EASE_OUT } from '../../../animations/transitions'
import { useTranslation } from '../../../i18n/useTranslation'
import { useRaceFlowStore } from '../../../stores/raceFlowStore'
import { TrackMinimap } from '../../tracks/TrackMinimap'

// Annonce du circuit élu par le vote (le départ suit, game/raceFlow.js) : nom, carte et voix.
export function TrackVoteReveal() {
  const { t } = useTranslation()
  const winner = useRaceFlowStore((state) => state.winner)
  const votes = useRaceFlowStore((state) => (state.winner ? state.counts[state.winner] ?? 0 : 0))
  if (!winner) return null

  return (
    <motion.div
      role="status"
      id="track-vote-reveal"
      data-winner={winner}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, transition: { duration: DURATION.base, ease: EASE_OUT } }}
      className="flex w-full max-w-sm flex-col items-center gap-3 bg-brand-ink/95 p-6 text-center text-white shadow-[8px_8px_0_0_var(--color-brand-yellow)]"
    >
      <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-brand-yellow">
        <Route aria-hidden="true" className="size-4" strokeWidth={2.5} />
        {t('vote.elected')}
      </span>
      <TrackMinimap trackId={winner} detailed className="aspect-square w-full max-w-48 bg-white/5" />
      <h2 className="font-display text-3xl uppercase leading-none">{t(`tracks.${winner}.name`)}</h2>
      <p className="text-sm text-white/70">{t('vote.votes', { count: votes })}</p>
    </motion.div>
  )
}
