import { RaceItems } from '../components3d/Items/RaceItems'
import { StartGrid } from '../components3d/Racers/StartGrid'
import { SelectionPreviewStage } from '../components3d/SelectionPreview/SelectionPreviewStage'
import { TrackWorld } from '../components3d/Track/TrackWorld'
import { Atmosphere } from '../components3d/World/Atmosphere'
import { DemoProps } from '../components3d/World/DemoProps'
import { Ground } from '../components3d/World/Ground'
import { Lights } from '../components3d/World/Lights'
import { useSessionStore } from '../stores/sessionStore'

// Scène unique : l'arène décorative du menu, remplacée par le circuit généré pendant une
// course (partie avec un circuit). La rangée de previews n'apparaît que sur les écrans de
// sélection, la grille de départ seulement pendant une partie (vue par l'écran partagé).
export function DemoScene() {
  const trackId = useSessionStore((state) => state.match?.trackId ?? null)
  return (
    <>
      <Atmosphere />
      <Lights />
      {trackId ? (
        <>
          <TrackWorld trackId={trackId} />
          <RaceItems />
        </>
      ) : (
        <>
          <Ground />
          <DemoProps />
        </>
      )}
      <SelectionPreviewStage />
      <StartGrid />
    </>
  )
}
