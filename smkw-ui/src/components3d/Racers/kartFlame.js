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
  nitro: { core: additive('#fff6d8'), mid: additive(PALETTE.yellow), outer: additive(PALETTE.orange, 0.55), length: 1.25 },
  orange: { core: additive('#fff3c4'), mid: additive(PALETTE.orange), outer: additive('#ff4d1a', 0.55), length: 1.05 },
  blue: { core: additive('#e8f6ff'), mid: additive(PALETTE.blue), outer: additive('#1b5cff', 0.55), length: 0.9 },
  purple: { core: additive('#fbe8ff'), mid: additive(PALETTE.purple), outer: additive('#c13bff', 0.55), length: 0.9 },
}
export const RING_MATERIAL = additive('#fff1c2')
export const SPARK_GLOWS = [PALETTE.white, PALETTE.blue, PALETTE.orange, PALETTE.purple].map((color) => additive(color))

// Pose des trois cônes d'un échappement : `power` 0..1 (fin du turbo), `flicker` aléatoire.
export function writeFlame(parts, style, power, flicker) {
  const length = style.length * power
  parts.outer.material = style.outer
  parts.mid.material = style.mid
  parts.core.material = style.core
  parts.outer.scale.set(0.34 * power, (1.5 + flicker * 0.5) * length, 0.34 * power)
  parts.mid.scale.set(0.22 * power, (1.05 + flicker * 0.35) * length, 0.22 * power)
  parts.core.scale.set(0.12 * power, 0.65 * length, 0.12 * power)
}
