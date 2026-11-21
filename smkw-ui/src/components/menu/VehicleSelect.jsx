import { continueFromVehicleSelect, handleVehicleInput } from '../../game/vehicleSelect'
import { useTranslation } from '../../i18n/useTranslation'
import { useLocalPlayersStore } from '../../stores/localPlayersStore'
import { useVehicleSelectionStore, VEHICLE_IDS } from '../../stores/vehicleSelectionStore'
import { VehicleCard } from '../players/VehicleCard'
import { VehiclePanelInfo } from '../players/VehiclePanelInfo'
import { SelectionRoster } from '../selection/SelectionRoster'
import { SelectionScreen } from '../selection/SelectionScreen'

// Fonctions stables (niveau module) : les panneaux mémoïsés ne se re-rendent pas pour rien.
const getVehicleNameKey = (vehicleId) => `vehicles.${vehicleId}.name`
const renderSoloInfo = (vehicleId, selection) => (
  <VehiclePanelInfo vehicleId={vehicleId} direction={selection.lastMove} showStats />
)
const renderMultiInfo = (vehicleId, selection) => (
  <VehiclePanelInfo vehicleId={vehicleId} direction={selection.lastMove} showStats={false} />
)
const renderVehicleCard = ({ itemId, cursors }) => <VehicleCard vehicleId={itemId} cursors={cursors} />

// Sélection des véhicules (après les personnages) : modèles GLB en 3D, plusieurs joueurs
// peuvent prendre le même véhicule. Statistiques affichées uniquement en solo.
// Ensuite : le choix du circuit (modes de course), puis le lobby.
export function VehicleSelect() {
  const { t } = useTranslation()
  const solo = useLocalPlayersStore((state) => state.slots.length === 1)

  return (
    <SelectionScreen
      step="vehicles"
      title={t('vehicleSelect.title')}
      subtitle={t('vehicleSelect.subtitle')}
      useStore={useVehicleSelectionStore}
      unique={false}
      onInput={handleVehicleInput}
      onContinue={continueFromVehicleSelect}
      continueId="vehicles-continue-btn"
      getNameKey={getVehicleNameKey}
      renderInfo={solo ? renderSoloInfo : renderMultiInfo}
      roster={(slots) => (
        <SelectionRoster
          itemIds={VEHICLE_IDS}
          slots={slots}
          useStore={useVehicleSelectionStore}
          unique={false}
          label={t('vehicleSelect.roster')}
          className="grid-cols-2 sm:grid-cols-4"
          renderCard={renderVehicleCard}
        />
      )}
    />
  )
}
