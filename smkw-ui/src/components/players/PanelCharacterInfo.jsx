import { AnimatePresence, motion } from 'motion/react'
import { characterSwapVariants } from '../../animations/variants'
import { useTranslation } from '../../i18n/useTranslation'
import { CharacterAvatar } from './CharacterAvatar'
import { getClassVisual } from './playerVisuals'

// Personnage présélectionné (ou confirmé) d'un joueur : avatar, nom, archétype et gabarit.
// Le changement glisse dans le sens du déplacement du curseur.
export function PanelCharacterInfo({ character, direction, compact = false }) {
  const { t } = useTranslation()
  const { icon: ClassIcon, text: classText } = getClassVisual(character.classId)

  return (
    <div className={`relative min-w-0 flex-1 overflow-hidden ${compact ? 'h-11' : 'h-14'}`}>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={character.id}
          custom={direction}
          variants={characterSwapVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute inset-0 flex items-center gap-3"
        >
          <CharacterAvatar characterId={character.id} size={compact ? 'sm' : 'md'} />
          <div className="min-w-0">
            <p className={`truncate font-display uppercase leading-none ${compact ? 'text-base' : 'text-lg sm:text-xl'}`}>
              {t(`characters.${character.id}.name`)}
            </p>
            <p className={`mt-1 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest ${classText}`}>
              <ClassIcon aria-hidden="true" className="size-3" strokeWidth={2.75} />
              {t(`classes.${character.classId}.name`)}
              <span className="text-white/55">· {t(`sizes.${character.size}.name`)}</span>
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
