import { useTranslation } from '../../i18n/useTranslation'
import { useInputDevicesStore } from '../../stores/inputDevicesStore'
import { getDeviceVisual } from './playerVisuals'

// Périphérique qui contrôle un joueur (icône + nom), ou alerte s'il est déconnecté.
export function DeviceBadge({ deviceId, className = '' }) {
  const { t } = useTranslation()
  const device = useInputDevicesStore((state) => state.devices[deviceId])
  if (!device) return null

  const { icon: Icon } = getDeviceVisual(device.connected ? device.kind : 'disconnected')
  const label = device.connected ? t(device.labelKey, device.labelParams) : t('input.disconnected')

  return (
    <span
      title={device.name || undefined}
      className={
        'inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ' +
        `${device.connected ? 'text-white/65' : 'text-brand-yellow'} ${className}`
      }
    >
      <Icon aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={2.5} />
      <span className="truncate">{label}</span>
    </span>
  )
}
