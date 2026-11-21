import { VEHICLES } from '../config/vehicles'
import { createSelectionStore } from './createSelectionStore'

export const VEHICLE_IDS = Object.freeze(VEHICLES.map((vehicle) => vehicle.id))

// Sélection des véhicules : plusieurs joueurs peuvent prendre le même véhicule.
export const useVehicleSelectionStore = createSelectionStore({
  itemIds: VEHICLE_IDS,
  unique: false,
  defaultFor: (playerIndex) => VEHICLE_IDS[playerIndex % VEHICLE_IDS.length],
})
