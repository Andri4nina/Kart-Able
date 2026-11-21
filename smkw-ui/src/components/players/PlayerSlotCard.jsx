import { AnimatePresence } from 'motion/react'
import { memo } from 'react'
import { EmptyPlayerSlot } from './EmptyPlayerSlot'
import { JoinedPlayerSlot } from './JoinedPlayerSlot'

// Un emplacement de la grille P1...P8 : vide ("PRESS START") ou occupé (joueur entré).
// Les joueurs déjà présents à l'affichage de l'écran apparaissent sans rejouer leur entrée
// (AnimatePresence initial={false}).
export const PlayerSlotCard = memo(function PlayerSlotCard({ index, slot, pointerAvailable }) {
  return (
    <div className="relative h-52 sm:h-56 lg:h-[10.5rem]">
      <AnimatePresence initial={false}>
        {slot ? (
          <JoinedPlayerSlot key={`${slot.id}-${slot.joinToken}`} slot={slot} />
        ) : (
          <EmptyPlayerSlot key="empty" index={index} pointerAvailable={pointerAvailable} />
        )}
      </AnimatePresence>
    </div>
  )
})
