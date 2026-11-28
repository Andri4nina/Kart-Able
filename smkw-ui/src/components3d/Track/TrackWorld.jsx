import { useFrame } from '@react-three/fiber'
import { Suspense, useEffect, useMemo } from 'react'
import { getTrackTheme } from '../../config/trackThemes'
import { getTrackGeometry } from '../../game/track/trackGeometry'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { TrackBarriers } from './TrackBarriers'
import { TrackDecor } from './TrackDecor'
import { TrackFeatures } from './TrackFeatures'
import { TrackGrass } from './TrackGrass'
import { TrackCrossings } from './TrackCrossings'
import { TrackGround } from './TrackGround'
import { TrackIslands } from './TrackIslands'
import { TrackRamps } from './TrackRamps'
import { TrackRockfalls } from './TrackRockfalls'
import { TrackVegetation } from './TrackVegetation'
import { trackTime } from './trackClock'
import { buildTrackField } from './trackField'

// Monde d'un circuit, entièrement généré depuis sa définition (config/tracks.js) : sol, eau,
// route, herbe, pads et rochers, éboulements, tremplins, terre-pleins des embranchements, murets et clôtures, arbres et décor. Remplace l'arène du menu pendant une course.
export function TrackWorld({ trackId }) {
  const geometry = getTrackGeometry(trackId)
  const theme = getTrackTheme(geometry?.track.theme)
  const field = useMemo(() => (geometry ? buildTrackField(geometry) : null), [geometry])

  useEffect(
    () => () => {
      field?.texture.dispose()
      field?.heightTexture.dispose()
    },
    [field],
  )

  // Seule animation continue du circuit : le temps des vagues et du vent dans l'herbe.
  const reducedMotion = useReducedMotion()
  useFrame(({ clock }) => {
    trackTime.value = reducedMotion ? 0 : clock.elapsedTime
  })

  if (!geometry || !field) return null
  const { track } = geometry

  return (
    <group name="track-world" userData={{ trackId }}>
      <TrackGround geometry={geometry} field={field} theme={theme} />
      <TrackGrass field={field} theme={theme} seed={track.seed} />
      <TrackFeatures geometry={geometry} theme={theme} />
      <TrackRamps geometry={geometry} />
      <TrackRockfalls geometry={geometry} theme={theme} />
      <TrackIslands geometry={geometry} theme={theme} />
      <TrackCrossings geometry={geometry} theme={theme} />
      <TrackBarriers geometry={geometry} />
      <Suspense fallback={null}>
        <TrackVegetation geometry={geometry} field={field} theme={theme} />
      </Suspense>
      <Suspense fallback={null}>
        <TrackDecor geometry={geometry} />
      </Suspense>
    </group>
  )
}
