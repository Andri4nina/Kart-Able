// Bandeau de capacité bien visible : "Jusqu'à 8 joueurs" / "Jusqu'à 32 joueurs".
export function CapacityBanner({ icon: Icon, label, counter }) {
  return (
    <div className="inline-flex -skew-x-12 items-center bg-brand-yellow px-5 py-2.5 text-brand-ink shadow-[5px_5px_0_0_var(--color-brand-ink)]">
      <span className="inline-flex skew-x-12 items-center gap-3">
        <Icon aria-hidden="true" className="size-6" strokeWidth={2.75} />
        <span className="font-display text-lg uppercase leading-none sm:text-2xl">{label}</span>
        {counter ? (
          <span className="ml-1 bg-brand-ink px-2 py-1 font-display text-sm leading-none text-brand-yellow tabular-nums">{counter}</span>
        ) : null}
      </span>
    </div>
  )
}

// Message d'information non bloquant (ex. serveur pas encore connecté).
export function Notice({ icon: Icon, children }) {
  return (
    <p className="flex items-start gap-3 border-l-4 border-brand-yellow bg-brand-ink/85 px-4 py-3 text-sm font-semibold text-white/85">
      <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-yellow" strokeWidth={2.75} />
      {children}
    </p>
  )
}
