// Registre des langues : chaque fichier src/locales/<code>.json est découvert
// automatiquement. Ajouter une langue = ajouter un fichier (avec _meta.name).

const modules = import.meta.glob('../locales/*.json', { eager: true, import: 'default' })

export const MESSAGES = Object.fromEntries(
  Object.entries(modules).map(([path, messages]) => [path.match(/([\w-]+)\.json$/)[1], messages]),
)

// Langue de référence : source des clés et repli en cas de traduction manquante.
export const REFERENCE_LOCALE = 'fr'
export const DEFAULT_LOCALE = 'fr'

export const AVAILABLE_LOCALES = Object.entries(MESSAGES)
  .map(([code, messages]) => ({
    code,
    name: messages._meta?.name ?? code,
    order: messages._meta?.order ?? Number.MAX_SAFE_INTEGER,
  }))
  .sort((a, b) => a.order - b.order || a.code.localeCompare(b.code))

export function isSupportedLocale(code) {
  return typeof code === 'string' && Object.hasOwn(MESSAGES, code)
}

// Première langue du navigateur disponible dans le jeu, sinon la langue par défaut.
// Langue demandée par l'adresse (?lang=fr|en|mg : liens partagés, pages des moteurs de
// recherche), ou null.
export function getUrlLocale() {
  if (typeof location === 'undefined') return null
  const lang = new URLSearchParams(location.search).get('lang')?.toLowerCase()
  return isSupportedLocale(lang) ? lang : null
}

export function detectLocale() {
  if (getUrlLocale()) return getUrlLocale()
  const candidates = typeof navigator === 'undefined' ? [] : navigator.languages ?? [navigator.language]
  for (const candidate of candidates) {
    const base = candidate?.toLowerCase().split('-')[0]
    if (isSupportedLocale(base)) return base
  }
  return DEFAULT_LOCALE
}
