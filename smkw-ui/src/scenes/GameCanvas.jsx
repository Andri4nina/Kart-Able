import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { CameraRig } from '../components3d/Camera/CameraRig'
import { SplitScreenRenderer } from '../components3d/Camera/SplitScreenRenderer'
import { PortraitStudio } from '../components3d/Characters/PortraitStudio'
import { TrackAssetsPreload } from '../components3d/Track/TrackAssetsPreload'
import { RaceSystem } from '../components3d/Systems/RaceSystem'
import { TestBridge } from '../components3d/Systems/TestBridge'
import { QUALITY_PRESETS, TEST_HOOKS_ENABLED } from '../config/gameConfig'
import { useSettingsStore } from '../stores/settingsStore'
import { DemoScene } from './DemoScene'

// Options WebGL figées (ne peuvent pas changer après création du contexte).
// preserveDrawingBuffer uniquement en mode test : captures fiables après advanceTime,
// sans coût en production.
const GL_OPTIONS = {
  antialias: true,
  stencil: false,
  powerPreference: 'high-performance',
  preserveDrawingBuffer: TEST_HOOKS_ENABLED,
}

// Unique Canvas de l'application. Caméra et systèmes sont indépendants de la scène.
// En partie, SplitScreenRenderer dessine la même scène une fois par joueur (écran partagé).
export function GameCanvas() {
  const quality = useSettingsStore((state) => state.quality)
  const dpr = (QUALITY_PRESETS[quality] ?? QUALITY_PRESETS.medium).dpr

  return (
    <Canvas dpr={dpr} gl={GL_OPTIONS} frameloop="always" className="touch-none">
      <CameraRig />
      <SplitScreenRenderer />
      <PortraitStudio />
      <TrackAssetsPreload />
      <RaceSystem />
      {TEST_HOOKS_ENABLED ? <TestBridge /> : null}
      {/* Suspense prêt pour le chargement GLB/KTX2 des phases suivantes. */}
      <Suspense fallback={null}>
        <DemoScene />
      </Suspense>
    </Canvas>
  )
}
