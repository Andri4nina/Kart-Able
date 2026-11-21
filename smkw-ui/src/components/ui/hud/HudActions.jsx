import { LogOut } from 'lucide-react'
import { exitMatch } from '../../../game/session'
import { useTranslation } from '../../../i18n/useTranslation'
import { SettingsButton } from '../../menu/SettingsButton'
import { IconButton } from '../IconButton'

export function HudActions() {
  const { t } = useTranslation()
  return (
    <div className="pointer-events-auto flex gap-2">
      <SettingsButton variant="icon" id="hud-settings-btn" />
      <IconButton icon={LogOut} label={t('hud.exit')} onClick={exitMatch} id="hud-exit-btn" />
    </div>
  )
}
