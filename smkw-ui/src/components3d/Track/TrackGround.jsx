import { useEffect, useMemo } from 'react'
import { PlaneGeometry } from 'three'
import { getGroundHeight } from '../../game/track/trackHeight'
import { sampleTrackField } from './trackField'
import { buildMarkingsGeometry } from './markingsGeometry'
import { buildRoadGeometry } from './roadGeometry'
import { createMarkingsMaterial, createRoadMaterial, createTerrainMaterial } from './surfaceMaterials'
import { createWaterMaterial } from './waterMaterial'

const TERRAIN_SEGMENTS = 192
const WATER_LEVEL = -0.25
// Sous la route, le terrain est un peu plus bas : il ne perce jamais l'asphalte dans les pentes.
const ROAD_DIP = 0.25

// Relief : chaque sommet du terrain prend la hauteur du sol (game/track/trackHeight.js).
function applyRelief(plane, geometry, field) {
  if (!geometry.relief) return
  const position = plane.attributes.position
  for (let i = 0; i < position.count; i += 1) {
    const x = position.getX(i)
    const z = position.getZ(i)
    const road = sampleTrackField(field, x, z)?.road ?? 0
    position.setY(i, getGroundHeight(geometry, x, z) - ROAD_DIP * road)
  }
  position.needsUpdate = true
  plane.computeVertexNormals()
}

// Sol du circuit : terrain (relief, lits des lacs creusés), eau animée, route et marquages.
// Tout est généré depuis le chemin et la texture de données ; rien n'est chargé.
export function TrackGround({ geometry, field, theme }) {
  const { path } = geometry
  const surfaces = useMemo(() => {
    const plane = new PlaneGeometry(field.size, field.size, TERRAIN_SEGMENTS, TERRAIN_SEGMENTS)
    plane.rotateX(-Math.PI / 2)
    plane.translate(field.origin[0] + field.size / 2, 0, field.origin[1] + field.size / 2)
    applyRelief(plane, geometry, field)
    const waterPlane = new PlaneGeometry(field.size, field.size, 1, 1)
    waterPlane.rotateX(-Math.PI / 2)
    waterPlane.translate(field.origin[0] + field.size / 2, WATER_LEVEL, field.origin[1] + field.size / 2)
    return {
      terrain: { geometry: plane, material: createTerrainMaterial(field, theme) },
      water: { geometry: waterPlane, material: createWaterMaterial(field, theme) },
      road: { geometry: buildRoadGeometry(path, geometry.hidden), material: createRoadMaterial(theme) },
      markings: { geometry: buildMarkingsGeometry(path, geometry.hidden), material: createMarkingsMaterial() },
    }
  }, [geometry, path, field, theme])

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
