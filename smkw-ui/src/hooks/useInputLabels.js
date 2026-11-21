import { useTranslation } from '../i18n/useTranslation'
import { describeInput, getDeviceKeys } from '../input/keyLabels'
import { useKeyboardLayout } from '../input/useKeyboardLayout'
import { useBindingsStore } from '../stores/bindingsStore'

// Nom affichable d'une touche (clavier) ou d'un bouton (manette), traduit et adapté à la
// disposition réelle du clavier. `label(kind, entry)` renvoie null pour une entrée vide.
export function useInputLabel() {
  const { t } = useTranslation()
  const layout = useKeyboardLayout()
  return (kind, entry) => {
    if (entry === undefined || entry === null) return null
    const description = describeInput(kind, entry, layout)
    return description.labelKey ? t(description.labelKey, description.params) : description.text
  }
}

// Touches d'un périphérique pour les aides à l'écran (START, RETOUR, déplacements), d'après
// l'assignation en cours : elles suivent les changements faits dans les paramètres.
export function useDeviceKeyLabels(device) {
  const { t } = useTranslation()
  const label = useInputLabel()
  const bindings = useBindingsStore((state) => state.bindings)
  const keys = device ? getDeviceKeys(device, bindings) : null
  if (!keys) return null
  const moveParts = keys.move.map((entry) => label(keys.kind, entry)).filter(Boolean)
  const compact = moveParts.every((part) => part.length === 1)
  return {
    start: label(keys.kind, keys.start),
    back: label(keys.kind, keys.back),
    move: keys.moveLabelKey ? t(keys.moveLabelKey) : moveParts.join(compact ? '' : ' '),
  }
}
