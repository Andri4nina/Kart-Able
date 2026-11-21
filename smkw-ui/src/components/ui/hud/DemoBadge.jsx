import { Info } from 'lucide-react'
import { useTranslation } from '../../../i18n/useTranslation'
import { useSessionStore } from '../../../stores/sessionStore'

export function DemoBadge() {
  const { t } = useTranslation()
  const modeId = useSessionStore((state) => state.match?.modeId)
  const mode = modeId ? t(`modes.${modeId}.name`) : ''

  return (
    <span className="inline-flex items-center gap-2 bg-brand-ink/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/75">
      <Info aria-hidden="true" className="size-4 text-brand-yellow" strokeWidth={2.5} />
      {t('hud.demo', { mode })}
    </span>
  )
}
