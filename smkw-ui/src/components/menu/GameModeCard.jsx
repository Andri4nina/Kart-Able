import { CircleCheck, Gamepad2, Globe, Users } from 'lucide-react'
import { motion } from 'motion/react'
import { selectionTransition } from '../../animations/variants'
import { PLAY_TYPES } from '../../config/gameModes'
import { getPlayerLimit } from '../../game/matchRules'
import { useTranslation } from '../../i18n/useTranslation'
import { getModeVisual } from './modeVisuals'

function Chip({ icon: Icon, children, title }) {
  return (
    <span
      title={title}
      className="inline-flex items-center gap-1.5 bg-white/10 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-white/85"
    >
      <Icon aria-hidden="true" className="size-3.5" strokeWidth={2.75} />
      {children}
    </span>
  )
}

// Carte de mode, entièrement pilotée par l'entrée de config/gameModes.js.
// Souris : 1er clic = sélection, 2e clic = valider. Clavier : les flèches sélectionnent, Entrée valide.
export function GameModeCard({ mode, selected, onSelect, onConfirm, autoFocus }) {
  const { t } = useTranslation()
  const { icon: Icon, accent } = getModeVisual(mode.id)
  const localMax = getPlayerLimit(mode, PLAY_TYPES.LOCAL)
  const onlineMax = getPlayerLimit(mode, PLAY_TYPES.ONLINE)

  return (
    <button
      type="button"
      id={`mode-${mode.id}-btn`}
      data-nav-item
      aria-pressed={selected}
      autoFocus={autoFocus}
      onFocus={(event) => {
        if (event.currentTarget.matches(':focus-visible')) onSelect()
      }}
      onClick={() => (selected ? onConfirm() : onSelect())}
      className={
        'group relative flex h-full w-full flex-col items-start gap-4 bg-brand-ink/90 p-5 text-left text-white ' +
        'transition duration-150 ease-out focus-visible:outline-none sm:p-6 ' +
        'motion-ok:hover:-translate-y-1 motion-ok:active:scale-[0.98] ' +
        (selected
          ? 'shadow-[8px_8px_0_0_var(--color-brand-yellow)]'
          : 'shadow-[6px_6px_0_0_rgb(0_0_0/0.35)] hover:bg-brand-ink hover:shadow-[8px_8px_0_0_rgb(0_0_0/0.45)]')
      }
    >
      {selected ? (
        <motion.span
          layoutId="mode-selection"
          transition={selectionTransition}
          aria-hidden="true"
          className="pointer-events-none absolute -inset-1 border-4 border-brand-yellow"
        />
      ) : null}

      <span className={`flex size-14 -skew-x-12 items-center justify-center ${accent}`}>
        <Icon aria-hidden="true" className="size-7 skew-x-12" strokeWidth={2.5} />
      </span>

      <span className="flex flex-col gap-2">
        <span className="font-display text-2xl uppercase leading-none">{t(`modes.${mode.id}.name`)}</span>
        <span className="text-sm text-white/70">{t(`modes.${mode.id}.description`)}</span>
      </span>

      <span className="mt-auto flex flex-wrap gap-2">
        <Chip icon={Gamepad2} title={t('players.upTo', { count: localMax })}>
          {localMax === 1 ? t('modeTags.solo') : `${t('playType.local.name')} · ${localMax}`}
        </Chip>
        {onlineMax > 0 ? (
          <Chip icon={Globe} title={t('players.upTo', { count: onlineMax })}>
            {`${t('playType.online.name')} · ${onlineMax}`}
          </Chip>
        ) : null}
        {mode.teams ? <Chip icon={Users}>{t('modeTags.teams')}</Chip> : null}
      </span>

      {selected ? (
        <CircleCheck aria-hidden="true" className="absolute right-4 top-4 size-6 text-brand-yellow" strokeWidth={2.5} />
      ) : null}
    </button>
  )
}
