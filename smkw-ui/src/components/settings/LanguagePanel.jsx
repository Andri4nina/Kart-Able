import { useTranslation } from '../../i18n/useTranslation'
import { LanguageList } from '../menu/LanguageSelector'

// Onglet Langue.
export function LanguagePanel() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-3">
      <LanguageList />
      <p className="text-xs text-white/50">{t('settings.language.hint')}</p>
    </div>
  )
}
