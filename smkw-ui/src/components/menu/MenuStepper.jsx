import { Check } from 'lucide-react'
import { useTranslation } from '../../i18n/useTranslation'
import { modeUsesTracks } from '../../game/matchRules'
import { getMenuFlow } from '../../navigation/screens'
import { useMatchSetupStore } from '../../stores/matchSetupStore'

const STATE_CLASSES = {
  done: 'bg-brand-yellow text-brand-ink',
  current: 'bg-brand-red text-white',
  todo: 'bg-brand-ink/70 text-white/45',
}

// Fil d'étapes du parcours (local : jusqu'à 7 étapes, réseau : 4), voir MENU_FLOWS.
export function MenuStepper({ step }) {
  const { t } = useTranslation()
  const playType = useMatchSetupStore((state) => state.playType)
  const usesTracks = useMatchSetupStore((state) => modeUsesTracks(state.modeId))
  const flow = getMenuFlow(playType, usesTracks)
  const current = flow.indexOf(step)

  return (
    <ol aria-label={t('nav.steps.label')} className="hidden items-center gap-1.5 lg:flex">
      {flow.map((key, index) => {
        const state = index < current ? 'done' : index === current ? 'current' : 'todo'
        return (
          <li
            key={key}
            aria-current={state === 'current' ? 'step' : undefined}
            className={`-skew-x-12 px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition duration-300 ease-out ${STATE_CLASSES[state]}`}
          >
            <span className="inline-flex skew-x-12 items-center gap-1.5">
              {state === 'done' ? (
                <Check aria-hidden="true" className="size-3.5" strokeWidth={3} />
              ) : (
                <span className="tabular-nums">{index + 1}</span>
              )}
              {t(`nav.steps.${key}`)}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
