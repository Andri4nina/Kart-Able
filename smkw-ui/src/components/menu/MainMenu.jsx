import { Play, Warehouse } from 'lucide-react'
import { motion } from 'motion/react'
import { fadeIn, screenVariants, slideInItem, staggerList, titleVariants } from '../../animations/variants'
import { BRAND } from '../../config/gameConfig'
import { useArrowNavigation } from '../../hooks/useArrowNavigation'
import { useTranslation } from '../../i18n/useTranslation'
import { SCREENS } from '../../navigation/screens'
import { useNavigationStore } from '../../stores/navigationStore'
import { KeyHint } from '../ui/KeyHint'
import { Logo } from '../ui/Logo'
import { LanguageSelector } from './LanguageSelector'
import { MenuButton } from './MenuButton'
import { SettingsButton } from './SettingsButton'

export function MainMenu() {
  const { t } = useTranslation()
  const navigate = useNavigationStore((state) => state.navigate)
  const onArrowKeys = useArrowNavigation()

  return (
    <motion.section
      aria-label={t('mainMenu.label')}
      className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 lg:p-14"
      variants={screenVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div variants={fadeIn} className="pointer-events-auto absolute right-4 top-4 z-10 sm:right-8 sm:top-8">
        <LanguageSelector variant="compact" />
      </motion.div>

      {/* pt-12 sur mobile : laisse la place au sélecteur de langue en haut à droite. */}
      <div className="flex w-full max-w-md flex-col gap-8 pt-12 sm:gap-10 sm:pt-[4vh]">
        <motion.div variants={titleVariants}>
          <Logo />
        </motion.div>

        <motion.nav
          aria-label={t('mainMenu.label')}
          variants={staggerList}
          onKeyDown={onArrowKeys}
          className="pointer-events-auto flex flex-col gap-4"
        >
          <motion.div variants={slideInItem}>
            <MenuButton
              variant="hero"
              id="start-btn"
              icon={Play}
              label={t('mainMenu.play')}
              description={t('mainMenu.playHint')}
              onClick={() => navigate(SCREENS.MODE_SELECT)}
              autoFocus
            />
          </motion.div>
          <motion.div variants={slideInItem}>
            <MenuButton
              id="garage-btn"
              icon={Warehouse}
              label={t('mainMenu.garage')}
              description={t('mainMenu.garageHint')}
              badge={t('common.soon')}
              disabled
            />
          </motion.div>
          <motion.div variants={slideInItem}>
            <SettingsButton />
          </motion.div>
        </motion.nav>
      </div>

      <motion.footer variants={fadeIn} className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <KeyHint keys={t('keys.enter')} label={t('hints.play')} />
          <KeyHint keys={t('keys.arrows')} label={t('hints.navigate')} />
          <KeyHint keys="F" label={t('hints.fullscreen')} />
        </div>
        <span className="bg-brand-ink/85 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/70">
          {BRAND.version}
        </span>
      </motion.footer>
    </motion.section>
  )
}
