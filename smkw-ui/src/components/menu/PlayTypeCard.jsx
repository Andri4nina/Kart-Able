import { ChevronRight, Lock, Users } from 'lucide-react'

// Grande carte de type de partie : le nombre maximum de joueurs est l'information principale.
export function PlayTypeCard({ id, icon: Icon, name, description, maxPlayers, playersLabel, disabled, disabledReason, onChoose, autoFocus }) {
  return (
    <button
      type="button"
      id={id}
      data-nav-item
      disabled={disabled}
      autoFocus={autoFocus}
      onClick={onChoose}
      className={
        'group relative flex h-full w-full flex-col gap-6 p-6 text-left transition duration-150 ease-out ' +
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-yellow sm:p-8 ' +
        (disabled
          ? 'cursor-not-allowed bg-brand-ink/60 text-white/40'
          : 'bg-brand-ink/90 text-white shadow-[8px_8px_0_0_rgb(0_0_0/0.35)] hover:bg-brand-ink ' +
            'hover:shadow-[10px_10px_0_0_var(--color-brand-red)] motion-ok:hover:-translate-y-1 motion-ok:active:scale-[0.98]')
      }
    >
      <span className="flex items-start justify-between gap-4">
        <span className={`flex size-16 -skew-x-12 items-center justify-center ${disabled ? 'bg-white/10' : 'bg-brand-red'}`}>
          <Icon aria-hidden="true" className="size-8 skew-x-12" strokeWidth={2.5} />
        </span>
        {disabled ? (
          <Lock aria-hidden="true" className="size-10 text-white/30" strokeWidth={2} />
        ) : (
          <span className="font-display text-7xl leading-none text-brand-yellow sm:text-8xl">{maxPlayers}</span>
        )}
      </span>

      <span className="flex flex-col gap-2">
        <span className="font-display text-3xl uppercase leading-none sm:text-4xl">{name}</span>
        <span className="text-sm text-white/70 sm:text-base">{description}</span>
      </span>

      <span className="mt-auto flex items-center justify-between gap-3">
        <span className="inline-flex -skew-x-12 items-center bg-white/10 px-3 py-2">
          <span className="inline-flex skew-x-12 items-center gap-2 text-sm font-bold uppercase tracking-wider">
            {disabled ? <Lock aria-hidden="true" className="size-4" strokeWidth={2.75} /> : <Users aria-hidden="true" className="size-4" strokeWidth={2.75} />}
            {disabled ? disabledReason : playersLabel}
          </span>
        </span>
        {disabled ? null : (
          <ChevronRight
            aria-hidden="true"
            className="size-7 shrink-0 transition duration-150 ease-out motion-ok:group-hover:translate-x-1"
            strokeWidth={3}
          />
        )}
      </span>
    </button>
  )
}
