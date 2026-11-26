import { ArrowLeftRight, LogOut, Pause, Play, Trophy } from 'lucide-react'
import { motion } from 'motion/react'
import { useShallow } from 'zustand/react/shallow'
import { DURATION, EASE_OUT } from '../../../animations/transitions'
import { choosePauseItem, getPauseItems, handlePauseInput } from '../../../game/pauseMenu'
import { usePlayerInput } from '../../../input/usePlayerInput'
import { useTranslation } from '../../../i18n/useTranslation'
import { usePauseStore } from '../../../stores/pauseStore'
import { useRaceStore } from '../../../stores/raceStore'
import { TrackMinimap } from '../../tracks/TrackMinimap'

// Menu pause de la course (logique : game/pauseMenu.js). Écoute START pendant toute la course
// (ouvrir), puis la navigation du menu ; la course est figée tant qu'il est ouvert.
const OPTION_ICONS = { resume: Play, changeTrack: ArrowLeftRight, quit: LogOut }

function PauseItem({ view, item, active }) {
  const { t } = useTranslation()
  const Icon = view === 'menu' ? OPTION_ICONS[item] : Trophy
  let label = t(`pause.${item}`)
  if (view === 'cups') label = t(`cups.${item}.name`)
  if (view === 'tracks') label = t(`tracks.${item}.name`)
  return (
    <button
      type="button"
      data-pause-item={item}
      onClick={() => choosePauseItem(item)}
      className={`flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left font-display text-lg uppercase leading-none transition ${active ? 'bg-brand-yellow text-brand-ink' : 'bg-white/5 text-white hover:bg-white/10'}`}
    >
      {view === 'tracks' ? <TrackMinimap trackId={item} className="aspect-square w-9 shrink-0 bg-brand-ink/30" /> : <Icon aria-hidden="true" className="size-5 shrink-0" strokeWidth={2.5} />}
      <span className="truncate">{label}</span>
    </button>
  )
}

function PausePanel() {
  const { t } = useTranslation()
  const pause = usePauseStore(useShallow((state) => ({ view: state.view, index: state.index, cupId: state.cupId })))
  const items = getPauseItems(pause)
  const heading = pause.view === 'menu' ? t('pause.title') : pause.view === 'cups' ? t('pause.chooseCup') : t(`cups.${pause.cupId}.name`)
  return (
    <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-brand-ink/60 p-4">
      <motion.div
        id="pause-menu"
        data-view={pause.view}
        role="dialog"
        aria-label={t('pause.title')}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1, transition: { duration: DURATION.base, ease: EASE_OUT } }}
        className="scrollbar-game flex max-h-full w-full max-w-sm flex-col gap-2 overflow-y-auto bg-brand-ink/95 p-5 text-white shadow-[8px_8px_0_0_var(--color-brand-yellow)]"
      >
        <h2 className="mb-1 inline-flex items-center gap-2 font-display text-3xl uppercase leading-none">
          <Pause aria-hidden="true" className="size-7 text-brand-yellow" strokeWidth={2.5} />
          {heading}
        </h2>
        {pause.view !== 'menu' ? <p className="text-sm text-white/70">{t('pause.changeHint')}</p> : null}
        {items.map((item, index) => (
          <PauseItem key={item} view={pause.view} item={item} active={index === pause.index} />
        ))}
        <p className="pt-1 text-[11px] font-bold uppercase tracking-widest text-white/50">{t('pause.hint')}</p>
      </motion.div>
    </div>
  )
}

export function PauseMenu() {
  const racing = useRaceStore((state) => state.phase === 'countdown' || state.phase === 'racing')
  const open = usePauseStore((state) => state.open)
  return racing ? <PauseListener open={open} /> : null
}

function PauseListener({ open }) {
  usePlayerInput(handlePauseInput)
  return open ? <PausePanel /> : null
}
