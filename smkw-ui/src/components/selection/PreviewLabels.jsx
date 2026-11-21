import { Lock } from 'lucide-react'
import { motion } from 'motion/react'
import { previewLabelVariants } from '../../animations/selectionVariants'
import { getPedestalFrontTop, PREVIEW_STAGE } from '../../config/characterPreview'
import { getDisplayedId, SELECTION_STATUS } from '../../game/selection/selectionRules'
import { useTranslation } from '../../i18n/useTranslation'
import { getPlayerColors } from '../players/playerVisuals'

const GRID_COLUMNS = ['grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-4', 'grid-cols-5', 'grid-cols-6', 'grid-cols-7', 'grid-cols-8']

// Styles inline justifiés : position et largeur calculées pour tomber exactement sous
// les modèles 3D (même géométrie que la scène, config/characterPreview.js).
const ROW_STYLE = {
  top: `calc(${getPedestalFrontTop().toFixed(2)}% + 0.25rem)`,
  width: `${PREVIEW_STAGE.widthFraction * 100}%`,
}

function PreviewLabel({ slot, order, useStore, getNameKey }) {
  const { t } = useTranslation()
  const selection = useStore((state) => state.selections[slot.id])
  const itemId = getDisplayedId(selection)
  const confirmed = selection?.status === SELECTION_STATUS.CONFIRMED

  return (
    <motion.div custom={order} variants={previewLabelVariants} initial="hidden" animate="visible" className="flex min-w-0 flex-col items-center gap-1">
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 font-display text-xs leading-none text-brand-ink ${getPlayerColors(slot.index).bg}`}>
        {confirmed ? <Lock aria-hidden="true" className="size-3" strokeWidth={3} /> : null}
        {slot.id}
      </span>
      {itemId ? (
        <span className="max-w-full truncate bg-brand-ink/80 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
          {t(getNameKey(itemId))}
        </span>
      ) : null}
    </motion.div>
  )
}

// Étiquettes P1...P8 sous la rangée de previews 3D : identifiant du joueur et nom de
// l'élément présélectionné (le modèle lui-même est rendu par la scène).
export function PreviewLabels({ slots, useStore, getNameKey }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 flex justify-center" style={{ top: ROW_STYLE.top }}>
      <div className={`grid ${GRID_COLUMNS[Math.max(0, slots.length - 1)]}`} style={{ width: ROW_STYLE.width }}>
        {slots.map((slot, order) => (
          <PreviewLabel key={slot.id} slot={slot} order={order} useStore={useStore} getNameKey={getNameKey} />
        ))}
      </div>
    </div>
  )
}
