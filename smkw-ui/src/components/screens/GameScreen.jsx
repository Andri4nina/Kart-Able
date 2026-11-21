import { motion } from 'motion/react'
import { hudContainer, hudFrom } from '../../animations/variants'
import { useTranslation } from '../../i18n/useTranslation'
import { useSessionStore } from '../../stores/sessionStore'
import { DemoBadge } from '../ui/hud/DemoBadge'
import { HudActions } from '../ui/hud/HudActions'
import { SplitScreenHud } from './split/SplitScreenHud'

const NO_PLAYERS = []

// Écran de jeu : uniquement le HUD. La scène 3D vit dans le Canvas, pas ici.
// Une case par joueur local (écran partagé), actions communes en haut à droite.
export function GameScreen() {
  const { t } = useTranslation()
  const players = useSessionStore((state) => state.match?.players ?? NO_PLAYERS)

  return (
    <motion.section
      aria-label={t('hud.label')}
      className="absolute inset-0"
      variants={hudContainer}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {players.length > 0 ? <SplitScreenHud players={players} /> : null}
      <motion.div variants={hudFrom.right} className="absolute right-2.5 top-2.5 flex flex-col items-end gap-2 sm:right-4 sm:top-4">
        <HudActions />
        {/* Mention de démo seulement en solo : à plusieurs, elle couvrirait la case voisine. */}
        {players.length <= 1 ? (
          <div className="hidden lg:block">
            <DemoBadge />
          </div>
        ) : null}
      </motion.div>
    </motion.section>
  )
}
