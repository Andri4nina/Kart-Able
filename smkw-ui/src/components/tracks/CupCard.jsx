import { Trophy } from 'lucide-react'
import { memo } from 'react'
import { getCup } from '../../config/cups'
import { useTranslation } from '../../i18n/useTranslation'
import { RosterCursors } from '../selection/RosterCursors'
import { TrackMinimap } from './TrackMinimap'

// Carte « coupe complète » (première de chaque rangée) : les 4 circuits de la coupe à la suite,
// en mini-cartes, avec le trophée. Curseur du joueur qui choisit.
export const CupCard = memo(function CupCard({ cupId, cursors }) {
  const { t } = useTranslation()
  const cup = getCup(cupId)
  const highlighted = cursors.length > 0

  return (
    <div
      id={`cup-${cupId}`}
      className={
        'relative flex h-full flex-col items-center gap-1.5 bg-brand-red/90 px-2 pb-2.5 pt-7 text-center text-white transition duration-200 ease-out ' +
        (highlighted ? 'shadow-[5px_5px_0_0_var(--color-brand-yellow)]' : 'shadow-[5px_5px_0_0_rgb(0_0_0/0.35)]')
      }
    >
      <RosterCursors cursors={cursors} className="top-2" />
      <div className="grid aspect-square w-full max-w-36 grid-cols-2 gap-1">
        {cup.trackIds.map((trackId) => (
          <TrackMinimap key={trackId} trackId={trackId} className="aspect-square w-full bg-brand-ink/40" />
        ))}
      </div>
      <span className="inline-flex max-w-full items-center justify-center gap-1 font-display text-sm uppercase leading-tight sm:text-base">
        <Trophy aria-hidden="true" className="size-3.5 shrink-0 text-brand-yellow" strokeWidth={2.5} />
        {t('trackSelect.fullCup')}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-white/75">{t('trackSelect.cupTracks', { count: cup.trackIds.length })}</span>
    </div>
  )
})
