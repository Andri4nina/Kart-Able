import { motion } from 'motion/react'
import { pageItem, pageList } from '../../animations/variants'
import { GAME_MODES } from '../../config/gameModes'
import { useArrowNavigation } from '../../hooks/useArrowNavigation'
import { useTranslation } from '../../i18n/useTranslation'
import { SCREENS } from '../../navigation/screens'
import { useMatchSetupStore } from '../../stores/matchSetupStore'
import { useNavigationStore } from '../../stores/navigationStore'
import { Button } from '../ui/Button'
import { GameModeCard } from './GameModeCard'
import { MenuPage } from './MenuPage'

// Étape 1 : choix du mode. La grille est générée depuis GAME_MODES (aucun mode codé en dur).
export function GameModeMenu() {
  const { t } = useTranslation()
  const modeId = useMatchSetupStore((state) => state.modeId)
  const selectMode = useMatchSetupStore((state) => state.selectMode)
  const navigate = useNavigationStore((state) => state.navigate)
  const onArrowKeys = useArrowNavigation()

  const confirm = () => navigate(SCREENS.PLAY_TYPE)

  return (
    <MenuPage
      step="mode"
      title={t('modeSelect.title')}
      subtitle={t('modeSelect.subtitle')}
      footer={
        <Button id="mode-continue-btn" showArrow onClick={confirm}>
          {t('common.continue')}
        </Button>
      }
    >
      <motion.div variants={pageList} onKeyDown={onArrowKeys} className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {GAME_MODES.map((mode) => (
          <motion.div key={mode.id} variants={pageItem}>
            <GameModeCard
              mode={mode}
              selected={mode.id === modeId}
              autoFocus={mode.id === modeId}
              onSelect={() => selectMode(mode.id)}
              onConfirm={confirm}
            />
          </motion.div>
        ))}
      </motion.div>
    </MenuPage>
  )
}
