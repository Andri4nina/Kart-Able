// Bouton carré icône seule. Le label est obligatoire (accessibilité).
export function IconButton({ icon: Icon, label, className = '', ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={
        'inline-flex size-11 shrink-0 -skew-x-12 items-center justify-center bg-brand-ink/90 text-white ' +
        'ring-1 ring-white/10 transition duration-150 ease-out hover:bg-brand-red ' +
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-yellow ' +
        `motion-ok:hover:-translate-y-0.5 motion-ok:active:scale-95 ${className}`
      }
      {...props}
    >
      <Icon aria-hidden="true" className="size-5 skew-x-12" strokeWidth={2.5} />
    </button>
  )
}
