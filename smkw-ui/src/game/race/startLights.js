import { START_COUNTDOWN } from '../../config/race'

// Compte à rebours du départ (calcul pur) : « 3 » à START_COUNTDOWN.firstAt, puis un chiffre par
// seconde ; le départ est donné à la fin du « 1 ».
export function createStartSequence() {
  return Object.freeze({ goAt: START_COUNTDOWN.firstAt + START_COUNTDOWN.count * START_COUNTDOWN.interval })
}

// Chiffre affiché à l'instant `time` : 3, 2, 1 ; 0 avant le « 3 » et après le départ.
export function getCountdown(sequence, time) {
  if (time < START_COUNTDOWN.firstAt || time >= sequence.goAt) return 0
  return START_COUNTDOWN.count - Math.floor((time - START_COUNTDOWN.firstAt) / START_COUNTDOWN.interval)
}

// Moment de l'appui sur l'accélérateur pendant le compte à rebours, retenu tant qu'il reste
// enfoncé : chiffre affiché lors de l'appui (3, 2, 1), EARLY avant le « 3 », 0 relâché.
export const EARLY = START_COUNTDOWN.count + 1

export function trackStartPress(kart, sequence, time, pressedNow, pressedBefore) {
  if (!pressedNow) kart.startPress = 0
  else if (!pressedBefore) kart.startPress = getCountdown(sequence, time) || EARLY
}

// Au départ : 'boost' (appui pendant le « 3 », tenu), 'stall' (appui avant le « 3 », tenu), ou null.
export function resolveStart(kart) {
  if (kart.startPress === START_COUNTDOWN.boostOn) return 'boost'
  if (kart.startPress === EARLY) return 'stall'
  return null
}
