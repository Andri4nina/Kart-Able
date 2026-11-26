import { motion } from 'motion/react'
import { pageItem } from '../../animations/variants'
import { getCup } from '../../config/cups'
import { useTranslation } from '../../i18n/useTranslation'
import { CupEmblem } from './CupEmblem'
import { TrackMinimap } from './TrackMinimap'

// Aperçu d'une coupe complète présélectionnée : ses circuits dans l'ordre de course et la règle
// des points cumulés.
export function CupPreview({ cupId }) {
  const { t } = useTranslation()
  const cup = getCup(cupId)
  if (!cup) return null

  return (
    <motion.section variants={pageItem} aria-label={t(`cups.${cupId}.name`)} className="flex flex-col gap-3 bg-brand-ink/90 p-4 text-white shadow-[8px_8px_0_0_rgb(0_0_0/0.35)]">
      <h3 className="inline-flex items-center gap-2 font-display text-xl uppercase leading-none">
        <CupEmblem cupId={cupId} className="h-9 w-8" />
        {t(`cups.${cupId}.name`)}
      </h3>
      <p className="text-sm text-white/70">{t('trackSelect.cupDescription', { count: cup.trackIds.length })}</p>
      <ol className="flex flex-col gap-2">
        {cup.trackIds.map((trackId, index) => (
          <li key={trackId} className="flex items-center gap-3 border-t border-white/10 pt-2">
            <span className="font-display text-lg leading-none text-brand-yellow">{index + 1}</span>
            <TrackMinimap trackId={trackId} className="aspect-square w-12 shrink-0 bg-white/5" />
            <span className="truncate font-bold">{t(`tracks.${trackId}.name`)}</span>
          </li>
        ))}
      </ol>
    </motion.section>
  )
}
