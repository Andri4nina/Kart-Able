import { Check, Trophy } from 'lucide-react'
import { memo } from 'react'
import { getCup } from '../../config/cups'
import { useTranslation } from '../../i18n/useTranslation'
import { useCourseStore } from '../../stores/courseStore'
import { RosterCursors } from '../selection/RosterCursors'
import { TrackMinimap } from './TrackMinimap'

// Carte d'une coupe : ses 4 circuits en mini-cartes, avec le trophée. Deux usages :
// - écran des coupes (`whole` faux) : nom de la coupe, l'ouvrir ;
// - première carte d'une coupe ouverte (`whole`) : « toute la coupe », cochée quand tous ses
//   circuits sont au programme.
// Cliquable (souris, tactile) ; curseur du joueur qui choisit.
export const CupCard = memo(function CupCard({ cupId, cursors, whole = false, onPick }) {
  const { t } = useTranslation()
  const cup = getCup(cupId)
  const picked = useCourseStore((state) => whole && cup.trackIds.every((id) => state.playlist.includes(id)))
  const highlighted = cursors.length > 0

  return (
    <button
      type="button"
      id={whole ? `cup-${cupId}` : `cup-card-${cupId}`}
      data-picked={picked ? 'true' : 'false'}
      onClick={() => onPick?.(cupId)}
      className={
        'relative flex h-full w-full cursor-pointer flex-col items-center gap-1.5 px-2 pb-2.5 pt-7 text-center text-white transition duration-200 ease-out ' +
        (picked ? 'bg-brand-yellow/90 text-brand-ink ' : 'bg-brand-red/90 ') +
        (highlighted ? 'shadow-[5px_5px_0_0_var(--color-brand-yellow)]' : 'shadow-[5px_5px_0_0_rgb(0_0_0/0.35)]')
      }
    >
      <RosterCursors cursors={cursors} className="top-2" />
      {picked ? <Check aria-hidden="true" className="absolute right-2 top-2 size-5" strokeWidth={3} /> : null}
      <span className="grid aspect-square w-full max-w-36 grid-cols-2 gap-1">
        {cup.trackIds.map((trackId) => (
          <TrackMinimap key={trackId} trackId={trackId} className="aspect-square w-full bg-brand-ink/40" />
        ))}
      </span>
      <span className="inline-flex max-w-full items-center justify-center gap-1 font-display text-sm uppercase leading-tight sm:text-base">
        <Trophy aria-hidden="true" className={`size-3.5 shrink-0 ${picked ? 'text-brand-ink' : 'text-brand-yellow'}`} strokeWidth={2.5} />
        {whole ? t('trackSelect.fullCup') : t(`cups.${cupId}.name`)}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-widest opacity-75">{t('trackSelect.cupTracks', { count: cup.trackIds.length })}</span>
    </button>
  )
})
