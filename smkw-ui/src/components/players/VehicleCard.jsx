import { CarFront } from 'lucide-react'
import { memo } from 'react'
import { useTranslation } from '../../i18n/useTranslation'
import { RosterCursors } from '../selection/RosterCursors'

// Carte du roster des véhicules : icône et nom (le modèle GLB s'affiche dans le preview 3D).
// En haut : les curseurs des joueurs qui le présélectionnent (véhicule partageable).
export const VehicleCard = memo(function VehicleCard({ vehicleId, cursors }) {
  const { t } = useTranslation()
  const highlighted = cursors.length > 0

  return (
    <div
      id={`roster-${vehicleId}`}
      className={
        'relative flex h-full flex-col items-center gap-1.5 bg-brand-ink/90 px-2 pb-2.5 pt-8 text-center text-white transition duration-200 ease-out ' +
        (highlighted ? 'shadow-[5px_5px_0_0_var(--color-brand-yellow)]' : 'shadow-[5px_5px_0_0_rgb(0_0_0/0.35)]')
      }
    >
      <RosterCursors cursors={cursors} />
      <span className="flex size-12 -skew-x-6 items-center justify-center bg-white/10 text-brand-yellow">
        <CarFront aria-hidden="true" className="size-7 skew-x-6" strokeWidth={2.25} />
      </span>
      <span className="max-w-full truncate font-display text-sm uppercase leading-none sm:text-base">
        {t(`vehicles.${vehicleId}.name`)}
      </span>
    </div>
  )
})
