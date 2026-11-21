import { useTranslation } from '../../i18n/useTranslation'

// Onglet annoncé, pas encore disponible.
export function SoonPanel({ icon: Icon }) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center text-white/60">
      <Icon aria-hidden="true" className="size-10 text-white/30" strokeWidth={2} />
      <p className="text-sm font-semibold">{t('settings.soon')}</p>
    </div>
  )
}
