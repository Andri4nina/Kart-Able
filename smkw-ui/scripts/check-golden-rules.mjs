// Vérifie automatiquement les règles d'or (docs/REGLES_D_OR.md).
// Usage : npm run check:rules  (code de sortie 1 si une règle est violée)
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const UI_ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)))
const REPO_ROOT = resolve(UI_ROOT, '..')

const CODE_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.css', '.html', '.svg', '.json'])
const TEXT_EXTENSIONS = new Set([...CODE_EXTENSIONS, '.md', '.json'])
const IGNORED_DIRS = new Set(['node_modules', 'dist', '.git', 'graphify-out', 'output', 'target', 'gen']) // target, gen : builds Rust / Tauri

const GRADIENT_PATTERNS = [
  { regex: /linear-gradient\s*\(/i, label: 'linear-gradient()' },
  { regex: /<linearGradient\b/, label: 'SVG <linearGradient>' },
  { regex: /\bbg-linear-/, label: 'classe Tailwind bg-linear-*' },
  { regex: /\bbg-gradient-/, label: 'classe Tailwind bg-gradient-*' },
  { regex: /\bLinearGradient\b/, label: 'LinearGradient (API)' },
]

const EMOJI = /\p{Extended_Pictographic}/u

const FORBIDDEN_PACKAGES = [
  'gsap',
  '@react-spring/web',
  'react-spring',
  'animejs',
  'styled-components',
  '@emotion/react',
  '@emotion/styled',
  'bootstrap',
  'bulma',
  'sass',
]

function walk(dir, extensions, files = []) {
  for (const entry of readdirSync(dir)) {
    if (IGNORED_DIRS.has(entry)) continue
    const path = join(dir, entry)
    const stats = statSync(path)
    if (stats.isDirectory()) walk(path, extensions, files)
    else if (extensions.has(extname(entry))) files.push(path)
  }
  return files
}

const violations = []
const report = (file, line, message) =>
  violations.push(`${relative(REPO_ROOT, file)}:${line}  ${message}`)

function scan(file, { gradients }) {
  const lines = readFileSync(file, 'utf8').split(/\r?\n/)
  lines.forEach((text, index) => {
    if (EMOJI.test(text)) report(file, index + 1, 'emoji interdit (utiliser une icône lucide-react)')
    if (!gradients) return
    for (const { regex, label } of GRADIENT_PATTERNS) {
      if (regex.test(text)) report(file, index + 1, `dégradé linéaire interdit : ${label}`)
    }
  })
}

// 1. Code du front : ni dégradé linéaire, ni emoji.
const codeRoots = [join(UI_ROOT, 'src'), join(UI_ROOT, 'public')]
for (const root of codeRoots) for (const file of walk(root, CODE_EXTENSIONS)) scan(file, { gradients: true })
scan(join(UI_ROOT, 'index.html'), { gradients: true })

// 2. Documentation et fichiers texte : pas d'emoji.
for (const file of walk(REPO_ROOT, TEXT_EXTENSIONS)) {
  if (file.startsWith(join(UI_ROOT, 'src')) || file.startsWith(join(UI_ROOT, 'public'))) continue
  if (file.endsWith('package-lock.json')) continue
  scan(file, { gradients: false })
}

// 3. Un seul fichier CSS (celui de Tailwind), pas de CSS Modules.
for (const file of walk(join(UI_ROOT, 'src'), new Set(['.css', '.scss', '.sass', '.less']))) {
  if (relative(join(UI_ROOT, 'src'), file) !== 'index.css') {
    report(file, 1, 'fichier de style supplémentaire interdit (Tailwind uniquement)')
  }
}

// 4. Dépendances interdites.
const pkg = JSON.parse(readFileSync(join(UI_ROOT, 'package.json'), 'utf8'))
const deps = { ...pkg.dependencies, ...pkg.devDependencies }
for (const name of FORBIDDEN_PACKAGES) {
  if (name in deps) report(join(UI_ROOT, 'package.json'), 1, `dépendance interdite : ${name}`)
}

// 5. Couleurs d'identité des personnages : config/characters.js et tokens char-* de index.css identiques.
const { CHARACTERS } = await import(pathToFileURL(join(UI_ROOT, 'src', 'config', 'characters.js')).href)
const cssFile = join(UI_ROOT, 'src', 'index.css')
const css = readFileSync(cssFile, 'utf8')
for (const { id, color } of CHARACTERS) {
  const token = new RegExp(`--color-char-${id}:\\s*(#[0-9a-fA-F]{6})`).exec(css)
  if (!token) report(cssFile, 1, `token --color-char-${id} manquant (couleur du personnage ${id})`)
  else if (token[1].toLowerCase() !== color.toLowerCase()) {
    report(cssFile, 1, `--color-char-${id} (${token[1]}) différent de config/characters.js (${color})`)
  }
}

// 6. Taille des fichiers (indicatif, non bloquant) : environ 100 lignes maximum.
const MAX_LINES = 100
const oversized = walk(join(UI_ROOT, 'src'), new Set(['.js', '.jsx']))
  .map((file) => ({ file, lines: readFileSync(file, 'utf8').split(/\r?\n/).length }))
  .filter(({ lines }) => lines > MAX_LINES + 10)
  .sort((a, b) => b.lines - a.lines)
if (oversized.length > 0) {
  console.log(`Info : ${oversized.length} fichier(s) au-delà de ~${MAX_LINES} lignes, à découper lors de leur prochaine modification :`)
  for (const { file, lines } of oversized) console.log(`  ${relative(REPO_ROOT, file)} (${lines})`)
}

if (violations.length > 0) {
  console.error(`Règles d'or : ${violations.length} violation(s)\n`)
  for (const violation of violations) console.error(`  ${violation}`)
  process.exit(1)
}
console.log("Règles d'or : OK (aucun dégradé linéaire, aucun emoji, Tailwind seul, aucune lib interdite)")
