import { Gamepad2, Hand, Keyboard } from 'lucide-react'
import { useDeviceKeyLabels } from '../../hooks/useInputLabels'
import { useTranslation } from '../../i18n/useTranslation'
import { DEVICE_KINDS, KEYBOARD_1, KEYBOARD_2 } from '../../input/devices'
import { KeyCap } from '../ui/KeyCap'

const ANY_GAMEPAD = { kind: DEVICE_KINDS.GAMEPAD }

function JoinMethod({ icon: Icon, label, keyLabel }) {
  return (
    <li className="inline-flex items-center gap-2 bg-brand-ink/85 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/80">
      <Icon aria-hidden="true" className="size-4 text-brand-yellow" strokeWidth={2.5} />
      {label}
      <KeyCap>{keyLabel}</KeyCap>
    </li>
  )
}

// Comment appuyer sur START selon le périphérique (écran d'entrée des joueurs), d'après
// l'assignation en cours (paramètres > Contrôles).
export function JoinHints() {
  const { t } = useTranslation()
  const keyboard1 = useDeviceKeyLabels(KEYBOARD_1)
  const keyboard2 = useDeviceKeyLabels(KEYBOARD_2)
  const gamepad = useDeviceKeyLabels(ANY_GAMEPAD)

  return (
    <ul aria-label={t('local.howToJoin')} className="flex flex-wrap gap-2">
      <JoinMethod icon={Keyboard} label={t('input.keyboard1')} keyLabel={keyboard1?.start} />
      <JoinMethod icon={Keyboard} label={t('input.keyboard2')} keyLabel={keyboard2?.start} />
      <JoinMethod icon={Gamepad2} label={t('input.gamepadAny')} keyLabel={gamepad?.start} />
      <JoinMethod icon={Hand} label={t('input.pointer')} keyLabel={t('input.tap')} />
    </ul>
  )
}
