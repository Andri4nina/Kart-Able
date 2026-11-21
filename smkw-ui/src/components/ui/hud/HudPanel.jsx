// Cadre commun des éléments du HUD : parallélogramme sombre, contenu redressé.
export function HudPanel({ className = '', children }) {
  return (
    <div className={`-skew-x-12 bg-brand-ink/85 shadow-[4px_4px_0_0_rgb(0_0_0/0.3)] ${className}`}>
      <div className="skew-x-12">{children}</div>
    </div>
  )
}

export function HudLabel({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-white/55">
      {Icon ? <Icon aria-hidden="true" className="size-3" strokeWidth={3} /> : null}
      {children}
    </span>
  )
}
