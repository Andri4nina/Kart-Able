// Capture de la prochaine touche ou du prochain bouton pour l'assignation (onglet Contrôles).
// Lit les périphériques physiques : c'est pourquoi elle vit dans src/input. Pendant la capture,
// la touche ne déclenche rien d'autre (ni Échap qui fermerait les paramètres, ni le jeu) :
// Échap annule. Chaque fonction renvoie l'arrêt de la capture.

function swallowKeys(onKey) {
  const onKeyDown = (event) => {
    event.preventDefault()
    event.stopImmediatePropagation()
    if (!event.repeat) onKey(event.code)
  }
  // Phase de capture sur window : avant tout autre écouteur de l'application.
  window.addEventListener('keydown', onKeyDown, true)
  return () => window.removeEventListener('keydown', onKeyDown, true)
}

export function captureKey({ onInput, onCancel }) {
  return swallowKeys((code) => (code === 'Escape' ? onCancel() : onInput(code)))
}

// Premier bouton nouvellement appuyé sur une manette (les boutons déjà enfoncés au début de la
// capture sont ignorés jusqu'à leur relâchement). Échap au clavier annule.
export function captureGamepadButton({ onInput, onCancel }) {
  let active = true
  let frame = 0
  const held = new Set()
  let first = true

  const stop = () => {
    active = false
    cancelAnimationFrame(frame)
    releaseKeys()
  }
  const releaseKeys = swallowKeys((code) => {
    if (code !== 'Escape') return
    stop()
    onCancel()
  })

  const poll = () => {
    if (!active) return
    for (const pad of navigator.getGamepads?.() ?? []) {
      if (!pad?.connected) continue
      for (let index = 0; index < pad.buttons.length; index += 1) {
        const key = `${pad.index}:${index}`
        if (!pad.buttons[index].pressed) held.delete(key)
        else if (first) held.add(key)
        else if (!held.has(key)) {
          stop()
          onInput(index)
          return
        }
      }
    }
    first = false
    frame = requestAnimationFrame(poll)
  }
  frame = requestAnimationFrame(poll)
  return stop
}
