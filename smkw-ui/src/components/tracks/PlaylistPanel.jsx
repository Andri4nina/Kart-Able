import { ListOrdered, X } from 'lucide-react'
import { motion } from 'motion/react'
import { useShallow } from 'zustand/react/shallow'
import { pageItem } from '../../animations/variants'
import { getCup } from '../../config/cups'
import { COURSE } from '../../config/race'
import { useTranslation } from '../../i18n/useTranslation'
import { useCourseStore } from '../../stores/courseStore'
import { TrackMinimap } from './TrackMinimap'

// Programme en cours de composition (écran des circuits) : circuits dans l'ordre de course,
// chacun retirable d'un clic. Vide : toute la coupe ouverte sera courue.
export function PlaylistPanel() {
  const { t } = useTranslation()
  const { playlist, cupId } = useCourseStore(useShallow((state) => ({ playlist: state.playlist, cupId: state.cupId })))
  const toggleTrack = useCourseStore((state) => state.toggleTrack)
  const cup = getCup(cupId)
  let summary = t('trackSelect.playlistEmpty')
  if (playlist.length) summary = t('trackSelect.playlistCount', { count: playlist.length, max: COURSE.maxRaces })
  else if (cup) summary = t('trackSelect.playlistWholeCup', { cup: t(`cups.${cup.id}.name`), count: cup.trackIds.length })

  return (
    <motion.section variants={pageItem} id="course-playlist" aria-label={t('trackSelect.playlist')} className="flex flex-col gap-3 bg-brand-ink/90 p-4 text-white shadow-[8px_8px_0_0_rgb(0_0_0/0.35)]">
      <h3 className="inline-flex items-center gap-2 font-display text-xl uppercase leading-none">
        <ListOrdered aria-hidden="true" className="size-5 text-brand-yellow" strokeWidth={2.5} />
        {t('trackSelect.playlist')}
      </h3>
      <p className="text-sm text-white/70">{summary}</p>
      {playlist.length ? (
        <ol className="scrollbar-game flex max-h-72 flex-col gap-2 overflow-y-auto">
          {playlist.map((trackId, index) => (
            <li key={trackId} className="flex items-center gap-3 border-t border-white/10 pt-2">
              <span className="w-5 font-display text-lg leading-none text-brand-yellow">{index + 1}</span>
              <TrackMinimap trackId={trackId} className="aspect-square w-10 shrink-0 bg-white/5" />
              <span className="min-w-0 flex-1 truncate font-bold">{t(`tracks.${trackId}.name`)}</span>
              <button type="button" onClick={() => toggleTrack(trackId)} aria-label={t('trackSelect.remove', { track: t(`tracks.${trackId}.name`) })} className="p-1 text-white/60 transition hover:text-white">
                <X aria-hidden="true" className="size-4" strokeWidth={2.5} />
              </button>
            </li>
          ))}
        </ol>
      ) : null}
      <p className="text-[11px] font-bold uppercase tracking-widest text-white/50">{t('trackSelect.pointsRule')}</p>
    </motion.section>
  )
}
