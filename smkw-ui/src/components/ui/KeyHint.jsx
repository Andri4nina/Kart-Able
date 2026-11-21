// Rappel de touche clavier (écran d'accueil uniquement, pas pendant le jeu).
export function KeyHint({ keys, label }) {
  return (
    <span className="inline-flex items-center gap-2 bg-brand-ink/85 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/85">
      <kbd className="min-w-6 border border-b-2 border-white/35 px-1.5 py-0.5 text-center font-sans text-[11px] leading-none text-white">
        {keys}
      </kbd>
      {label}
    </span>
  )
}
