// Vérifie le système de traduction (docs/elements/i18n.md).
// 1. Chaque langue a exactement les clés de la langue de référence (fr), mêmes variables {{x}}.
// 2. Aucun texte d'interface écrit en dur dans les composants (tout passe par t()).
// Usage : npm run check:i18n  (code de sortie 1 en cas de problème)
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const UI_ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)))
const LOCALES_DIR = join(UI_ROOT, 'src', 'locales')
const COMPONENT_DIRS = [join(UI_ROOT, 'src', 'components')]
const REFERENCE = 'fr'
const PLURAL_CATEGORIES = new Set(['zero', 'one', 'two', 'few', 'many', 'other'])

const problems = []

// ---------- 1. Parité des clés ----------

const isPluralNode = (node) =>
  node !== null && typeof node === 'object' && Object.keys(node).every((key) => PLURAL_CATEGORIES.has(key))

function flatten(node, prefix = '', out = new Map()) {
  for (const [key, value] of Object.entries(node)) {
    if (key === '_meta') continue
    const path = prefix ? `${prefix}.${key}` : key
    if (isPluralNode(value)) out.set(path, Object.values(value).join(' '))
    else if (value !== null && typeof value === 'object') flatten(value, path, out)
    else out.set(path, String(value))
  }
  return out
}

const variables = (text) => [...text.matchAll(/\{\{(\w+)\}\}/g)].map((match) => match[1]).sort().join(',')

const locales = Object.fromEntries(
  readdirSync(LOCALES_DIR)
    .filter((file) => file.endsWith('.json'))
    .map((file) => [file.replace('.json', ''), JSON.parse(readFileSync(join(LOCALES_DIR, file), 'utf8'))]),
)

if (!locales[REFERENCE]) problems.push(`langue de référence ${REFERENCE}.json introuvable`)
const reference = flatten(locales[REFERENCE] ?? {})

for (const [code, messages] of Object.entries(locales)) {
  if (!messages._meta?.name) problems.push(`${code}.json : _meta.name manquant (nom natif de la langue)`)
  const keys = flatten(messages)
  for (const [key, text] of reference) {
    if (!keys.has(key)) problems.push(`${code}.json : clé manquante "${key}"`)
    else if (variables(keys.get(key)) !== variables(text)) {
      problems.push(`${code}.json : variables différentes pour "${key}" ({{${variables(text)}}} attendu)`)
    }
  }
  for (const key of keys.keys()) {
    if (!reference.has(key)) problems.push(`${code}.json : clé inconnue de ${REFERENCE}.json "${key}"`)
  }
}

// ---------- 2. Texte en dur dans les composants ----------

const JS_KEYWORDS = new Set(['break', 'continue', 'return', 'else', 'default', 'try', 'finally', 'do', 'null', 'undefined', 'true', 'false'])
const TEXT_ATTRIBUTES = /\b(label|title|aria-label|placeholder|alt|description|badge)="([^"]*\p{L}{2,}[^"]*)"/u
const INLINE_TEXT = />([^<>{}`]*\p{L}{2,}[^<>{}`]*)</u
// Ligne JSX ne contenant que du texte : "Settings", "Play now". Les props booléennes
// (disabled, autoFocus) et le code (virgules, deux-points) ne correspondent pas.
const LONE_TEXT_LINE = /^\s*(\p{Lu}[\p{L}'’]*(?:\s+[\p{L}'’]+)*[.!?]?|\p{Ll}[\p{L}'’]*(?:\s+[\p{L}'’]+)+[.!?]?)\s*$/u

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) walk(path, files)
    else if (extname(entry) === '.jsx') files.push(path)
  }
  return files
}

for (const dir of COMPONENT_DIRS) {
  for (const file of walk(dir)) {
    readFileSync(file, 'utf8')
      .split(/\r?\n/)
      .forEach((line, index) => {
        const code = line.replace(/\/\/.*$/, '')
        if (code.trim().startsWith('*') || code.trim().startsWith('/*')) return
        const where = `${relative(UI_ROOT, file)}:${index + 1}`
        const attribute = code.match(TEXT_ATTRIBUTES)
        if (attribute) problems.push(`${where}  texte en dur dans ${attribute[1]}="${attribute[2]}" (utiliser t())`)
        const inline = code.match(INLINE_TEXT)
        if (inline && !code.includes('=>') && inline[1].trim()) problems.push(`${where}  texte en dur "${inline[1].trim()}" (utiliser t())`)
        const lone = code.match(LONE_TEXT_LINE)
        if (lone && !JS_KEYWORDS.has(lone[1].trim())) problems.push(`${where}  texte en dur "${lone[1].trim()}" (utiliser t())`)
      })
  }
}

if (problems.length > 0) {
  console.error(`i18n : ${problems.length} problème(s)\n`)
  for (const problem of problems) console.error(`  ${problem}`)
  process.exit(1)
}
console.log(`i18n : OK (${Object.keys(locales).length} langues, ${reference.size} clés, aucun texte en dur)`)
