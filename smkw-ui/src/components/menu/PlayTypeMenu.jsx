import { Gamepad2, Globe } from 'lucide-react'
import { motion } from 'motion/react'
import { pageItem, pageList } from '../../animations/variants'
import { PLAY_TYPES } from '../../config/gameModes'
import { getGameMode, getPlayerLimit } from '../../game/matchRules'
import { useArrowNavigation } from '../../hooks/useArrowNavigation'
import { useTranslation } from '../../i18n/useTranslation'
import { SCREENS } from '../../navigation/screens'
import { useMatchSetupStore } from '../../stores/matchSetupStore'
import { useNavigationStore } from '../../stores/navigationStore'
import { getModeVisual } from './modeVisuals'
import { MenuPage } from './MenuPage'
import { PlayTypeCard } from './PlayTypeCard'

const OPTIONS = [
  { type: PLAY_TYPES.LOCAL, icon: Gamepad2, screen: SCREENS.LOCAL_SETUP },
  { type: PLAY_TYPES.ONLINE, icon: Globe, screen: SCREENS.ONLINE_SETUP },
]

// Étape 2 : Local (jusqu'à 8) ou En réseau (jusqu'à 32), limites lues depuis le mode choisi.
export function PlayTypeMenu() {
  const { t } = useTranslation()
  const modeId = useMatchSetupStore((state) => state.modeId)
  const selectPlayType = useMatchSetupStore((state) => state.selectPlayType)
  const navigate = useNavigationStore((state) => state.navigate)
  const onArrowKeys = useArrowNavigation()
  const mode = getGameMode(modeId)
  const { icon: ModeIcon } = getModeVisual(modeId)
  const firstAvailable = OPTIONS.find(({ type }) => getPlayerLimit(mode, type) > 0)?.type

  return (
    <MenuPage
      step="type"
      title={t('playType.title')}
      subtitle={t('playType.subtitle')}
    >
      <motion.div variants={pageItem} className="mb-5 inline-flex -skew-x-12 items-center bg-brand-ink/85 px-4 py-2">
        <span className="inline-flex skew-x-12 items-center gap-2 text-sm font-bold uppercase tracking-widest text-white">
          <ModeIcon aria-hidden="true" className="size-4 text-brand-yellow" strokeWidth={2.75} />
          {t(`modes.${modeId}.name`)}
        </span>
      </motion.div>

      <motion.div variants={pageList} onKeyDown={onArrowKeys} className="grid max-w-5xl gap-6 md:grid-cols-2">
        {OPTIONS.map(({ type, icon, screen }) => {
          const maxPlayers = getPlayerLimit(mode, type)
          return (
            <motion.div key={type} variants={pageItem}>
              <PlayTypeCard
                id={`playtype-${type}-btn`}
                icon={icon}
                name={t(`playType.${type}.name`)}
                description={t(`playType.${type}.description`)}
                maxPlayers={maxPlayers}
                playersLabel={maxPlayers === 1 ? t('players.solo') : t('players.upTo', { count: maxPlayers })}
                disabled={maxPlayers === 0}
                disabledReason={t('playType.notAvailable')}
                autoFocus={type === firstAvailable}
                onChoose={() => {
                  selectPlayType(type)
                  navigate(screen)
                }}
              />
            </motion.div>
          )
        })}
      </motion.div>
    </MenuPage>
  )
}
