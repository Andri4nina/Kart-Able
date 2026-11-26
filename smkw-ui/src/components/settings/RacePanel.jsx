import { Gauge } from 'lucide-react'
import { SPEED_CLASS_IDS } from '../../config/raceFeel'
import { useTranslation } from '../../i18n/useTranslation'
import { useSettingsStore } from '../../stores/settingsStore'
import { SegmentedControl } from '../ui/SegmentedControl'
import { SettingRow } from '../ui/SettingRow'

// Onglet Course : cylindrée des courses (vitesse des karts, niveau des pilotes ordinateur).
export function RacePanel() {
  const { t } = useTranslation()
  const speedClass = useSettingsStore((state) => state.speedClass)
  const setSpeedClass = useSettingsStore((state) => state.setSpeedClass)
  const options = SPEED_CLASS_IDS.map((value) => ({ value, label: t('settings.race.cc', { value }) }))

  return (
    <div className="flex flex-col gap-6">
      <SettingRow icon={Gauge} label={t('settings.race.speedClass')} hint={t('settings.race.speedClassHint')}>
        <SegmentedControl label={t('settings.race.speedClass')} options={options} value={speedClass} onChange={setSpeedClass} />
      </SettingRow>
    </div>
  )
}
