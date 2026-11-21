import { X } from 'lucide-react'
import { useInputLabel } from '../../hooks/useInputLabels'
import { useTranslation } from '../../i18n/useTranslation'
import { BINDING_SLOTS } from '../../input/bindingDefaults'
import { KeyCap } from '../ui/KeyCap'

// Un emplacement de touche : cliquer attend la prochaine touche (ou le prochain bouton).
function BindingSlot({ id, label, actionLabel, slotLabel, waiting, onStart, onClear, clearLabel }) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        id={id}
        aria-label={t('settings.controls.change', { action: actionLabel, slot: slotLabel })}
        aria-pressed={waiting}
        onClick={onStart}
        className={
          'inline-flex h-8 w-24 items-center justify-center px-1.5 transition duration-150 ease-out sm:w-28 ' +
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow ' +
          (waiting ? 'bg-brand-yellow text-brand-ink motion-ok:animate-pulse' : 'bg-black/40 text-white hover:bg-white/15')
        }
      >
        {waiting ? (
          <span className="text-[10px] font-bold uppercase tracking-widest">{t('settings.controls.waiting')}</span>
        ) : label ? (
          <KeyCap className="max-w-full truncate">{label}</KeyCap>
        ) : (
          <span className="text-xs text-white/35">{t('settings.controls.empty')}</span>
        )}
      </button>
      <button
        type="button"
        id={`un${id}`}
        aria-label={clearLabel}
        title={clearLabel}
        disabled={!label || waiting}
        onClick={onClear}
        className="inline-flex size-6 items-center justify-center text-white/45 transition duration-150 ease-out hover:text-brand-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow disabled:invisible"
      >
        <X aria-hidden="true" className="size-3.5" strokeWidth={3} />
      </button>
    </div>
  )
}

// Ligne d'une action : son nom et ses deux touches (principale, secondaire).
export function BindingRow({ profile, action, entries, capture, onStart, onClear }) {
  const { t } = useTranslation()
  const label = useInputLabel()
  const actionLabel = t(`controls.actions.${action}`)

  return (
    // Les touches passent sous le nom de l'action quand la place manque (écrans étroits).
    <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 bg-white/5 py-1 pl-3 pr-1">
      <span className="min-w-0 flex-1 basis-32 truncate text-sm font-semibold text-white">{actionLabel}</span>
      <div className="flex shrink-0 gap-1">
        {Array.from({ length: BINDING_SLOTS }, (_, slot) => {
          const keyLabel = label(profile.kind, entries[slot])
          return (
            <BindingSlot
              key={slot}
              id={`bind-${profile.id}-${action}-${slot}`}
              label={keyLabel}
              actionLabel={actionLabel}
              slotLabel={t(slot === 0 ? 'settings.controls.primary' : 'settings.controls.secondary')}
              waiting={capture?.profileId === profile.id && capture.action === action && capture.slot === slot}
              onStart={() => onStart(profile.id, action, slot)}
              onClear={() => onClear(profile.id, action, slot)}
              clearLabel={t('settings.controls.clear', { key: keyLabel ?? '', action: actionLabel })}
            />
          )
        })}
      </div>
    </div>
  )
}
