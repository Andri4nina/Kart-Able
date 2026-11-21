import { ACTION_LIST, shareContext } from './actions'
import { BINDING_PROFILES, BINDING_SLOTS, DEFAULT_BINDINGS, getBindingProfile, RESERVED_CODES } from './bindingDefaults'

// Règles pures d'assignation des touches. `bindings` = { profileId: { action: [entrées] } },
// une entrée étant un event.code (clavier) ou un indice de bouton (manette).
// Chaque fonction renvoie { bindings, result } : bindings inchangés si refus.

// Seul START est obligatoire : sans lui, un périphérique ne peut plus rejoindre la partie.
const REQUIRED_ACTIONS = new Set(['start'])

const setEntries = (bindings, profileId, action, entries) => ({
  ...bindings,
  [profileId]: { ...bindings[profileId], [action]: entries },
})

// Une entrée par emplacement (0 = principale, 1 = secondaire), sans trou ni doublon.
function placeEntry(entries, slot, input) {
  const next = [...entries]
  next[Math.min(slot, next.length)] = input
  return next.filter((entry, index) => entry !== undefined && entry !== null && next.indexOf(entry) === index).slice(0, BINDING_SLOTS)
}

// Action du même contexte qui utilise déjà cette entrée dans le profil (autre que `action`).
function findClash(profileBindings, action, input) {
  return ACTION_LIST.find((other) => other !== action && shareContext(other, action) && profileBindings[other]?.includes(input)) ?? null
}

export function assignBinding(bindings, profileId, action, slot, input) {
  const profile = getBindingProfile(profileId)
  if (!profile) return { bindings, result: { type: 'invalid' } }
  if (profile.kind === 'keyboard') {
    if (RESERVED_CODES.has(input)) return { bindings, result: { type: 'reserved', input } }
    const other = BINDING_PROFILES.find((candidate) => candidate.kind === 'keyboard' && candidate.id !== profileId && Object.values(bindings[candidate.id]).some((entries) => entries.includes(input)))
    if (other) return { bindings, result: { type: 'usedByOther', input, profileId: other.id } }
  }

  const previous = bindings[profileId][action][slot] ?? null
  let next = setEntries(bindings, profileId, action, placeEntry(bindings[profileId][action], slot, input))
  const clash = findClash(bindings[profileId], action, input)
  if (!clash) return { bindings: next, result: { type: 'assigned', input, action } }

  // Conflit dans le même profil : l'autre action récupère l'ancienne touche (échange).
  const clashEntries = bindings[profileId][clash].filter((entry) => entry !== input)
  const swapped = previous !== null && previous !== input && !clashEntries.includes(previous) ? [previous, ...clashEntries] : clashEntries
  if (swapped.length === 0 && REQUIRED_ACTIONS.has(clash)) return { bindings, result: { type: 'required', action: clash } }
  next = setEntries(next, profileId, clash, swapped.slice(0, BINDING_SLOTS))
  return { bindings: next, result: { type: 'swapped', input, action, otherAction: clash, otherInput: previous } }
}

export function clearBinding(bindings, profileId, action, slot) {
  const entries = bindings[profileId]?.[action]
  if (!entries?.[slot] && entries?.[slot] !== 0) return { bindings, result: { type: 'unchanged' } }
  const remaining = entries.filter((_, index) => index !== slot)
  if (remaining.length === 0 && REQUIRED_ACTIONS.has(action)) return { bindings, result: { type: 'required', action } }
  return { bindings: setEntries(bindings, profileId, action, remaining), result: { type: 'cleared', action } }
}

export function resetProfile(bindings, profileId) {
  return { ...bindings, [profileId]: structuredClone(DEFAULT_BINDINGS[profileId]) }
}

// Réglages sauvegardés : complétés par les valeurs par défaut (nouvelles actions), entrées
// invalides écartées. Un réglage illisible redonne simplement les touches par défaut.
export function normalizeBindings(saved) {
  return Object.fromEntries(
    BINDING_PROFILES.map(({ id, kind }) => {
      const valid = (entry) => (kind === 'keyboard' ? typeof entry === 'string' && !RESERVED_CODES.has(entry) : Number.isInteger(entry) && entry >= 0)
      const actions = ACTION_LIST.map((action) => {
        const entries = saved?.[id]?.[action]
        return [action, Array.isArray(entries) ? entries.filter(valid).slice(0, BINDING_SLOTS) : [...DEFAULT_BINDINGS[id][action]]]
      })
      return [id, Object.fromEntries(actions)]
    }),
  )
}
