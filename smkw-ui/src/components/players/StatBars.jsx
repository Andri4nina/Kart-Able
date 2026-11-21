import { STAT_KEYS, STAT_MAX } from '../../config/stats'
import { useTranslation } from '../../i18n/useTranslation'

const SEGMENTS = Array.from({ length: STAT_MAX }, (_, index) => index)

// Statistiques (véhicule) en barres segmentées.
// Les segments changent de couleur via une transition Tailwind : aucune animation JS.
export function StatBars({ stats, fillClass, compact = false }) {
  const { t } = useTranslation()
  return (
    <dl className={`grid ${compact ? 'gap-0.5' : 'gap-1.5'}`}>
      {STAT_KEYS.map((key) => (
        <div key={key} className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-2">
          <dt className="truncate text-[10px] font-bold uppercase tracking-wider text-white/55">{t(`stats.${key}`)}</dt>
          <dd className="flex gap-0.5" aria-label={`${t(`stats.${key}`)} ${stats[key]}/${STAT_MAX}`}>
            {SEGMENTS.map((segment) => (
              <span
                key={segment}
                className={`h-2 flex-1 -skew-x-12 transition-colors duration-200 ease-out ${segment < stats[key] ? fillClass : 'bg-white/10'}`}
              />
            ))}
          </dd>
        </div>
      ))}
    </dl>
  )
}
