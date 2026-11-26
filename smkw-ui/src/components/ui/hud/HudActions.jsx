import { LogOut, Pause } from 'lucide-react'
import { openPause } from '../../../game/pauseMenu'
import { exitMatch } from '../../../game/session'
import { useTranslation } from '../../../i18n/useTranslation'
import { SettingsButton } from '../../menu/SettingsButton'
import { IconButton } from '../IconButton'

export function HudActions() {
  const { t } = useTranslation()
  return (
    <div className="pointer-events-auto flex gap-2">
      <IconButton icon={Pause} label={t('pause.title')} onClick={openPause} id="hud-pause-btn" />
      <SettingsButton variant="icon" id="hud-settings-btn" />
      <IconButton icon={LogOut} label={t('hud.exit')} onClick={exitMatch} id="hud-exit-btn" />
    </div>
  )
}
