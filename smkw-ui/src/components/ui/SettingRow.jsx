// Ligne de réglage : icône + libellé (+ valeur courante) au-dessus du contrôle.
export function SettingRow({ icon: Icon, label, htmlFor, value, hint, children }) {
  const LabelTag = htmlFor ? 'label' : 'span'
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-3">
        <LabelTag
          htmlFor={htmlFor}
          className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white"
        >
          <Icon aria-hidden="true" className="size-4 text-brand-yellow" strokeWidth={2.5} />
          {label}
        </LabelTag>
        {value !== undefined ? (
          <span className="font-display text-base tabular-nums text-brand-yellow">{value}</span>
        ) : null}
      </div>
      {children}
      {hint ? <p className="text-xs text-white/50">{hint}</p> : null}
    </div>
  )
}
