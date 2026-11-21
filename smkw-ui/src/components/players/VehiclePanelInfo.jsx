import { CarFront } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { characterSwapVariants } from '../../animations/variants'
import { getVehicle } from '../../config/vehicles'
import { useTranslation } from '../../i18n/useTranslation'
import { StatBars } from './StatBars'

// Véhicule présélectionné (ou confirmé) d'un joueur : nom, et statistiques uniquement en solo
// (jamais en multijoueur).
export function VehiclePanelInfo({ vehicleId, direction, showStats }) {
  const { t } = useTranslation()
  const vehicle = getVehicle(vehicleId)
  if (!vehicle) return null

  return (
    <>
      <div className="relative h-10 min-w-0 overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={vehicleId}
            custom={direction}
            variants={characterSwapVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 flex items-center gap-3"
          >
            <span className="flex size-10 shrink-0 -skew-x-6 items-center justify-center bg-white/10 text-brand-yellow">
              <CarFront aria-hidden="true" className="size-5 skew-x-6" strokeWidth={2.5} />
            </span>
            <p className="truncate font-display text-lg uppercase leading-none">{t(`vehicles.${vehicleId}.name`)}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      {showStats ? <StatBars stats={vehicle.stats} fillClass="bg-brand-yellow" compact /> : null}
    </>
  )
}
