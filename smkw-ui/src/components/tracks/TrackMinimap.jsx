import { getTrackOutline } from '../../game/track/trackOutline'

// Mini-carte d'un circuit (SVG, couleurs pleines) : lacs, route, ligne de départ et, en version
// détaillée, les checkpoints. Générée depuis la définition du circuit (aucune image).
export function TrackMinimap({ trackId, detailed = false, className = '' }) {
  const outline = getTrackOutline(trackId)
  if (!outline) return null

  return (
    <svg viewBox={outline.viewBox} aria-hidden="true" className={className}>
      {outline.lakes.map((lake, index) => (
        <ellipse
          key={index}
          cx={lake.cx}
          cy={lake.cy}
          rx={lake.rx}
          ry={lake.ry}
          transform={`rotate(${lake.angle} ${lake.cx} ${lake.cy})`}
          className="fill-brand-blue/55"
        />
      ))}
      <path d={outline.d} fill="none" strokeLinejoin="round" strokeWidth={outline.roadWidth + 2.4} className="stroke-brand-ink" />
      <path d={outline.d} fill="none" strokeLinejoin="round" strokeWidth={outline.roadWidth} className="stroke-white/85" />
      {detailed
        ? outline.gates.map((gate, index) => <circle key={index} cx={gate.x} cy={gate.y} r={1.3} className="fill-brand-yellow" />)
        : null}
      <line {...outline.start} strokeWidth={detailed ? 2.2 : 2.8} strokeLinecap="round" className="stroke-brand-red" />
    </svg>
  )
}
