import { Flag } from 'lucide-react'
import { BRAND } from '../../config/gameConfig'
import { useTranslation } from '../../i18n/useTranslation'

// Logo typographique : ombres portées pleines (aucun dégradé).
export function Logo() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-start gap-5">
      <span className="inline-flex -skew-x-12 bg-brand-yellow px-3 py-1.5 text-brand-ink shadow-[4px_4px_0_0_var(--color-brand-ink)]">
        <span className="inline-flex skew-x-12 items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] sm:text-sm">
          <Flag aria-hidden="true" className="size-4" strokeWidth={2.75} />
          {t('brand.tagline')}
        </span>
      </span>
      <h1 className="font-display text-7xl leading-[0.85] text-white [text-shadow:0.05em_0.05em_0_var(--color-brand-red),0.1em_0.1em_0_var(--color-brand-ink)] sm:text-8xl lg:text-9xl">
        {BRAND.name}
      </h1>
    </div>
  )
}
