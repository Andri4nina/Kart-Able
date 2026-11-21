import { motion } from 'motion/react'
import { pageItem, pageList } from '../../animations/variants'
import { getDisplayedId, getReservationOwner, SELECTION_STATUS } from '../../game/selection/selectionRules'

// Roster central générique : pour chaque élément, les curseurs des joueurs qui le
// présélectionnent et (si `unique`) le joueur qui l'a réservé. Le rendu de la carte est
// fourni par l'écran (visage d'un personnage, nom d'un véhicule...).
export function SelectionRoster({ itemIds, slots, useStore, unique, label, className = '', renderCard }) {
  const selections = useStore((state) => state.selections)
  const slotById = new Map(slots.map((slot) => [slot.id, slot]))

  return (
    <motion.ul variants={pageList} aria-label={label} className={`grid gap-2.5 lg:gap-3 ${className}`}>
      {itemIds.map((itemId) => {
        const ownerId = unique ? getReservationOwner(selections, itemId) : null
        const cursors = slots
          .filter((slot) => getDisplayedId(selections[slot.id]) === itemId)
          .map((slot) => ({
            id: slot.id,
            index: slot.index,
            confirmed: selections[slot.id]?.status === SELECTION_STATUS.CONFIRMED,
          }))
        return (
          <motion.li key={itemId} variants={pageItem}>
            {renderCard({ itemId, cursors, owner: ownerId ? slotById.get(ownerId) ?? null : null })}
          </motion.li>
        )
      })}
    </motion.ul>
  )
}
