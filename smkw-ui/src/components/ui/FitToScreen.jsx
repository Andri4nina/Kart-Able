import { useFitScale } from '../../hooks/useFitScale'

// Cadre qui fait tenir tout son contenu à l'écran, sans barre de défilement : le contenu est
// réduit par `zoom` (la mise en page suit, le texte reste net). Sur les très petits écrans
// (échelle minimale atteinte), il défile en secours avec la barre du jeu.
export function FitToScreen({ className = '', minScale = 0.6, children }) {
  const { frameRef, contentRef, scale, overflow } = useFitScale(minScale)

  return (
    <div ref={frameRef} className={`min-h-0 overflow-x-hidden ${overflow ? 'scrollbar-game overflow-y-auto' : 'overflow-y-hidden'} ${className}`}>
      {/* Style inline : l'échelle est mesurée à l'exécution (ResizeObserver), aucune classe ne peut la porter. */}
      <div ref={contentRef} className="[zoom:var(--fit)]" style={{ '--fit': scale }}>
        {children}
      </div>
    </div>
  )
}
