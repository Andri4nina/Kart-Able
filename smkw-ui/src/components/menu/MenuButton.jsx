import { ChevronRight, Lock } from 'lucide-react'

const VARIANTS = {
  hero:
    'bg-brand-red text-white shadow-[8px_8px_0_0_var(--color-brand-yellow)] ' +
    'hover:shadow-[11px_11px_0_0_var(--color-brand-yellow)] active:shadow-[4px_4px_0_0_var(--color-brand-yellow)]',
  default:
    'bg-brand-ink/90 text-white shadow-[6px_6px_0_0_rgb(0_0_0/0.35)] ' +
    'hover:bg-brand-ink hover:shadow-[8px_8px_0_0_var(--color-brand-red)] active:shadow-[3px_3px_0_0_rgb(0_0_0/0.35)]',
}

const SIZES = {
  hero: { box: 'px-7 py-5 sm:px-9 sm:py-6', label: 'text-4xl sm:text-5xl', icon: 'size-8 sm:size-9' },
  default: { box: 'px-6 py-3.5', label: 'text-xl sm:text-2xl', icon: 'size-6' },
}

const INTERACTIVE =
  'motion-ok:hover:-translate-y-1 motion-ok:hover:translate-x-1 motion-ok:active:translate-y-0.5 motion-ok:active:scale-[0.98]'

// Entrée de menu parallélogramme. `hero` = gros bouton principal.
// Désactivée : badge (ex. "Bientôt") et cadenas, sans effet de survol.
export function MenuButton({ variant = 'default', icon: Icon, label, description, badge, disabled = false, className = '', ...props }) {
  const size = SIZES[variant] ?? SIZES.default
  const look = disabled ? 'cursor-not-allowed bg-brand-ink/60 text-white/45' : `${VARIANTS[variant] ?? VARIANTS.default} ${INTERACTIVE}`

  return (
    <button
      type="button"
      data-nav-item
      disabled={disabled}
      className={
        'group flex w-full -skew-x-12 items-center text-left transition duration-150 ease-out ' +
        `focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-yellow ${look} ${size.box} ${className}`
      }
      {...props}
    >
      <span className="flex w-full min-w-0 skew-x-12 items-center gap-4">
        {Icon ? <Icon aria-hidden="true" className={`${size.icon} shrink-0`} strokeWidth={2.5} /> : null}
        <span className="flex min-w-0 flex-col">
          <span className={`font-display uppercase leading-none ${size.label}`}>{label}</span>
          {description ? (
            <span className="mt-1.5 truncate text-xs font-semibold tracking-wide opacity-75 sm:text-sm">{description}</span>
          ) : null}
        </span>
        {badge ? (
          <span className="ml-auto inline-flex shrink-0 items-center gap-1 bg-brand-yellow px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-ink">
            <Lock aria-hidden="true" className="size-3" strokeWidth={3} />
            {badge}
          </span>
        ) : (
          <ChevronRight
            aria-hidden="true"
            className="ml-auto size-6 shrink-0 transition duration-150 ease-out motion-ok:group-hover:translate-x-1"
            strokeWidth={3}
          />
        )}
      </span>
    </button>
  )
}
