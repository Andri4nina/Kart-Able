import { BoxGeometry, ExtrudeGeometry, MeshStandardMaterial, Shape } from 'three'
import { PALETTE } from '../World/palette'

// Formes et matériaux des tremplins (créés une fois) : coin unité (longueur 1 le long de Z,
// hauteur 1, largeur 1, bord haut à l'avant), bande lumineuse sur la lèvre, flèches au sol.
// Tremplin à figures : jaune et orange ; rampe de vol (deltaplane) : bleu ciel.
function wedge() {
  const shape = new Shape()
  shape.moveTo(-0.5, 0)
  shape.lineTo(0.5, 0)
  shape.lineTo(0.5, 1)
  shape.closePath()
  // Profil dans le plan XY (x = le long de la rampe), extrudé selon Z puis tourné : X -> Z.
  return new ExtrudeGeometry(shape, { depth: 1, bevelEnabled: false }).translate(0, 0, -0.5).rotateY(-Math.PI / 2)
}

export const RAMP_GEOMETRIES = {
  wedge: wedge(),
  lip: new BoxGeometry(1, 0.12, 0.25),
  stripe: new BoxGeometry(1, 0.03, 0.4),
}

const standard = (color, emissive = 0) => new MeshStandardMaterial({ color, emissive: emissive ? color : '#000000', emissiveIntensity: emissive, roughness: 0.55, flatShading: true })

export const RAMP_MATERIALS = {
  trick: { body: standard(PALETTE.yellow), stripe: standard(PALETTE.orange, 0.5), lip: standard('#ffffff', 1.2) },
  glide: { body: standard(PALETTE.sky), stripe: standard(PALETTE.blue, 0.6), lip: standard('#ffffff', 1.2) },
}
