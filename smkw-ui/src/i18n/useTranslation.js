import { useCallback } from 'react'
import { useLocaleStore } from '../stores/localeStore'
import { translate } from './translate'

// Hook unique pour tous les textes de l'UI : const { t } = useTranslation()
export function useTranslation() {
  const locale = useLocaleStore((state) => state.locale)
  const setLocale = useLocaleStore((state) => state.setLocale)
  const t = useCallback((key, params) => translate(locale, key, params), [locale])
  return { t, locale, setLocale }
}

// Variante hors React (tests, logs) : lit la langue courante à la volée.
export function t(key, params) {
  return translate(useLocaleStore.getState().locale, key, params)
}
