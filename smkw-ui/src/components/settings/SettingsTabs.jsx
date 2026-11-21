import { motion } from 'motion/react'
import { selectionTransition } from '../../animations/variants'
import { useArrowNavigation } from '../../hooks/useArrowNavigation'
import { useTranslation } from '../../i18n/useTranslation'

// Barre d'onglets des paramètres (flèches pour passer d'un onglet à l'autre). `tabs` :
// [{ id, icon, soon }] ; `soon` : section annoncée, pas encore disponible.
export function SettingsTabs({ tabs, activeId, onSelect }) {
  const { t } = useTranslation()
  const onArrowKeys = useArrowNavigation()

  return (
    <div role="tablist" aria-label={t('settings.title')} onKeyDown={onArrowKeys} className="grid grid-cols-4 gap-1 border-b border-white/10 p-2">
      {tabs.map((tab) => {
        const active = tab.id === activeId
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`settings-tab-${tab.id}`}
            data-nav-item
            aria-selected={active}
            aria-controls="settings-panel"
            tabIndex={active ? 0 : -1}
            onClick={() => onSelect(tab.id)}
            onFocus={() => onSelect(tab.id)}
            className={
              'relative flex flex-col items-center gap-1.5 px-2 py-2.5 text-[11px] font-bold uppercase tracking-wider ' +
              'transition duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow ' +
              (active ? 'text-white' : 'text-white/50 hover:bg-white/5 hover:text-white')
            }
          >
            {active ? (
              <motion.span layoutId="settings-tab-indicator" transition={selectionTransition} aria-hidden="true" className="absolute inset-0 bg-brand-red" />
            ) : null}
            <Icon aria-hidden="true" className="relative size-5" strokeWidth={2.5} />
            <span className="relative">{t(`settings.tabs.${tab.id}`)}</span>
            {tab.soon ? <span className="relative text-[9px] text-brand-yellow">{t('common.soon')}</span> : null}
          </button>
        )
      })}
    </div>
  )
}
