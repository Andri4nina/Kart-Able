import { Settings } from 'lucide-react'
import { useTranslation } from '../../i18n/useTranslation'
import { useNavigationStore } from '../../stores/navigationStore'
import { IconButton } from '../ui/IconButton'
import { MenuButton } from './MenuButton'

// Accès aux paramètres depuis n'importe quel écran : entrée de menu ou bouton icône.
export function SettingsButton({ variant = 'menu', id }) {
  const { t } = useTranslation()
  const openSettings = useNavigationStore((state) => state.openSettings)

  if (variant === 'icon') {
    return <IconButton icon={Settings} label={t('mainMenu.settings')} onClick={openSettings} id={id ?? 'settings-icon-btn'} />
  }

  return (
    <MenuButton
      id={id ?? 'settings-btn'}
      icon={Settings}
      label={t('mainMenu.settings')}
      description={t('mainMenu.settingsHint')}
      onClick={openSettings}
    />
  )
}
