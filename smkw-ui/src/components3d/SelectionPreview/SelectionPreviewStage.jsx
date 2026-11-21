import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { getLineupLayout } from '../../config/characterPreview'
import { SCREENS } from '../../navigation/screens'
import { useCharacterSelectionStore } from '../../stores/characterSelectionStore'
import { useLocalPlayersStore } from '../../stores/localPlayersStore'
import { selectCurrentScreen, useNavigationStore } from '../../stores/navigationStore'
import { useVehicleSelectionStore } from '../../stores/vehicleSelectionStore'
import { getCharacterColor, getCharacterScale } from '../../config/characters'
import { getConfirmedId } from '../../game/selection/selectionRules'
import { CHARACTER_HEIGHTS } from '../Characters/characterAssets'
import { CharacterModel } from '../Characters/CharacterModel'
import { preloadVehicleModels } from '../Vehicles/vehicleAssets'
import { VehicleModel } from '../Vehicles/VehicleModel'
import { PreviewSlot } from './PreviewSlot'

// Couleur du personnage confirmé par le joueur : son véhicule en prend la peinture.
const getPlayerPaint = (playerId) =>
  getCharacterColor(getConfirmedId(useCharacterSelectionStore.getState().selections, playerId))

// Ce que montre la rangée de previews selon l'écran : personnage seul (à la hauteur de son
// gabarit : petit, moyen, grand), puis véhicule GLB aux couleurs du personnage.
const STAGES = {
  [SCREENS.CHARACTER_SELECT]: {
    useStore: useCharacterSelectionStore,
    renderModel: (id) => <CharacterModel characterId={id} height={CHARACTER_HEIGHTS.preview * getCharacterScale(id)} />,
    motion: { baseYaw: 0.2, idle: 'sway' },
  },
  [SCREENS.VEHICLE_SELECT]: {
    useStore: useVehicleSelectionStore,
    renderModel: (id, playerId) => <VehicleModel vehicleId={id} paint={getPlayerPaint(playerId)} />,
    motion: { baseYaw: 0.55, idle: 'turntable' },
  },
}

// Rangée de previews 3D des écrans de sélection, dans la scène existante (pas de second
// Canvas). Un emplacement par joueur, dans l'ordre P1...P8. Re-rendue uniquement au
// changement d'écran, de joueurs ou de taille de fenêtre.
export function SelectionPreviewStage() {
  const screen = useNavigationStore(selectCurrentScreen)
  const slots = useLocalPlayersStore((state) => state.slots)
  const aspect = useThree((state) => state.size.width / Math.max(1, state.size.height))
  const stage = STAGES[screen]

  // Les véhicules se téléchargent pendant le choix des personnages.
  useEffect(() => {
    if (screen === SCREENS.CHARACTER_SELECT) preloadVehicleModels()
  }, [screen])

  if (!stage || slots.length === 0) return null
  const { positions, scale } = getLineupLayout(slots.length, aspect)

  return (
    <group name="character-preview-stage">
      {slots.map((slot, order) => (
        <PreviewSlot
          key={`${screen}-${slot.id}`}
          playerId={slot.id}
          colorIndex={slot.index}
          x={positions[order]}
          scale={scale}
          useStore={stage.useStore}
          renderModel={stage.renderModel}
          motion={stage.motion}
        />
      ))}
    </group>
  )
}
