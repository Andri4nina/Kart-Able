import { SHRINK } from '../../config/items'
import { hitKart } from './kartHit'

// Contacts entre karts dus aux objets (calcul pur) : un kart en surcharge renverse ceux qu'il
// touche ; un kart de taille normale écrase un kart réduit par l'orage (tête-à-queue court).
// Rien à faire tant qu'aucun kart n'est en surcharge ni réduit.
const REACH = 1.6

export function updateKartContacts(world) {
  const { karts } = world
  if (!karts.some((kart) => kart.overdrive > 0 || kart.shrink > 0)) return
  for (const kart of karts) {
    if (kart.sinking > 0 || kart.shrink > 0) continue
    for (const other of karts) {
      if (other === kart || other.sinking > 0) continue
      const strong = kart.overdrive > 0 && other.overdrive <= 0
      const squash = other.shrink > 0
      if (!strong && !squash) continue
      if ((kart.x - other.x) ** 2 + (kart.z - other.z) ** 2 > REACH * REACH) continue
      hitKart(other, strong ? undefined : SHRINK.touch)
    }
  }
}
