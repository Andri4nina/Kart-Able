import { DURATION, EASE_OUT } from './transitions'

// Animations propres à la sélection des personnages.

// Confirmation refusée (personnage déjà pris) : secousse horizontale courte.
export const rejectShake = {
  keyframes: { x: [0, -9, 9, -6, 6, -3, 0] },
  options: { duration: 0.36, ease: 'easeOut' },
}

// Statut d'un joueur (présélection / réservé / confirmé) : remplacement en fondu vertical.
export const statusSwapVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.fast, ease: EASE_OUT } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.12, ease: EASE_OUT } },
}

// Étiquette sous un preview 3D : apparition décalée selon l'ordre du joueur.
export const previewLabelVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (order = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_OUT, delay: 0.25 + order * 0.05 },
  }),
}
