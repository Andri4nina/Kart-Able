import { DURATION, EASE_IN_OUT, EASE_OUT, STAGGER } from './transitions'

// Variants Motion réutilisables. Les états sont toujours nommés hidden / visible / exit.
// Avec MotionConfig reducedMotion="always", Motion ne garde que les fondus d'opacité.

const exitFast = { opacity: 0, transition: { duration: DURATION.fast, ease: EASE_OUT } }

export const screenVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.fast, when: 'beforeChildren', staggerChildren: STAGGER.base },
  },
  exit: exitFast,
}

export const titleVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DURATION.slow, ease: EASE_OUT },
  },
}

export const staggerList = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER.base, delayChildren: 0.12 } },
}

export const slideInItem = {
  hidden: { opacity: 0, x: -36 },
  visible: { opacity: 1, x: 0, transition: { duration: DURATION.base, ease: EASE_OUT } },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.base, ease: EASE_OUT } },
}

// HUD : conteneur retardé pour apparaître pendant le passage du wipe.
export const hudContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.fast, delayChildren: 0.3, staggerChildren: STAGGER.tight },
  },
  exit: exitFast,
}

const HUD_OFFSETS = {
  left: { x: -40, y: 0 },
  right: { x: 40, y: 0 },
  top: { x: 0, y: -32 },
  bottom: { x: 0, y: 32 },
}

function hudSlide({ x, y }) {
  return {
    hidden: { opacity: 0, x, y },
    visible: { opacity: 1, x: 0, y: 0, transition: { duration: DURATION.base, ease: EASE_OUT } },
  }
}

export const hudFrom = Object.freeze({
  left: hudSlide(HUD_OFFSETS.left),
  right: hudSlide(HUD_OFFSETS.right),
  top: hudSlide(HUD_OFFSETS.top),
  bottom: hudSlide(HUD_OFFSETS.bottom),
})

export const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.fast } },
  exit: { opacity: 0, transition: { duration: DURATION.fast, delay: 0.05 } },
}

export const dialogVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: DURATION.base, ease: EASE_OUT } },
  exit: { opacity: 0, y: 12, scale: 0.98, transition: { duration: DURATION.fast, ease: EASE_OUT } },
}

export const wipeTransition = { duration: DURATION.wipe, ease: EASE_IN_OUT }

// Pages du parcours menu : glissement selon le sens de navigation (custom = +1 avant, -1 retour).
const PAGE_SHIFT = 56

export const pageVariants = {
  enter: (direction = 1) => ({ opacity: 0, x: PAGE_SHIFT * direction }),
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.base, ease: EASE_OUT, when: 'beforeChildren', staggerChildren: STAGGER.tight },
  },
  exit: (direction = 1) => ({
    opacity: 0,
    x: -PAGE_SHIFT * direction,
    transition: { duration: DURATION.fast, ease: EASE_OUT },
  }),
}

// Enfants d'une page : apparition séquentielle (hérite du stagger de la page).
export const pageItem = {
  enter: { opacity: 0, y: 18 },
  center: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE_OUT } },
}

export const pageList = {
  enter: {},
  center: { transition: { staggerChildren: STAGGER.tight } },
}

// Petits panneaux (sélecteur de langue) : ouverture / fermeture.
export const popoverVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: DURATION.fast, ease: EASE_OUT } },
  exit: { opacity: 0, y: -6, scale: 0.98, transition: { duration: DURATION.fast, ease: EASE_OUT } },
}

// Contenu d'onglet (réglages) et messages courts.
export const swapVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.fast, ease: EASE_OUT } },
  exit: { opacity: 0, y: -8, transition: { duration: DURATION.fast, ease: EASE_OUT } },
}

// Indicateur de sélection partagé entre cartes / onglets (layoutId).
export const selectionTransition = { type: 'spring', stiffness: 520, damping: 38 }

// ---------- Joueurs locaux ----------

// Entrée d'un joueur : apparition rapide, léger scale, déplacement vers le haut,
// petite impulsion quand il passe READY. Durée < PLAYER_ENTRY_DURATION_MS (config/players.js).
export const playerCardVariants = {
  hidden: { opacity: 0, scale: 0.7, y: 44 },
  entering: {
    opacity: 1,
    scale: [0.7, 1.07, 1],
    y: [44, -6, 0],
    transition: { duration: 0.46, ease: EASE_OUT, times: [0, 0.62, 1] },
  },
  ready: { opacity: 1, scale: [1, 1.05, 1], y: 0, transition: { duration: 0.26, ease: EASE_OUT } },
  exit: { opacity: 0, scale: 0.86, y: 18, transition: { duration: DURATION.fast, ease: EASE_OUT } },
}

// Flash de la couleur du joueur au moment où il rejoint.
export const playerFlashVariants = {
  hidden: { opacity: 0.9 },
  visible: { opacity: 0, transition: { duration: 0.5, ease: EASE_OUT } },
}

// Numéro P1...P8 : arrive grand puis se pose.
export const playerNumberVariants = {
  hidden: { opacity: 0, scale: 1.9 },
  visible: { opacity: 1, scale: 1, transition: { delay: 0.08, duration: 0.3, ease: EASE_OUT } },
}

// Badge READY / CONFIRMÉ : pop avec rebond.
export const statusPopVariants = {
  hidden: { opacity: 0, scale: 0.4 },
  visible: { opacity: 1, scale: [0.4, 1.18, 1], transition: { duration: 0.3, ease: EASE_OUT } },
  exit: { opacity: 0, scale: 0.6, transition: { duration: DURATION.fast } },
}

export const emptySlotVariants = {
  visible: { opacity: 1, scale: 1, transition: { duration: DURATION.fast } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: DURATION.fast } },
}

// Changement de personnage dans un panneau joueur (custom = sens du déplacement).
export const characterSwapVariants = {
  hidden: (direction = 1) => ({ opacity: 0, x: 20 * direction }),
  visible: { opacity: 1, x: 0, transition: { duration: DURATION.fast, ease: EASE_OUT } },
  exit: (direction = 1) => ({ opacity: 0, x: -20 * direction, transition: { duration: 0.12, ease: EASE_OUT } }),
}

// Panneau joueur : impulsion au moment de la confirmation.
export const selectPanelVariants = {
  open: { scale: 1, transition: { duration: DURATION.fast } },
  locked: { scale: [1, 1.04, 1], transition: { duration: 0.28, ease: EASE_OUT } },
}

// Curseurs P1...P8 qui glissent d'une carte à l'autre (layoutId).
export const cursorTransition = { type: 'spring', stiffness: 640, damping: 40 }
