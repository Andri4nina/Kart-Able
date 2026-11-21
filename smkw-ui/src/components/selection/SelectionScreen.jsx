import { motion } from 'motion/react'
import { pageItem } from '../../animations/variants'
import { areAllConfirmed, SELECTION_STATUS } from '../../game/selection/selectionRules'
import { usePlayerInput } from '../../input/usePlayerInput'
import { useTranslation } from '../../i18n/useTranslation'
import { useLocalPlayersStore } from '../../stores/localPlayersStore'
import { MenuPage } from '../menu/MenuPage'
import { Button } from '../ui/Button'
import { PreviewLabels } from './PreviewLabels'
import { SelectionPanel } from './SelectionPanel'

// Ordre mobile (une colonne) : P1, P2, P3... ; sur grand écran, chaque panneau reprend
// sa place dans sa colonne (impairs à gauche, pairs à droite).
const ORDER_CLASSES = ['order-1', 'order-2', 'order-3', 'order-4', 'order-5', 'order-6', 'order-7', 'order-8']

function PanelColumn({ slots, useStore, unique, renderInfo }) {
  return (
    <div className="contents lg:flex lg:flex-col lg:gap-2.5">
      {slots.map((slot) => (
        <motion.div key={slot.id} variants={pageItem} className={`${ORDER_CLASSES[slot.index]} lg:order-none`}>
          <SelectionPanel slot={slot} useStore={useStore} unique={unique} renderInfo={renderInfo} />
        </motion.div>
      ))}
    </div>
  )
}

// Gabarit commun des écrans de sélection (personnages, véhicules) : previews 3D en haut
// (rendues par la scène), roster au centre, un panneau par joueur sur les côtés,
// Continuer quand tout le monde a confirmé.
export function SelectionScreen({ step, title, subtitle, useStore, unique, onInput, onContinue, continueId, getNameKey, roster, renderInfo }) {
  const { t } = useTranslation()
  const slots = useLocalPlayersStore((state) => state.slots)
  const selections = useStore((state) => state.selections)
  usePlayerInput(onInput)

  const playerIds = slots.map((slot) => slot.id)
  const allConfirmed = areAllConfirmed(playerIds, selections)
  const pending = playerIds.filter((id) => selections[id]?.status !== SELECTION_STATUS.CONFIRMED).length

  return (
    <MenuPage
      step={step}
      title={title}
      subtitle={subtitle}
      backdrop={<PreviewLabels slots={slots} useStore={useStore} getNameKey={getNameKey} />}
      compactHeader
      footer={
        <>
          <p className="bg-brand-ink/85 px-3 py-2 text-sm font-semibold text-white/85">
            {allConfirmed ? t('selection.allConfirmed') : t('selection.pending', { count: pending })}
          </p>
          <Button id={continueId} showArrow disabled={!allConfirmed} onClick={onContinue}>
            {t('common.continue')}
          </Button>
        </>
      }
    >
      {/* Zone transparente : la rangée de previews 3D se voit au travers. Hauteur par palier :
          le contenu commence plus haut sur mobile (en-tête plus compact). */}
      <div aria-hidden="true" className="h-[31vh] min-h-24 sm:h-[27vh] lg:h-[24vh]" />

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_minmax(0,15rem)] lg:items-start lg:gap-4">
        <PanelColumn slots={slots.filter((_, order) => order % 2 === 0)} useStore={useStore} unique={unique} renderInfo={renderInfo} />
        <motion.div variants={pageItem} className="order-first col-span-full lg:order-none lg:col-span-1">
          {roster(slots)}
        </motion.div>
        <PanelColumn slots={slots.filter((_, order) => order % 2 === 1)} useStore={useStore} unique={unique} renderInfo={renderInfo} />
      </div>
    </MenuPage>
  )
}
