import { Flag, Trophy } from 'lucide-react'
import { motion } from 'motion/react'
import { pageItem, pageList } from '../../../animations/variants'
import { formatRaceTime } from '../../../game/format'
import { continueAfterResults, isNetGuest } from '../../../game/raceFlow'
import { getStandings, hasNextRace } from '../../../game/raceSequence'
import { useTranslation } from '../../../i18n/useTranslation'
import { useRaceStore } from '../../../stores/raceStore'
import { useSessionStore } from '../../../stores/sessionStore'
import { Button } from '../../ui/Button'

// Écran des résultats d'une course : classement de la partie (les 10 premiers et les joueurs
// locaux) avec le temps de la course, ses points et le total cumulé depuis le début de la
// partie. Puis : course suivante du programme, ou vote du circuit suivant (START ou A, ou le
// bouton).
const SHOWN = 10

function ResultRow({ entry, name }) {
  const human = !entry.isBot
  return (
    <motion.li
      variants={pageItem}
      className={`grid shrink-0 grid-cols-[2.5rem_minmax(0,1fr)_auto_auto] items-center gap-3 px-3 py-1.5 ${human ? 'bg-brand-yellow text-brand-ink' : 'bg-white/5 text-white'}`}
      data-result={entry.id}
      data-total={entry.total}
    >
      <span className="font-display text-lg leading-none">{entry.rank}</span>
      <span className="truncate font-bold">{name}</span>
      <span className="text-right font-mono text-xs tabular-nums opacity-70">{entry.time === null ? '--' : formatRaceTime(entry.time)}</span>
      <span className="min-w-16 text-right font-mono text-sm tabular-nums">{`+${entry.points} · ${entry.total}`}</span>
    </motion.li>
  )
}

function useSubtitle(match) {
  const { t } = useTranslation()
  if (!match) return null
  const track = t(`tracks.${match.trackId}.name`)
  if (match.playlist.length < 2) return track
  const round = { round: match.round + 1, total: match.playlist.length }
  return match.cupId ? t('results.cupRound', { cup: t(`cups.${match.cupId}.name`), ...round }) : t('results.round', { track, ...round })
}

export function RaceResults() {
  const { t } = useTranslation()
  const results = useRaceStore((state) => state.results)
  const match = useSessionStore((state) => state.match)
  const subtitle = useSubtitle(match)
  if (!results || !match) return null
  const ranked = getStandings(match, results).map((entry, index) => ({ ...entry, rank: index + 1 }))
  const rows = ranked.filter((entry, index) => index < SHOWN || !entry.isBot)
  const next = hasNextRace(match)
  const overall = !next && (match.playlist.length > 1 || (match.racesDone ?? 0) > 0)
  const nameOf = (entry) => (entry.isBot ? t(`characters.${entry.characterId}.name`) : entry.id)
  const Icon = overall ? Trophy : Flag

  return (
    <motion.div variants={pageList} initial="hidden" animate="visible" className="flex max-h-full w-full max-w-lg flex-col gap-3 bg-brand-ink/95 p-5 text-white shadow-[8px_8px_0_0_rgb(0_0_0/0.4)]" id="race-results">
      <motion.header variants={pageItem} className="flex flex-col gap-1">
        <h2 className="inline-flex items-center gap-2 font-display text-3xl uppercase leading-none">
          <Icon aria-hidden="true" className="size-7 text-brand-yellow" strokeWidth={2.5} />
          {overall ? t('results.overall') : t('results.title')}
        </h2>
        <p className="text-sm text-white/70">{subtitle}</p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">{t('results.pointsLegend', { races: (match.racesDone ?? 0) + 1 })}</p>
      </motion.header>
      <motion.ol variants={pageList} className="scrollbar-game flex min-h-0 flex-col gap-1 overflow-y-auto">
        {rows.map((entry) => (
          <ResultRow key={entry.id} entry={entry} name={nameOf(entry)} />
        ))}
      </motion.ol>
      <motion.footer variants={pageItem} className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <p className="text-xs font-bold uppercase tracking-widest text-white/60">{t('results.hint')}</p>
        {isNetGuest() ? (
          <p className="bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-widest">{t('lan.lobby.waitingHost')}</p>
        ) : (
          <Button id="results-continue-btn" size="md" showArrow onClick={continueAfterResults}>
            {next ? t('results.nextRace') : t('results.vote')}
          </Button>
        )}
      </motion.footer>
    </motion.div>
  )
}
