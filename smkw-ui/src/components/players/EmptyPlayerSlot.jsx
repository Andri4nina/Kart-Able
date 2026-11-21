import { motion } from 'motion/react'
import { emptySlotVariants } from '../../animations/variants'
import { PLAYER_IDS } from '../../config/players'
import { INPUT_ACTIONS } from '../../input/actions'
import { emitPointerInput } from '../../input/inputManager'
import { useTranslation } from '../../i18n/useTranslation'

const BOX_CLASS =
  'absolute inset-0 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-white/25 bg-brand-ink/55 p-3 text-center'

// Emplacement vide : "PRESS START". Toucher / cliquer = START du périphérique tactile
// (un seul joueur possible par écran tactile), jamais un bouton "ajouter un joueur".
export function EmptyPlayerSlot({ index, pointerAvailable }) {
  const { t } = useTranslation()
  const content = (
    <>
      <span className="font-display text-3xl leading-none text-white/25">{PLAYER_IDS[index]}</span>
      <span className="font-display text-base uppercase leading-none text-white motion-ok:animate-pulse sm:text-lg">
        {t('local.pressStart')}
      </span>
      {pointerAvailable ? (
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/45">{t('local.tapToJoin')}</span>
      ) : null}
    </>
  )

  return (
    <motion.div variants={emptySlotVariants} initial="exit" animate="visible" exit="exit" className="absolute inset-0">
      {pointerAvailable ? (
        <button
          type="button"
          id={`slot-${PLAYER_IDS[index]}-start`}
          onClick={() => emitPointerInput(INPUT_ACTIONS.START)}
          className={
            `${BOX_CLASS} transition duration-150 ease-out hover:border-white/55 hover:bg-brand-ink/75 ` +
            'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-yellow'
          }
        >
          {content}
        </button>
      ) : (
        <div className={BOX_CLASS}>{content}</div>
      )}
    </motion.div>
  )
}
