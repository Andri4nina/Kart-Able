import { CircleAlert, CircleCheck, Keyboard } from 'lucide-react'
import { useInputLabel } from '../../hooks/useInputLabels'
import { useTranslation } from '../../i18n/useTranslation'
import { getBindingProfile } from '../../input/bindingDefaults'

const REFUSALS = new Set(['reserved', 'usedByOther', 'required'])

// Ligne d'état de l'onglet Contrôles : attente d'une touche, ou résultat de la dernière
// assignation (assignée, échangée, refusée et pourquoi).
export function BindingNotice({ capture, notice, kind }) {
  const { t } = useTranslation()
  const label = useInputLabel()
  const action = (id) => (id ? t(`controls.actions.${id}`) : '')

  let message = t('settings.controls.intro')
  let Icon = Keyboard
  if (capture) {
    message = t(kind === 'gamepad' ? 'settings.controls.waitingButton' : 'settings.controls.waitingKey', { action: action(capture.action) })
  } else if (notice && notice.type !== 'unchanged') {
    const key = notice.input !== undefined ? label(kind, notice.input) : ''
    const profile = notice.profileId ? t(getBindingProfile(notice.profileId)?.labelKey ?? '') : ''
    message = t(`settings.controls.notices.${notice.type}`, { key, action: action(notice.action), other: action(notice.otherAction), profile })
    Icon = REFUSALS.has(notice.type) ? CircleAlert : CircleCheck
  }

  return (
    <p role="status" aria-live="polite" className="flex min-h-10 items-center gap-2 bg-black/30 px-3 py-2 text-xs font-semibold text-white/80">
      <Icon aria-hidden="true" className="size-4 shrink-0 text-brand-yellow" strokeWidth={2.5} />
      {message}
    </p>
  )
}
