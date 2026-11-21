import { ArrowLeft } from 'lucide-react'
import { useTranslation } from '../../i18n/useTranslation'
import { useNavigationStore } from '../../stores/navigationStore'

export function BackButton() {
  const { t } = useTranslation()
  const back = useNavigationStore((state) => state.back)

  return (
    <button
      type="button"
      id="back-btn"
      onClick={back}
      aria-label={t('common.back')}
      className={
        'inline-flex shrink-0 -skew-x-12 items-center bg-brand-ink/90 px-3 py-2.5 text-white ring-1 ring-white/10 ' +
        'transition duration-150 ease-out hover:bg-brand-red focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-yellow ' +
        'motion-ok:hover:-translate-x-1 motion-ok:active:scale-95 sm:px-4'
      }
    >
      <span className="inline-flex skew-x-12 items-center gap-2 text-sm font-bold uppercase tracking-widest">
        <ArrowLeft aria-hidden="true" className="size-5" strokeWidth={2.75} />
        <span className="hidden sm:inline">{t('common.back')}</span>
      </span>
    </button>
  )
}
