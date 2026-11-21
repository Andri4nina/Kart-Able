import { ChevronRight } from 'lucide-react'

const BASE =
  'group inline-flex -skew-x-12 items-center justify-center font-display uppercase tracking-wide transition duration-150 ease-out ' +
  'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-yellow ' +
  'motion-ok:hover:-translate-y-1 motion-ok:hover:scale-[1.03] motion-ok:active:translate-y-0.5 motion-ok:active:scale-[0.97] ' +
  'disabled:pointer-events-none disabled:opacity-50'

const VARIANTS = {
  primary:
    'bg-brand-red text-white shadow-[6px_6px_0_0_var(--color-brand-yellow)] ' +
    'hover:shadow-[9px_9px_0_0_var(--color-brand-yellow)] active:shadow-[3px_3px_0_0_var(--color-brand-yellow)]',
  secondary:
    'bg-brand-ink/90 text-white shadow-[6px_6px_0_0_rgb(0_0_0/0.35)] ' +
    'hover:bg-brand-ink hover:shadow-[9px_9px_0_0_rgb(0_0_0/0.35)] active:shadow-[3px_3px_0_0_rgb(0_0_0/0.35)]',
}

const SIZES = {
  lg: 'min-w-64 px-8 py-4 text-2xl',
  md: 'min-w-44 px-6 py-3 text-lg',
}

const ICON_SIZES = { lg: 'size-6', md: 'size-5' }

// Bouton de jeu parallélogramme. Micro-interactions 100 % Tailwind (hover / active).
export function Button({
  variant = 'primary',
  size = 'lg',
  icon: Icon,
  showArrow = false,
  className = '',
  children,
  ...props
}) {
  return (
    <button
      type="button"
      className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      <span className="inline-flex skew-x-12 items-center gap-3">
        {Icon ? <Icon aria-hidden="true" className={ICON_SIZES[size]} strokeWidth={2.5} /> : null}
        <span>{children}</span>
        {showArrow ? (
          <ChevronRight
            aria-hidden="true"
            className={`${ICON_SIZES[size]} transition duration-150 ease-out motion-ok:group-hover:translate-x-1`}
            strokeWidth={3}
          />
        ) : null}
      </span>
    </button>
  )
}
