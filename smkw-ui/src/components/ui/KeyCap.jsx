// Touche ou bouton affiché comme une touche de clavier (aides, assignation des contrôles).
export function KeyCap({ children, className = '' }) {
  return (
    <kbd className={`inline-flex min-w-6 items-center justify-center border border-b-2 border-white/35 px-1.5 py-0.5 font-sans text-[10px] font-bold uppercase leading-none text-white ${className}`}>
      {children}
    </kbd>
  )
}
