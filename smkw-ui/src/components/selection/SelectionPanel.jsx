import { motion, useAnimate } from 'motion/react'
import { memo, useEffect } from 'react'
import { rejectShake } from '../../animations/selectionVariants'
import { selectPanelVariants } from '../../animations/variants'
import { getDisplayedId, getReservationOwner, SELECTION_STATUS } from '../../game/selection/selectionRules'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useTranslation } from '../../i18n/useTranslation'
import { DeviceBadge } from '../players/DeviceBadge'
import { getPlayerColors } from '../players/playerVisuals'
import { PanelControls } from './PanelControls'
import { SelectionStatus } from './SelectionStatus'

// Panneau latéral générique d'un joueur : identifiant, statut, périphérique, présélection
// (rendue par l'écran via `renderInfo(itemId, selection)`) et contrôles.
// Ne se re-rend que lorsque la sélection de CE joueur (ou la réservation qui le concerne) change.
export const SelectionPanel = memo(function SelectionPanel({ slot, useStore, unique, renderInfo }) {
  const { t } = useTranslation()
  const reducedMotion = useReducedMotion()
  const [scope, animate] = useAnimate()
  const selection = useStore((state) => state.selections[slot.id])
  const owner = useStore((state) => (unique ? getReservationOwner(state.selections, state.selections[slot.id]?.preselectedId) : null))
  const rejections = selection?.rejections ?? 0

  useEffect(() => {
    if (rejections > 0 && !reducedMotion && scope.current) animate(scope.current, rejectShake.keyframes, rejectShake.options)
  }, [rejections, reducedMotion, animate, scope])

  const itemId = getDisplayedId(selection)
  if (!selection || !itemId) return null

  const confirmed = selection.status === SELECTION_STATUS.CONFIRMED
  const reservedBy = !confirmed && owner && owner !== slot.id ? owner : null
  const colors = getPlayerColors(slot.index)

  return (
    <motion.section
      ref={scope}
      aria-label={t('selection.controlledBy', { player: t('players.player', { number: slot.number }) })}
      variants={selectPanelVariants}
      initial={false}
      animate={confirmed ? 'locked' : 'open'}
      className={
        'relative flex flex-col gap-1.5 overflow-hidden bg-brand-ink/95 py-2 pl-4 pr-3 text-white transition-shadow duration-200 ' +
        (confirmed ? `ring-2 ${colors.ring}` : 'ring-1 ring-white/10')
      }
    >
      <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1.5 ${colors.bg}`} />
      <header className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className={`font-display text-xl leading-none ${colors.text}`}>{slot.id}</span>
          <SelectionStatus confirmed={confirmed} reservedBy={reservedBy} colorIndex={slot.index} />
        </div>
        <DeviceBadge deviceId={slot.deviceId} className="min-w-0" />
      </header>

      {renderInfo(itemId, selection)}

      <PanelControls
        playerId={slot.id}
        deviceId={slot.deviceId}
        confirmed={confirmed}
        blocked={Boolean(reservedBy)}
        colorClass={colors.bg}
        useStore={useStore}
      />
    </motion.section>
  )
})
