import { ACTION_BITS, INPUT_ACTIONS } from './actions'
import { getGamepadButtonBindings } from './bindingLookup'

// Boutons : d'après l'assignation commune des manettes (onglet Contrôles des paramètres),
// disposition « standard » de la Gamepad API (https://w3c.github.io/gamepad/#remapping).
// Le stick gauche dirige toujours (menus et course), il n'est pas réassignable.
const STICK_THRESHOLD = 0.55
const { UP, DOWN, LEFT, RIGHT, STEER_LEFT, STEER_RIGHT } = INPUT_ACTIONS
const STICK = {
  left: ACTION_BITS[LEFT] | ACTION_BITS[STEER_LEFT],
  right: ACTION_BITS[RIGHT] | ACTION_BITS[STEER_RIGHT],
  up: ACTION_BITS[UP],
  down: ACTION_BITS[DOWN],
}

// Masque des actions actives sur une manette (boutons + stick gauche), sans allocation.
export function readGamepadMask(pad) {
  let mask = 0
  for (const [buttonIndex, action] of getGamepadButtonBindings()) {
    if (pad.buttons[buttonIndex]?.pressed) mask |= ACTION_BITS[action]
  }
  const x = pad.axes[0] ?? 0
  const y = pad.axes[1] ?? 0
  if (x < -STICK_THRESHOLD) mask |= STICK.left
  if (x > STICK_THRESHOLD) mask |= STICK.right
  if (y < -STICK_THRESHOLD) mask |= STICK.up
  if (y > STICK_THRESHOLD) mask |= STICK.down
  return mask
}
