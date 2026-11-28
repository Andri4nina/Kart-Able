import { useLayoutEffect, useRef, useState } from 'react'

// Échelle qui fait tenir un contenu dans la hauteur de son cadre, sans défilement : le contenu
// est réduit (`zoom`, voir FitToScreen) jusqu'à `minScale`. En dessous (très petits
// écrans), `overflow` vaut true et le cadre défile en secours.
// Mesure par ResizeObserver ; l'échelle converge en quelques mesures (la largeur change avec elle).
const TOLERANCE = 0.01

export function useFitScale(minScale) {
  const frameRef = useRef(null)
  const contentRef = useRef(null)
  const [fit, setFit] = useState({ scale: 1, overflow: false })

  useLayoutEffect(() => {
    const frame = frameRef.current
    const content = contentRef.current
    if (!frame || !content) return undefined
    const measure = () => {
      setFit((current) => {
        // Cadre non contraint (écran très bas : la page entière défile) : taille normale.
        if (getComputedStyle(frame).overflowY === 'visible') return current.scale === 1 && !current.overflow ? current : { scale: 1, overflow: false }
        const available = frame.clientHeight
        const needed = content.getBoundingClientRect().height
        if (!available || !needed) return current
        const wanted = Math.min(1, Math.max(minScale, (current.scale * available) / needed))
        const overflow = wanted <= minScale && needed > available + 1
        if (Math.abs(wanted - current.scale) < TOLERANCE && overflow === current.overflow) return current
        return { scale: wanted, overflow }
      })
    }
    const observer = new ResizeObserver(measure)
    observer.observe(frame)
    observer.observe(content)
    measure()
    return () => observer.disconnect()
  }, [minScale])

  return { frameRef, contentRef, ...fit }
}
