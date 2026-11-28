import { motion } from 'motion/react'
import { pageItem, pageVariants } from '../../animations/variants'
import { useTranslation } from '../../i18n/useTranslation'
import { modeUsesTracks } from '../../game/matchRules'
import { getMenuFlow } from '../../navigation/screens'
import { useMatchSetupStore } from '../../stores/matchSetupStore'
import { useNavigationStore } from '../../stores/navigationStore'
import { BackButton } from './BackButton'
import { MenuStepper } from './MenuStepper'
import { FitToScreen } from '../ui/FitToScreen'
import { SettingsButton } from './SettingsButton'

// Gabarit commun des écrans du parcours : retour, numéro d'étape, titre, stepper,
// contenu ajusté à l'écran sans défilement (FitToScreen), actions en bas. Écrans très bas
// (téléphone en paysage) : le contenu garde sa taille et toute la page défile.
// Le glissement suit le sens de navigation (avant / retour).
// `backdrop` : calque optionnel positionné sur tout l'écran (ex. étiquettes alignées sur la 3D).
// `compactHeader` : masque le sous-titre sur les écrans bas (la 3D occupe le haut de l'écran).
export function MenuPage({ step, title, subtitle, footer, backdrop = null, compactHeader = false, children }) {
  const { t } = useTranslation()
  const direction = useNavigationStore((state) => state.direction)
  const playType = useMatchSetupStore((state) => state.playType)
  const usesTracks = useMatchSetupStore((state) => modeUsesTracks(state.modeId))
  const stepNumber = getMenuFlow(playType, usesTracks).indexOf(step) + 1

  return (
    <motion.section
      aria-label={title}
      custom={direction}
      variants={pageVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="scrollbar-game absolute inset-0 flex flex-col bg-brand-ink/35 p-4 sm:p-8 lg:px-12 lg:py-8 [@media(max-height:30rem)]:overflow-y-auto"
    >
      {backdrop}
      <motion.header variants={pageItem} className="pointer-events-auto flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <BackButton />
          <div className="flex min-w-0 flex-col gap-1">
            {stepNumber > 0 ? (
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand-yellow">
                {t('nav.stepNumber', { number: stepNumber })}
              </span>
            ) : null}
            <h2 className="font-display text-3xl uppercase leading-none text-white [text-shadow:0.06em_0.06em_0_var(--color-brand-ink)] sm:text-5xl">
              {title}
            </h2>
            {subtitle ? (
              <p className={`mt-1 text-sm font-semibold text-white/90 sm:text-base ${compactHeader ? '[@media(max-height:44rem)]:hidden' : ''}`}>
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <MenuStepper step={step} />
          <SettingsButton variant="icon" />
        </div>
      </motion.header>

      <motion.div variants={pageItem} className="pointer-events-auto mt-5 flex min-h-0 flex-1 flex-col sm:mt-6 [@media(max-height:30rem)]:flex-none">
        <FitToScreen className="flex-1 [@media(max-height:30rem)]:flex-none [@media(max-height:30rem)]:overflow-visible">
          <div className="p-2">{children}</div>
        </FitToScreen>
      </motion.div>

      {footer ? (
        <motion.footer variants={pageItem} className="pointer-events-auto mt-4 flex flex-wrap items-center justify-end gap-x-6 gap-y-3">
          {footer}
        </motion.footer>
      ) : null}
    </motion.section>
  )
}
