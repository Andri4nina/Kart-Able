import { useGLTF } from '@react-three/drei'
import { useEffect, useMemo } from 'react'
import { clone } from 'three/addons/utils/SkeletonUtils.js'
import { applyKartPaint } from './kartPaint'
import { getVehicleAsset, VEHICLE_LENGTH } from './vehicleAssets'
import { normalizeModel } from './normalizeModel'

const keepColors = () => {}

// Véhicule GLB. Le fichier est chargé une seule fois (cache useGLTF) ; chaque affichage en est
// un clone (géométries et textures partagées), si bien que deux joueurs peuvent montrer le
// même véhicule. `paint` : couleur du personnage qui le pilote (kartPaint.js), ou rien.
// Suspend pendant le chargement (Suspense chez l'appelant).
export function VehicleModel({ vehicleId, paint = null }) {
  const asset = getVehicleAsset(vehicleId)
  const { scene } = useGLTF(asset.url)
  const vehicle = useMemo(() => {
    const model = normalizeModel(clone(scene), { length: VEHICLE_LENGTH, yaw: asset.yaw, name: `vehicle-${vehicleId}` })
    return { model, release: paint ? applyKartPaint(model, paint) : keepColors }
  }, [scene, asset, vehicleId, paint])

  useEffect(() => vehicle.release, [vehicle])

  return <primitive object={vehicle.model} />
}
