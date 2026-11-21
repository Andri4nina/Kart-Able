import { useEffect, useState } from 'react'

// Disposition réelle du clavier : event.code -> caractère imprimé sur la touche, pour afficher
// Z et non W sur un clavier AZERTY. Deux sources :
// - la Keyboard API quand le navigateur la fournit (lue une fois) ;
// - les touches frappées : chaque lettre ou chiffre pressé apprend son caractère (tous les
//   navigateurs). Sans ces informations, les noms par défaut (QWERTY) sont utilisés.
const layout = new Map()
const subscribers = new Set()
let installed = false

function notify() {
  for (const subscriber of subscribers) subscriber()
}

function learn(event) {
  if (event.key?.length !== 1 || !/^(Key|Digit)/.test(event.code) || layout.get(event.code) === event.key) return
  layout.set(event.code, event.key)
  notify()
}

function install() {
  if (installed) return
  installed = true
  window.addEventListener('keydown', learn, true)
  const request = navigator.keyboard?.getLayoutMap?.()
  request
    ?.then((map) => {
      for (const [code, key] of map) if (!layout.has(code)) layout.set(code, key)
      notify()
    })
    .catch(() => {})
}

// Renvoie la carte (toujours la même) ; le composant se re-rend quand elle s'enrichit.
export function useKeyboardLayout() {
  const [, setVersion] = useState(0)

  useEffect(() => {
    install()
    const subscriber = () => setVersion((version) => version + 1)
    subscribers.add(subscriber)
    return () => subscribers.delete(subscriber)
  }, [])

  return layout
}
