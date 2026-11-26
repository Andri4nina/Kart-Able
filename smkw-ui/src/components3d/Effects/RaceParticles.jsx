import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { Color } from 'three'
import { MAX_FRAME_DELTA } from '../../config/gameConfig'
import { getTrackTheme } from '../../config/trackThemes'
import { getTrack } from '../../config/tracks'
import { getRace } from '../../game/race/raceSession'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { emitBoxBursts } from './boxEmitters'
import { createParticleLayers, createTrailLayers, disposeParticleLayers } from './effectResources'
import { emitKartParticles } from './kartEmitters'
import { clearParticlePool, updateParticlePool } from './particlePool'
import { clearTrailPool, updateTrailPool, writeTrails } from './trailPool'
import { writeParticles } from './writeParticles'

// Particules de toute la course (drift, turbo, échappement, hors-piste, eau, chocs, cases à
// objets) et traînées au sol (marques de pneus, traînées du drift) : cinq InstancedMesh partagés
// par tous les karts (cinq appels de rendu), lus dans le monde de course. Purement visuel : rien
// ici ne modifie la course. Mouvement réduit : moins dense.
export function RaceParticles({ trackId }) {
  const layers = useMemo(() => createParticleLayers(), [])
  const trails = useMemo(() => createTrailLayers(), [])
  const reducedMotion = useReducedMotion()
  const memoryRef = useRef(null)
  const dirt = useMemo(() => {
    const theme = getTrackTheme(getTrack(trackId)?.theme)
    return [new Color(theme.grass.base), new Color(theme.grass.tip), new Color(theme.shoulder)]
  }, [trackId])

  useEffect(() => () => disposeParticleLayers(layers), [layers])
  useEffect(() => () => disposeParticleLayers(trails), [trails])

  useFrame((_, frameDelta) => {
    const world = getRace()
    memoryRef.current ??= { race: null, karts: new Map(), boxes: [] }
    const memory = memoryRef.current
    const dt = Math.min(frameDelta, MAX_FRAME_DELTA)
    if (world && world !== memory.race) {
      memory.race = world
      memory.karts.clear()
      memory.boxes.length = 0
      for (const layer of Object.values(layers)) clearParticlePool(layer.pool)
      for (const layer of Object.values(trails)) clearTrailPool(layer.pool)
    }
    const pools = { glow: layers.glow.pool, puff: layers.puff.pool, chunk: layers.chunk.pool }
    const trailPools = { skid: trails.skid.pool, streak: trails.streak.pool, boost: trails.boost.pool }
    if (world) {
      const rate = reducedMotion ? 0.4 : 1
      emitKartParticles(world, pools, trailPools, dt, rate, dirt, memory.karts)
      emitBoxBursts(world, pools, rate, memory.boxes)
    }
    for (const layer of Object.values(layers)) {
      updateParticlePool(layer.pool, dt)
      writeParticles(layer.mesh, layer.pool, layer.mode, layer.stretch)
    }
    for (const layer of Object.values(trails)) {
      updateTrailPool(layer.pool, dt)
      writeTrails(layer.mesh, layer.pool, layer.mode)
    }
  })

  return (
    <group name="race-particles">
      {[...Object.values(layers), ...Object.values(trails)].map((layer) => (
        <primitive key={layer.mesh.name} object={layer.mesh} />
      ))}
    </group>
  )
}
