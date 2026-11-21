import { Check, ChevronLeft, ChevronRight, Undo2 } from 'lucide-react'
import { useDeviceKeyLabels } from '../../hooks/useInputLabels'
import { useTranslation } from '../../i18n/useTranslation'
import { useInputDevicesStore } from '../../stores/inputDevicesStore'

function Arrow({ id, icon: Icon, label, disabled, onClick }) {
  return (
    <button
      type="button"
      id={id}
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={
        'inline-flex size-8 shrink-0 items-center justify-center bg-white/5 text-white transition duration-150 ease-out ' +
        'hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow ' +
        'disabled:pointer-events-none disabled:opacity-0 motion-ok:active:scale-90'
      }
    >
      <Icon aria-hidden="true" className="size-4" strokeWidth={3} />
    </button>
  )
}

// Contrôles à l'écran d'un joueur (souris / tactile) : changer, confirmer, annuler.
// Ils passent par les mêmes actions du store (useStore) que les périphériques, donc par la même validation.
export function PanelControls({ playerId, deviceId, confirmed, blocked, colorClass, useStore }) {
  const { t } = useTranslation()
  const move = useStore((state) => state.move)
  const confirm = useStore((state) => state.confirm)
  const cancel = useStore((state) => state.cancel)
  const device = useInputDevicesStore((state) => state.devices[deviceId])
  const keys = useDeviceKeyLabels(device)

  return (
    <div className="flex items-center gap-2">
      <Arrow id={`${playerId}-prev-btn`} icon={ChevronLeft} label={t('selection.previous')} disabled={confirmed} onClick={() => move(playerId, -1)} />
      <Arrow id={`${playerId}-next-btn`} icon={ChevronRight} label={t('selection.next')} disabled={confirmed} onClick={() => move(playerId, 1)} />
      <span className="min-w-0 flex-1 truncate text-[10px] font-semibold uppercase tracking-wider text-white/45">
        {keys ? `${keys.move} · ${keys.start}` : null}
      </span>
      <button
        type="button"
        id={`${playerId}-confirm-btn`}
        disabled={!confirmed && blocked}
        onClick={() => (confirmed ? cancel(playerId) : confirm(playerId))}
        className={
          'inline-flex shrink-0 -skew-x-12 items-center px-3 py-1.5 transition duration-150 ease-out ' +
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow motion-ok:active:scale-95 ' +
          'disabled:cursor-not-allowed disabled:opacity-40 ' +
          (confirmed ? 'bg-white/10 text-white hover:bg-white/20' : `${colorClass} text-brand-ink hover:brightness-110`)
        }
      >
        <span className="inline-flex skew-x-12 items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest">
          {confirmed ? <Undo2 aria-hidden="true" className="size-3.5" strokeWidth={2.75} /> : <Check aria-hidden="true" className="size-3.5" strokeWidth={3} />}
          {confirmed ? t('selection.cancel') : t('selection.confirm')}
        </span>
      </button>
    </div>
  )
}
