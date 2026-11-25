import { AdditiveBlending, ConeGeometry, IcosahedronGeometry, MeshBasicMaterial, TorusGeometry } from 'three'
import { PALETTE } from '../World/palette'

// Ressources de la flamme de turbo, façon réacteur de voiture-fusée : trois cônes emboîtés en
// mélange additif (cœur blanc, flamme vive, enveloppe), longs et vacillants, et une onde de
// choc (anneau) au déclenchement. Couleurs selon la source (BOOSTS.effect).
const additive = (color, opacity = 0.9) => new MeshBasicMaterial({ color, blending: AdditiveBlending, transparent: true, opacity, depthWrite: false, toneMapped: false })

// Cône de base à l'origine, pointe vers +Y à 1 m (tourné vers l'arrière par le kart).
export const FLAME_GEOMETRY = new ConeGeometry(0.5, 1, 14, 1, true).translate(0, 0.5, 0)
export const RING_GEOMETRY = new TorusGeometry(0.5, 0.06, 6, 28)
export const GLOW_GEOMETRY = new IcosahedronGeometry(0.5, 0)

export const FLAME_STYLES = {
  nitro: { core: additive('#fff6d8'), mid: additive(PALETTE.yellow), outer: additive(PALETTE.orange, 0.55), length: 1 },
  orange: { core: additive('#fff3c4'), mid: additive(PALETTE.orange), outer: additive('#ff4d1a', 0.55), length: 0.75 },
  blue: { core: additive('#e8f6ff'), mid: additive(PALETTE.blue), outer: additive('#1b5cff', 0.55), length: 0.6 },
}
export const RING_MATERIAL = additive('#fff1c2')
export const SPARK_GLOWS = [PALETTE.white, PALETTE.blue, PALETTE.orange].map(additive)

// Pose des trois cônes d'un échappement : `power` 0..1 (fin du turbo), `flicker` aléatoire.
export function writeFlame(parts, style, power, flicker) {
  const length = style.length * power
  parts.outer.material = style.outer
  parts.mid.material = style.mid
  parts.core.material = style.core
  parts.outer.scale.set(0.26 * power, (1.5 + flicker * 0.45) * length, 0.26 * power)
  parts.mid.scale.set(0.18 * power, (1.05 + flicker * 0.3) * length, 0.18 * power)
  parts.core.scale.set(0.1 * power, 0.6 * length, 0.1 * power)
}
