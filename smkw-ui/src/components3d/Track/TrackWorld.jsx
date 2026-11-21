import { useFrame } from '@react-three/fiber'
import { Suspense, useEffect, useMemo } from 'react'
import { getTrackTheme } from '../../config/trackThemes'
import { getTrackGeometry } from '../../game/track/trackGeometry'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { TrackDecor } from './TrackDecor'
import { TrackGrass } from './TrackGrass'
import { TrackGround } from './TrackGround'
import { TrackVegetation } from './TrackVegetation'
import { trackTime } from './trackClock'
import { buildTrackField } from './trackField'

// Monde d'un circuit, entièrement généré depuis sa définition (config/tracks.js) : sol, eau,
// route, herbe, arbres et décor. Remplace l'arène du menu pendant une course.
export function TrackWorld({ trackId }) {
  const geometry = getTrackGeometry(trackId)
  const theme = getTrackTheme(geometry?.track.theme)
  const field = useMemo(() => (geometry ? buildTrackField(geometry) : null), [geometry])

  useEffect(() => () => field?.texture.dispose(), [field])

  // Seule animation continue du circuit : le temps des vagues et du vent dans l'herbe.
  const reducedMotion = useReducedMotion()
  useFrame(({ clock }) => {
    trackTime.value = reducedMotion ? 0 : clock.elapsedTime
  })

  if (!geometry || !field) return null
  const { track, path, bounds } = geometry

  return (
    <group name="track-world" userData={{ trackId }}>
      <TrackGround path={path} field={field} theme={theme} />
      <TrackGrass field={field} theme={theme} seed={track.seed} />
      <Suspense fallback={null}>
        <TrackVegetation track={track} path={path} field={field} theme={theme} />
      </Suspense>
      <Suspense fallback={null}>
        <TrackDecor path={path} bounds={bounds} />
      </Suspense>
    </group>
  )
}
