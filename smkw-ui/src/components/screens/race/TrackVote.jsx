import { Check, Vote } from 'lucide-react'
import { motion } from 'motion/react'
import { pageItem, pageList } from '../../../animations/variants'
import { SELECTION_STATUS } from '../../../game/selection/selectionRules'
import { useTranslation } from '../../../i18n/useTranslation'
import { useRaceFlowStore } from '../../../stores/raceFlowStore'
import { useSessionStore } from '../../../stores/sessionStore'
import { useTrackVoteStore } from '../../../stores/trackVoteStore'
import { getPlayerColors } from '../../players/playerVisuals'
import { SelectionRoster } from '../../selection/SelectionRoster'
import { TrackCard } from '../../tracks/TrackCard'

// Vote du circuit suivant : chaque joueur local choisit un des autres circuits avec son
// périphérique (gauche / droite / haut / bas, A ou START pour voter, RETOUR pour changer).
// Dès que tous ont voté, le circuit le plus choisi est annoncé (TrackVoteReveal).
const renderVoteCard = ({ itemId, cursors }) => <TrackCard trackId={itemId} cursors={cursors} />
const NO_PLAYERS = []

function VoterChip({ player, voted }) {
  const { t } = useTranslation()
  return (
    <li className={`inline-flex items-center gap-1.5 px-2 py-1 font-display text-sm leading-none text-brand-ink ${getPlayerColors(player.index).bg}`} data-voted={voted ? 'true' : 'false'}>
      {voted ? <Check aria-hidden="true" className="size-3.5" strokeWidth={3} /> : null}
      {player.id}
      <span className="font-sans text-[10px] font-bold uppercase tracking-widest">{voted ? t('vote.voted') : t('vote.choosing')}</span>
    </li>
  )
}

export function TrackVote() {
  const { t } = useTranslation()
  const options = useRaceFlowStore((state) => state.options)
  const players = useSessionStore((state) => state.match?.players ?? NO_PLAYERS)
  const selections = useTrackVoteStore((state) => state.selections)

  return (
    <motion.div variants={pageList} initial="hidden" animate="visible" className="scrollbar-game flex max-h-full w-full max-w-4xl flex-col gap-4 overflow-y-auto bg-brand-ink/95 p-5 text-white shadow-[8px_8px_0_0_rgb(0_0_0/0.4)]" id="track-vote">
      <motion.header variants={pageItem} className="flex flex-col gap-1">
        <h2 className="inline-flex items-center gap-2 font-display text-3xl uppercase leading-none">
          <Vote aria-hidden="true" className="size-7 text-brand-yellow" strokeWidth={2.5} />
          {t('vote.title')}
        </h2>
        <p className="text-sm text-white/70">{t('vote.subtitle')}</p>
      </motion.header>
      <SelectionRoster itemIds={options} slots={players} useStore={useTrackVoteStore} unique={false} label={t('vote.title')} className="grid-cols-2 sm:grid-cols-4" renderCard={renderVoteCard} />
      <motion.ul variants={pageItem} className="flex flex-wrap gap-2" aria-label={t('vote.voters')}>
        {players.map((player) => (
          <VoterChip key={player.id} player={player} voted={selections[player.id]?.status === SELECTION_STATUS.CONFIRMED} />
        ))}
      </motion.ul>
    </motion.div>
  )
}
