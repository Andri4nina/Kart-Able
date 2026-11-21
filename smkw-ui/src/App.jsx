import { MotionConfig } from 'motion/react'
import { useEffect } from 'react'
import { UILayer } from './components/layout/UILayer'
import { useGlobalHotkeys } from './hooks/useGlobalHotkeys'
import { useReducedMotion } from './hooks/useReducedMotion'
import { useLocaleStore } from './stores/localeStore'
import { GameCanvas } from './scenes/GameCanvas'

// Composition racine : Canvas 3D en fond, calque UI au-dessus.
// Les deux ne communiquent que via les stores (voir docs/ARCHITECTURE.md).
export default function App() {
  const reducedMotion = useReducedMotion()
  const locale = useLocaleStore((state) => state.locale)
  useGlobalHotkeys()

  // Alimente la variante Tailwind `motion-ok:` (voir index.css).
  useEffect(() => {
    document.documentElement.dataset.reducedMotion = String(reducedMotion)
  }, [reducedMotion])

  // Langue du document (lecteurs d'écran, césure, polices).
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return (
    <MotionConfig reducedMotion={reducedMotion ? 'always' : 'never'}>
      <main className="relative h-full w-full overflow-hidden bg-brand-sky">
        <div className="absolute inset-0">
          <GameCanvas />
        </div>
        <UILayer />
      </main>
    </MotionConfig>
  )
}
