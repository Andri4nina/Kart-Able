import { MonitorCog, Scan, Wind } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'
import { FOV, MOTION_MODES, QUALITY_LEVELS } from '../../config/gameConfig'
import { useTranslation } from '../../i18n/useTranslation'
import { useSettingsStore } from '../../stores/settingsStore'
import { SegmentedControl } from '../ui/SegmentedControl'
import { SettingRow } from '../ui/SettingRow'

// Onglet Graphismes : qualité (résolution de rendu), animations, champ de vision.
export function GraphicsPanel() {
  const { t } = useTranslation()
  const { quality, motion: motionMode, fov, setQuality, setMotion, setFov } = useSettingsStore(
    useShallow((state) => ({
      quality: state.quality,
      motion: state.motion,
      fov: state.fov,
      setQuality: state.setQuality,
      setMotion: state.setMotion,
      setFov: state.setFov,
    })),
  )
  const qualityOptions = QUALITY_LEVELS.map((value) => ({ value, label: t(`settings.graphics.${value}`) }))
  const motionOptions = MOTION_MODES.map((value) => ({ value, label: t(`settings.graphics.${value}`) }))

  return (
    <div className="flex flex-col gap-6">
      <SettingRow icon={MonitorCog} label={t('settings.graphics.quality')} hint={t('settings.graphics.qualityHint')}>
        <SegmentedControl label={t('settings.graphics.quality')} options={qualityOptions} value={quality} onChange={setQuality} />
      </SettingRow>
      <SettingRow icon={Wind} label={t('settings.graphics.motion')} hint={t('settings.graphics.motionHint')}>
        <SegmentedControl label={t('settings.graphics.motion')} options={motionOptions} value={motionMode} onChange={setMotion} />
      </SettingRow>
      <SettingRow
        icon={Scan}
        label={t('settings.graphics.fov')}
        htmlFor="fov-range"
        value={`${fov}°`}
        hint={t('settings.graphics.fovHint')}
      >
        <input
          id="fov-range"
          type="range"
          min={FOV.min}
          max={FOV.max}
          step={1}
          value={fov}
          onChange={(event) => setFov(Number(event.target.value))}
          className="h-2 w-full cursor-pointer accent-brand-red"
        />
      </SettingRow>
    </div>
  )
}
