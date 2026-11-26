import { Check, Flag, Gamepad2, Languages, MonitorCog, Settings, Volume2, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { backdropVariants, dialogVariants, swapVariants } from '../../animations/variants'
import { useTranslation } from '../../i18n/useTranslation'
import { useNavigationStore } from '../../stores/navigationStore'
import { ControlsPanel } from '../settings/ControlsPanel'
import { GraphicsPanel } from '../settings/GraphicsPanel'
import { LanguagePanel } from '../settings/LanguagePanel'
import { RacePanel } from '../settings/RacePanel'
import { SettingsTabs } from '../settings/SettingsTabs'
import { SoonPanel } from '../settings/SoonPanel'
import { Button } from '../ui/Button'
import { IconButton } from '../ui/IconButton'

// Onglets dans l'ordre du menu Paramètres. `soon` : section annoncée, pas encore disponible.
const TABS = [
  { id: 'language', icon: Languages },
  { id: 'race', icon: Flag },
  { id: 'audio', icon: Volume2, soon: true },
  { id: 'graphics', icon: MonitorCog },
  { id: 'controls', icon: Gamepad2 },
]

function TabPanel({ tab }) {
  if (tab.id === 'language') return <LanguagePanel />
  if (tab.id === 'race') return <RacePanel />
  if (tab.id === 'graphics') return <GraphicsPanel />
  if (tab.id === 'controls') return <ControlsPanel />
  return <SoonPanel icon={tab.icon} />
}

export function SettingsDialog() {
  const { t } = useTranslation()
  const closeSettings = useNavigationStore((state) => state.closeSettings)
  const [activeTabId, setActiveTabId] = useState(TABS[0].id)
  const activeTab = TABS.find((tab) => tab.id === activeTabId) ?? TABS[0]

  const onBackdropPointerDown = (event) => {
    if (event.target === event.currentTarget) closeSettings()
  }

  return (
    <motion.div
      className="pointer-events-auto absolute inset-0 z-20 flex items-center justify-center bg-black/55 p-4"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onPointerDown={onBackdropPointerDown}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        variants={dialogVariants}
        className="flex max-h-full w-full max-w-lg flex-col bg-brand-ink shadow-[8px_8px_0_0_var(--color-brand-red)]"
      >
        <header className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-4">
          <h2 id="settings-title" className="inline-flex items-center gap-3 font-display text-2xl uppercase">
            <Settings aria-hidden="true" className="size-6 text-brand-yellow" strokeWidth={2.5} />
            {t('settings.title')}
          </h2>
          <IconButton icon={X} label={t('settings.close')} onClick={closeSettings} autoFocus />
        </header>

        <SettingsTabs tabs={TABS} activeId={activeTab.id} onSelect={setActiveTabId} />

        <div id="settings-panel" role="tabpanel" aria-labelledby={`settings-tab-${activeTab.id}`} className="scrollbar-game min-h-0 flex-1 overflow-y-auto px-6 py-6">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab.id} variants={swapVariants} initial="hidden" animate="visible" exit="exit">
              <TabPanel tab={activeTab} />
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className="flex justify-end px-6 pb-6">
          <Button id="settings-done-btn" size="md" icon={Check} onClick={closeSettings}>
            {t('common.done')}
          </Button>
        </footer>
      </motion.div>
    </motion.div>
  )
}
