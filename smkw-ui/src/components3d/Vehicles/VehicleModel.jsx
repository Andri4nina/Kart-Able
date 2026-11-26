import { useGLTF } from '@react-three/drei'
import { useEffect, useMemo } from 'react'
import { clone } from 'three/addons/utils/SkeletonUtils.js'
import { applyKartPaint } from './kartPaint'
import { getVehicleAsset, VEHICLE_LENGTH } from './vehicleAssets'
import { normalizeModel } from './normalizeModel'
import { buildWheelRig } from './wheelRig'

const keepColors = () => {}

// Véhicule GLB. Le fichier est chargé une seule fois (cache useGLTF) ; chaque affichage en est
// un clone (géométries et textures partagées), si bien que deux joueurs peuvent montrer le
// même véhicule. `paint` : couleur du personnage qui le pilote (kartPaint.js), ou rien.
// Suspend pendant le chargement (Suspense chez l'appelant). `onWheels` (facultatif) reçoit les
// roues animables du clone (wheelRig.js), pour un kart en course, puis null au démontage.
export function VehicleModel({ vehicleId, paint = null, onWheels = null }) {
  const asset = getVehicleAsset(vehicleId)
  const { scene } = useGLTF(asset.url)
  const vehicle = useMemo(() => {
    const model = normalizeModel(clone(scene), { length: VEHICLE_LENGTH, yaw: asset.yaw, name: `vehicle-${vehicleId}` })
    const wheels = onWheels ? buildWheelRig(model) : null
    return { model, wheels, release: paint ? applyKartPaint(model, paint) : keepColors }
  }, [scene, asset, vehicleId, paint, onWheels])

  useEffect(() => {
    if (!onWheels) return vehicle.release
    onWheels(vehicle.wheels)
    return () => {
      onWheels(null)
      vehicle.release()
    }
  }, [vehicle, onWheels])

  return <primitive object={vehicle.model} />
}
