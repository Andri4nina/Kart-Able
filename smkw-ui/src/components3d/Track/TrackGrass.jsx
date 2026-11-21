import { useEffect, useMemo } from 'react'
import { useSettingsStore } from '../../stores/settingsStore'
import { buildGrassGeometry, createGrassMaterial } from './grassField'

// Densité du champ d'herbe par réglage de qualité (le nombre de brins est le coût principal,
// multiplié par le nombre de cases en écran partagé). Qualité basse : pas de brins, le
// terrain reste vert.
const GRASS_TIERS = {
  low: null,
  medium: { count: 170, spacing: 0.22 },
  high: { count: 240, spacing: 0.18 },
}

export function TrackGrass({ field, theme, seed }) {
  const quality = useSettingsStore((state) => state.quality)
  const tier = GRASS_TIERS[quality] ?? GRASS_TIERS.medium
  if (!tier) return null
  return <GrassBlades field={field} theme={theme} seed={seed} tier={tier} />
}

function GrassBlades({ field, theme, seed, tier }) {
  const grass = useMemo(() => {
    const { geometry, patchSize } = buildGrassGeometry({ count: tier.count, spacing: tier.spacing, seed })
    return { geometry, material: createGrassMaterial(field, theme, patchSize) }
  }, [field, theme, seed, tier])

  useEffect(
    () => () => {
      grass.geometry.dispose()
      grass.material.dispose()
    },
    [grass],
  )

  // Le champ suit la caméra de la case en cours de rendu (une par joueur en écran partagé).
  const followCamera = (_renderer, _scene, camera) => {
    grass.material.uniforms.uCameraOffset.value.set(camera.position.x, camera.position.z)
  }

  return <mesh geometry={grass.geometry} material={grass.material} frustumCulled={false} onBeforeRender={followCamera} />
}
