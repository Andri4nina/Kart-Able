import { RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from '../../i18n/useTranslation'
import { ACTION_GROUPS } from '../../input/actions'
import { BINDING_PROFILES, getBindingProfile } from '../../input/bindingDefaults'
import { useBindingCapture } from '../../input/useBindingCapture'
import { useBindingsStore } from '../../stores/bindingsStore'
import { Button } from '../ui/Button'
import { SegmentedControl } from '../ui/SegmentedControl'
import { BindingNotice } from './BindingNotice'
import { BindingRow } from './BindingRow'

// Onglet Contrôles : assignation des touches par profil (Clavier 1, Clavier 2, manettes).
// Cliquer un emplacement, puis appuyer sur la touche ou le bouton voulu ; Échap annule.
// Les changements s'appliquent tout de suite et sont mémorisés.
export function ControlsPanel() {
  const { t } = useTranslation()
  const [profileId, setProfileId] = useState(BINDING_PROFILES[0].id)
  const binding = useBindingCapture()
  const entries = useBindingsStore((state) => state.bindings[profileId])
  const profile = getBindingProfile(profileId)
  const options = BINDING_PROFILES.map((candidate) => ({ value: candidate.id, label: t(candidate.labelKey) }))

  const changeProfile = (id) => {
    binding.cancel()
    setProfileId(id)
  }

  return (
    <div className="flex flex-col gap-4">
      <SegmentedControl label={t('settings.controls.profile')} options={options} value={profileId} onChange={changeProfile} idPrefix="controls-profile" />
      <BindingNotice capture={binding.capture} notice={binding.notice} kind={profile.kind} />

      {ACTION_GROUPS.map((group) => (
        <section key={group.id} aria-label={t(`settings.controls.groups.${group.id}`)} className="flex flex-col gap-1">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-yellow">{t(`settings.controls.groups.${group.id}`)}</h3>
          {group.id === 'race' ? <p className="text-xs text-white/50">{t('settings.controls.raceHint')}</p> : null}
          {group.actions.map((action) => (
            <BindingRow
              key={action}
              profile={profile}
              action={action}
              entries={entries[action]}
              capture={binding.capture}
              onStart={binding.start}
              onClear={binding.clear}
            />
          ))}
        </section>
      ))}

      {profile.kind === 'gamepad' ? <p className="text-xs text-white/50">{t('settings.controls.stickNote')}</p> : null}
      <Button id="bindings-reset-btn" variant="secondary" size="md" icon={RotateCcw} onClick={() => binding.reset(profileId)} className="self-start">
        {t('settings.controls.reset')}
      </Button>
    </div>
  )
}
