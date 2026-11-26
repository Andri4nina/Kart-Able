import { getCupEmblem } from './cupEmblems'

// Emblème d'une coupe : écusson à sa couleur (aplat, liseré sombre et filet clair), son symbole
// au centre et trois étoiles en couronne. SVG en aplats, aucun dégradé.
const SHIELD = 'M50 4 L92 18 V54 C92 80 74 98 50 108 C26 98 8 80 8 54 V18 Z'
const STAR = 'M0 -5 L1.5 -1.6 L5 -1.5 L2.3 0.8 L3.1 4.5 L0 2.5 L-3.1 4.5 L-2.3 0.8 L-5 -1.5 L-1.5 -1.6 Z'

export function CupEmblem({ cupId, className = '' }) {
  const { icon: Icon, fill } = getCupEmblem(cupId)
  return (
    <span className={`relative inline-flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 100 112" aria-hidden="true" className={`h-full w-full drop-shadow-[4px_4px_0_rgb(0_0_0/0.35)] ${fill}`}>
        <path d={SHIELD} fill="currentColor" stroke="var(--color-brand-ink)" strokeWidth="5" strokeLinejoin="round" />
        <path d={SHIELD} fill="none" stroke="white" strokeOpacity="0.55" strokeWidth="2.5" transform="translate(50 56) scale(0.84) translate(-50 -56)" />
        {[30, 50, 70].map((x) => (
          <path key={x} d={STAR} fill="var(--color-brand-yellow)" stroke="var(--color-brand-ink)" strokeWidth="0.8" transform={`translate(${x} ${x === 50 ? 20 : 24}) scale(1.3)`} />
        ))}
      </svg>
      <Icon aria-hidden="true" className="absolute top-[34%] size-[42%] text-white drop-shadow-[2px_2px_0_rgb(0_0_0/0.35)]" strokeWidth={2.4} />
    </span>
  )
}
