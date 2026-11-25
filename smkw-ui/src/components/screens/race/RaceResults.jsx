import { Flag, Trophy } from 'lucide-react'
import { motion } from 'motion/react'
import { pageItem, pageList } from '../../../animations/variants'
import { continueAfterResults } from '../../../game/raceFlow'
import { getCupStandings, hasNextCupRace } from '../../../game/raceSequence'
import { useTranslation } from '../../../i18n/useTranslation'
import { useRaceStore } from '../../../stores/raceStore'
import { useSessionStore } from '../../../stores/sessionStore'
import { formatRaceTime } from '../../../game/format'
import { Button } from '../../ui/Button'

// Écran des résultats d'une course : classement (les 10 premiers et les joueurs locaux), temps,
// et en coupe les points de la course et le total. Puis : course suivante de la coupe, ou vote
// du circuit suivant (START ou A, ou le bouton).
const SHOWN = 10

function ResultRow({ entry, cup, name }) {
  const human = !entry.isBot
  return (
    <motion.li
      variants={pageItem}
      className={`grid shrink-0 grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 px-3 py-1.5 ${human ? 'bg-brand-yellow text-brand-ink' : 'bg-white/5 text-white'}`}
      data-result={entry.id}
    >
      <span className="font-display text-lg leading-none">{entry.rank}</span>
      <span className="truncate font-bold">{name}</span>
      <span className="text-right font-mono text-sm tabular-nums">{cup ? `+${entry.points} · ${entry.total}` : entry.time === null ? '--' : formatRaceTime(entry.time)}</span>
    </motion.li>
  )
}

export function RaceResults() {
  const { t } = useTranslation()
  const results = useRaceStore((state) => state.results)
  const match = useSessionStore((state) => state.match)
  if (!results || !match) return null
  const cup = Boolean(match.cupId)
  const ranked = (cup ? getCupStandings(match, results) : results).map((entry, index) => ({ ...entry, rank: index + 1 }))
  const rows = ranked.filter((entry, index) => index < SHOWN || !entry.isBot)
  const last = cup && !hasNextCupRace(match)
  const nameOf = (entry) => (entry.isBot ? t(`characters.${entry.characterId}.name`) : entry.id)

  return (
    <motion.div variants={pageList} initial="hidden" animate="visible" className="flex max-h-full w-full max-w-lg flex-col gap-3 bg-brand-ink/95 p-5 text-white shadow-[8px_8px_0_0_rgb(0_0_0/0.4)]" id="race-results">
      <motion.header variants={pageItem} className="flex flex-col gap-1">
        <h2 className="inline-flex items-center gap-2 font-display text-3xl uppercase leading-none">
          {cup ? <Trophy aria-hidden="true" className="size-7 text-brand-yellow" strokeWidth={2.5} /> : <Flag aria-hidden="true" className="size-7 text-brand-yellow" strokeWidth={2.5} />}
          {last ? t('results.cupFinal') : t('results.title')}
        </h2>
        <p className="text-sm text-white/70">
          {cup
            ? t('results.cupRound', { cup: t(`cups.${match.cupId}.name`), round: match.round + 1, total: match.playlist.length })
            : t(`tracks.${match.trackId}.name`)}
        </p>
      </motion.header>
      <motion.ol variants={pageList} className="scrollbar-game flex min-h-0 flex-col gap-1 overflow-y-auto">
        {rows.map((entry) => (
          <ResultRow key={entry.id} entry={entry} cup={cup} name={nameOf(entry)} />
        ))}
      </motion.ol>
      <motion.footer variants={pageItem} className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <p className="text-xs font-bold uppercase tracking-widest text-white/60">{t('results.hint')}</p>
        <Button id="results-continue-btn" size="md" showArrow onClick={continueAfterResults}>
          {hasNextCupRace(match) ? t('results.nextRace') : t('results.vote')}
        </Button>
      </motion.footer>
    </motion.div>
  )
}
