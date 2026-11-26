import { memo } from 'react'
import { getTrackOutline } from '../../game/track/trackOutline'
import { useTranslation } from '../../i18n/useTranslation'
import { useCourseStore } from '../../stores/courseStore'
import { RosterCursors } from '../selection/RosterCursors'
import { TrackMinimap } from './TrackMinimap'

// Carte d'un circuit : mini-carte, nom et longueur du tour. Curseur du joueur qui choisit.
// Avec `onPick` (écran des circuits) : cliquable, et numéro de passage s'il est au programme.
export const TrackCard = memo(function TrackCard({ trackId, cursors, onPick = null }) {
  const { t } = useTranslation()
  const order = useCourseStore((state) => (onPick ? state.playlist.indexOf(trackId) + 1 : 0))
  const highlighted = cursors.length > 0
  const { stats } = getTrackOutline(trackId)
  const Tag = onPick ? 'button' : 'div'

  return (
    <Tag
      {...(onPick ? { type: 'button', onClick: () => onPick(trackId) } : null)}
      id={`track-${trackId}`}
      data-order={order}
      className={
        'relative flex h-full w-full flex-col items-center gap-1.5 bg-brand-ink/90 px-2 pb-2.5 pt-7 text-center text-white transition duration-200 ease-out ' +
        (onPick ? 'cursor-pointer ' : '') +
        (order ? 'ring-4 ring-brand-yellow ring-inset ' : '') +
        (highlighted ? 'shadow-[5px_5px_0_0_var(--color-brand-yellow)]' : 'shadow-[5px_5px_0_0_rgb(0_0_0/0.35)]')
      }
    >
      <RosterCursors cursors={cursors} className="top-2" />
      {order ? (
        <span className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center bg-brand-yellow font-display text-sm leading-none text-brand-ink">{order}</span>
      ) : null}
      <TrackMinimap trackId={trackId} className="aspect-square w-full max-w-36" />
      <span className="max-w-full truncate font-display text-sm uppercase leading-none sm:text-base">{t(`tracks.${trackId}.name`)}</span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-white/55">{t('trackSelect.length', { meters: stats.length })}</span>
    </Tag>
  )
})
