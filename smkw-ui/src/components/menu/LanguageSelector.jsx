import { Check, ChevronDown, Languages } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { popoverVariants } from '../../animations/variants'
import { useArrowNavigation } from '../../hooks/useArrowNavigation'
import { AVAILABLE_LOCALES } from '../../i18n/locales'
import { useTranslation } from '../../i18n/useTranslation'

// Liste des langues découvertes dans src/locales (noms natifs lus depuis _meta.name).
export function LanguageList({ onPicked }) {
  const { locale, setLocale } = useTranslation()
  const onArrowKeys = useArrowNavigation()

  return (
    <ul className="flex flex-col gap-1" onKeyDown={onArrowKeys}>
      {AVAILABLE_LOCALES.map(({ code, name }) => {
        const active = code === locale
        return (
          <li key={code}>
            <button
              type="button"
              id={`language-${code}-btn`}
              data-nav-item
              aria-pressed={active}
              onClick={() => {
                setLocale(code)
                onPicked?.()
              }}
              className={
                'flex w-full items-center gap-3 px-3 py-2.5 text-left transition duration-150 ease-out ' +
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow ' +
                (active ? 'bg-brand-red text-white' : 'text-white/80 hover:bg-white/10 hover:text-white')
              }
            >
              <span className="w-8 font-display text-xs">{code.toUpperCase()}</span>
              <span lang={code} className="flex-1 font-semibold">
                {name}
              </span>
              {active ? <Check aria-hidden="true" className="size-4" strokeWidth={3} /> : null}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

// Sélecteur compact (menu principal) : bouton + panneau déroulant.
function CompactLanguageSelector() {
  const { t, locale } = useTranslation()
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  const onKeyDown = (event) => {
    if (event.key !== 'Escape' || !open) return
    // Échap ferme d'abord le panneau, sans déclencher le retour global.
    event.stopPropagation()
    setOpen(false)
    buttonRef.current?.focus()
  }

  return (
    <div ref={rootRef} className="relative" onKeyDown={onKeyDown}>
      <button
        ref={buttonRef}
        type="button"
        id="language-btn"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={t('language.change')}
        onClick={() => setOpen((value) => !value)}
        className={
          'inline-flex -skew-x-12 items-center bg-brand-ink/90 px-4 py-2.5 text-white ring-1 ring-white/10 ' +
          'transition duration-150 ease-out hover:bg-brand-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-yellow ' +
          'motion-ok:hover:-translate-y-0.5 motion-ok:active:scale-95'
        }
      >
        <span className="inline-flex skew-x-12 items-center gap-2">
          <Languages aria-hidden="true" className="size-5 text-brand-yellow" strokeWidth={2.5} />
          <span className="font-display text-sm">{locale.toUpperCase()}</span>
          <ChevronDown
            aria-hidden="true"
            className={`size-4 transition duration-150 ease-out ${open ? 'rotate-180' : ''}`}
            strokeWidth={3}
          />
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            variants={popoverVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 top-full z-10 mt-3 w-56 origin-top-right bg-brand-ink p-2 shadow-[6px_6px_0_0_var(--color-brand-red)]"
          >
            <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.25em] text-white/50">{t('language.label')}</p>
            <LanguageList onPicked={() => setOpen(false)} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export function LanguageSelector({ variant = 'list' }) {
  return variant === 'compact' ? <CompactLanguageSelector /> : <LanguageList />
}
