import { MESSAGES, REFERENCE_LOCALE } from './locales'

// Moteur de traduction minimal, sans dépendance :
// - clés en chemin pointé : t('mainMenu.play')
// - interpolation : "Jusqu'à {{count}} joueurs"
// - pluriels (Intl.PluralRules) : objet { one, other, ... } + param `count`
// - ordinaux : objet { one, two, few, other } + param `ordinal`

const PLURAL_CATEGORIES = new Set(['zero', 'one', 'two', 'few', 'many', 'other'])
const pluralRulesCache = new Map()
const warnedKeys = new Set()

function getPluralRules(locale, type) {
  const cacheKey = `${locale}:${type}`
  if (!pluralRulesCache.has(cacheKey)) pluralRulesCache.set(cacheKey, new Intl.PluralRules(locale, { type }))
  return pluralRulesCache.get(cacheKey)
}

function lookup(messages, key) {
  return key.split('.').reduce((node, part) => (node == null ? undefined : node[part]), messages)
}

function isPluralNode(node) {
  return node !== null && typeof node === 'object' && Object.keys(node).every((k) => PLURAL_CATEGORIES.has(k))
}

function resolvePlural(node, locale, params) {
  if (!isPluralNode(node)) return node
  let category = 'other'
  if (typeof params?.ordinal === 'number') category = getPluralRules(locale, 'ordinal').select(params.ordinal)
  else if (typeof params?.count === 'number') category = getPluralRules(locale, 'cardinal').select(params.count)
  return node[category] ?? node.other
}

function interpolate(template, params) {
  if (!params) return template
  return template.replace(/\{\{(\w+)\}\}/g, (match, name) => (name in params ? String(params[name]) : match))
}

function warnMissing(locale, key) {
  if (!import.meta.env.DEV || warnedKeys.has(`${locale}:${key}`)) return
  warnedKeys.add(`${locale}:${key}`)
  console.warn(`[i18n] clé manquante "${key}" (${locale})`)
}

export function translate(locale, key, params) {
  let value = resolvePlural(lookup(MESSAGES[locale], key), locale, params)
  if (typeof value !== 'string') {
    warnMissing(locale, key)
    value = resolvePlural(lookup(MESSAGES[REFERENCE_LOCALE], key), REFERENCE_LOCALE, params)
  }
  if (typeof value !== 'string') return key
  return interpolate(value, params)
}
