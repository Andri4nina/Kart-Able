// Actions abstraites produites par n'importe quel périphérique.
// Les écrans ne connaissent que ces actions, jamais les touches ou boutons physiques.

export const INPUT_ACTIONS = Object.freeze({
  START: 'start',
  CONFIRM: 'confirm',
  BACK: 'back',
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
  // Course : assignables dès maintenant, utilisées quand les karts rouleront (phase 2).
  ACCELERATE: 'accelerate',
  BRAKE: 'brake',
  STEER_LEFT: 'steerLeft',
  STEER_RIGHT: 'steerRight',
  DRIFT: 'drift',
  ITEM: 'item',
})

export const ACTION_LIST = Object.freeze(Object.values(INPUT_ACTIONS))

// Contexte d'une action : deux actions d'un même contexte ne peuvent pas partager une touche
// (une même touche peut servir dans les menus et en course). START (rejoindre, pause) vaut
// partout : il entre en conflit avec toutes les autres.
export const ACTION_CONTEXTS = Object.freeze({
  start: 'global',
  confirm: 'menu',
  back: 'menu',
  up: 'menu',
  down: 'menu',
  left: 'menu',
  right: 'menu',
  accelerate: 'race',
  brake: 'race',
  steerLeft: 'race',
  steerRight: 'race',
  drift: 'race',
  item: 'race',
})

export function shareContext(a, b) {
  const contextA = ACTION_CONTEXTS[a]
  const contextB = ACTION_CONTEXTS[b]
  return contextA === contextB || contextA === 'global' || contextB === 'global'
}

// Ordre d'affichage dans l'onglet Contrôles des paramètres.
export const ACTION_GROUPS = Object.freeze([
  { id: 'menu', actions: ['start', 'confirm', 'back', 'up', 'down', 'left', 'right'] },
  { id: 'race', actions: ['accelerate', 'brake', 'steerLeft', 'steerRight', 'drift', 'item'] },
])

// Masque binaire par action : permet de comparer l'état d'une manette d'une frame
// à l'autre sans allouer d'objet.
export const ACTION_BITS = Object.freeze(Object.fromEntries(ACTION_LIST.map((action, index) => [action, 1 << index])))
