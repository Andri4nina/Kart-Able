import { useEffect, useMemo } from 'react'
import { PlaneGeometry } from 'three'
import { buildMarkingsGeometry } from './markingsGeometry'
import { buildRoadGeometry } from './roadGeometry'
import { createMarkingsMaterial, createRoadMaterial, createTerrainMaterial } from './surfaceMaterials'
import { createWaterMaterial } from './waterMaterial'

const TERRAIN_SEGMENTS = 192
const WATER_LEVEL = -0.25

// Sol du circuit : terrain (lits des lacs creusés), eau animée, route et marquages.
// Tout est généré depuis le chemin et la texture de données ; rien n'est chargé.
export function TrackGround({ path, field, theme }) {
  const surfaces = useMemo(() => {
    const plane = new PlaneGeometry(field.size, field.size, TERRAIN_SEGMENTS, TERRAIN_SEGMENTS)
    plane.rotateX(-Math.PI / 2)
    plane.translate(field.origin[0] + field.size / 2, 0, field.origin[1] + field.size / 2)
    const waterPlane = new PlaneGeometry(field.size, field.size, 1, 1)
    waterPlane.rotateX(-Math.PI / 2)
    waterPlane.translate(field.origin[0] + field.size / 2, WATER_LEVEL, field.origin[1] + field.size / 2)
    return {
      terrain: { geometry: plane, material: createTerrainMaterial(field, theme) },
      water: { geometry: waterPlane, material: createWaterMaterial(field, theme) },
      road: { geometry: buildRoadGeometry(path), material: createRoadMaterial() },
      markings: { geometry: buildMarkingsGeometry(path), material: createMarkingsMaterial() },
    }
  }, [path, field, theme])

  useEffect(
    () => () => {
      for (const surface of Object.values(surfaces)) {
        surface.geometry.dispose()
        surface.material.dispose()
      }
    },
    [surfaces],
  )

  return (
    <group name="track-ground">
      <mesh geometry={surfaces.terrain.geometry} material={surfaces.terrain.material} />
      <mesh geometry={surfaces.water.geometry} material={surfaces.water.material} renderOrder={1} />
      <mesh name="track-road" geometry={surfaces.road.geometry} material={surfaces.road.material} />
      <mesh geometry={surfaces.markings.geometry} material={surfaces.markings.material} />
    </group>
  )
}
