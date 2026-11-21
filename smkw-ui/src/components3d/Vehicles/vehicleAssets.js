import { useGLTF } from '@react-three/drei'
import buggyUrl from '../../assets/models/boom_karts_dune_buggy.glb'
import hotRodUrl from '../../assets/models/boom_karts_hot_rod.glb'
import classicUrl from '../../assets/models/boom_karts_kart.glb'
import sprintUrl from '../../assets/models/go_kart.glb'
import cometUrl from '../../assets/models/jon_arbuckles_kart_speed.glb'
import rookieUrl from '../../assets/models/practice_kart.glb'
import flamingoUrl from '../../assets/models/race_kart_pink_style.glb'

// Modèles GLB des véhicules (exports Sketchfab, sans Draco ni Meshopt : aucun décodeur requis).
// Chaque modèle est normalisé au chargement (longueur, centrage, sol) ; `yaw` corrige son
// orientation pour que l'avant regarde +Z. `seat` : place des pieds du pilote (hauteur, recul),
// réglée à l'œil pour chaque modèle. Vérifier la licence de chaque modèle avant publication.
const DEFAULT_SEAT = Object.freeze({ y: 0.15, z: -0.15 })

const VEHICLE_ASSETS = {
  classic: { url: classicUrl, yaw: 0, seat: DEFAULT_SEAT },
  sprint: { url: sprintUrl, yaw: 0, seat: DEFAULT_SEAT },
  hotrod: { url: hotRodUrl, yaw: 0, seat: { ...DEFAULT_SEAT, y: 0.27, z: -0.25 } },
  buggy: { url: buggyUrl, yaw: 0, seat: { ...DEFAULT_SEAT, y: 0.3 } },
  comet: { url: cometUrl, yaw: 0, seat: { ...DEFAULT_SEAT, y: 0.3 } },
  rookie: { url: rookieUrl, yaw: 0, seat: DEFAULT_SEAT },
  // Modèle exporté dans la longueur en X : un quart de tour pour regarder +Z.
  flamingo: { url: flamingoUrl, yaw: Math.PI / 2, seat: { ...DEFAULT_SEAT, y: 0.08 } },
}

// Longueur d'un véhicule normalisé (unités de la scène).
export const VEHICLE_LENGTH = 2

export function getVehicleAsset(vehicleId) {
  return VEHICLE_ASSETS[vehicleId] ?? null
}

export function getVehicleSeat(vehicleId) {
  return VEHICLE_ASSETS[vehicleId]?.seat ?? DEFAULT_SEAT
}

// Lance le téléchargement de tous les modèles (cache partagé avec useGLTF).
export function preloadVehicleModels() {
  for (const { url } of Object.values(VEHICLE_ASSETS)) useGLTF.preload(url)
}
