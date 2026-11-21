import { Flag, MoveHorizontal, Ruler, ScanLine } from 'lucide-react'
import { motion } from 'motion/react'
import { pageItem } from '../../animations/variants'
import { getTrackOutline } from '../../game/track/trackOutline'
import { useTranslation } from '../../i18n/useTranslation'
import { TrackMinimap } from './TrackMinimap'

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-white/10 py-2">
      <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/55">
        <Icon aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
        {label}
      </span>
      <span className="text-sm font-bold text-white">{value}</span>
    </div>
  )
}

// Aperçu du circuit présélectionné : grande carte (lacs, départ, checkpoints), description et
// caractéristiques (dimensionnées pour 32 joueurs).
export function TrackPreview({ trackId }) {
  const { t } = useTranslation()
  const { stats } = getTrackOutline(trackId)

  return (
    <motion.section variants={pageItem} aria-label={t(`tracks.${trackId}.name`)} className="flex flex-col gap-3 bg-brand-ink/90 p-4 text-white shadow-[8px_8px_0_0_rgb(0_0_0/0.35)]">
      <TrackMinimap trackId={trackId} detailed className="mx-auto aspect-square w-full max-w-64 bg-white/5" />
      <div>
        <h3 className="font-display text-xl uppercase leading-none">{t(`tracks.${trackId}.name`)}</h3>
        <p className="mt-1.5 text-sm text-white/70">{t(`tracks.${trackId}.description`)}</p>
      </div>
      <div>
        <Stat icon={Ruler} label={t('trackSelect.lapLength')} value={t('trackSelect.length', { meters: stats.length })} />
        <Stat icon={Flag} label={t('trackSelect.laps')} value={stats.laps} />
        <Stat icon={MoveHorizontal} label={t('trackSelect.width')} value={t('trackSelect.widthRange', { min: stats.minWidth, max: stats.maxWidth })} />
        <Stat icon={ScanLine} label={t('trackSelect.checkpoints')} value={stats.checkpoints} />
      </div>
    </motion.section>
  )
}
