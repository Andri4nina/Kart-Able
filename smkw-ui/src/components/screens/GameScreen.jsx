import { motion } from 'motion/react'
import { hudContainer, hudFrom } from '../../animations/variants'
import { useTranslation } from '../../i18n/useTranslation'
import { useSessionStore } from '../../stores/sessionStore'
import { DemoBadge } from '../ui/hud/DemoBadge'
import { PauseMenu } from './race/PauseMenu'
import { RaceFlowOverlay } from './race/RaceFlowOverlay'
import { StartCountdown } from './race/StartCountdown'
import { HudActions } from '../ui/hud/HudActions'
import { SplitScreenHud } from './split/SplitScreenHud'

const NO_PLAYERS = []

// Écran de jeu : uniquement le HUD. La scène 3D vit dans le Canvas, pas ici.
// Une case par joueur local (écran partagé), actions communes en haut à droite ; après la
// course, résultats et vote du circuit suivant (RaceFlowOverlay) ; menu pause (PauseMenu).
export function GameScreen() {
  const { t } = useTranslation()
  const players = useSessionStore((state) => state.match?.players ?? NO_PLAYERS)
  const hasTrack = useSessionStore((state) => Boolean(state.match?.trackId))

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
      {hasTrack ? <StartCountdown /> : null}
      {hasTrack ? <RaceFlowOverlay /> : null}
      {hasTrack ? <PauseMenu /> : null}
      <motion.div variants={hudFrom.right} className="absolute right-2.5 top-2.5 flex flex-col items-end gap-2 sm:right-4 sm:top-4">
        <HudActions />
        {/* Mention de démo seulement en solo et sans course (arène) : à plusieurs, elle couvrirait
            la case voisine ; sur circuit, le HUD affiche des valeurs réelles. */}
        {players.length <= 1 && !hasTrack ? (
          <div className="hidden lg:block">
            <DemoBadge />
          </div>
        ) : null}
      </motion.div>
    </motion.section>
  )
}
