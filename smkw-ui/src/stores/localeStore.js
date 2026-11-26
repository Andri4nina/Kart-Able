import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { detectLocale, getUrlLocale, isSupportedLocale } from '../i18n/locales'

// Langue active, persistée en localStorage (clé smkw-locale).
// Changer la langue re-rend uniquement les composants qui traduisent : aucun rechargement.
export const useLocaleStore = create(
  persist(
    (set) => ({
      locale: detectLocale(),
      setLocale: (locale) => {
        if (isSupportedLocale(locale)) set({ locale })
      },
    }),
    {
      name: 'smkw-locale',
      version: 1,
      partialize: ({ locale }) => ({ locale }),
      // La langue de l'adresse (?lang=) l'emporte ; une langue sauvegardée puis retirée du jeu
      // retombe sur la détection.
      merge: (persisted, current) => ({
        ...current,
        locale: getUrlLocale() ?? (isSupportedLocale(persisted?.locale) ? persisted.locale : current.locale),
      }),
    },
  ),
)
