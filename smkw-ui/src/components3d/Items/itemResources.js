import { AdditiveBlending, BoxGeometry, BufferAttribute, CatmullRomCurve3, Color, CylinderGeometry, DoubleSide, IcosahedronGeometry, MeshBasicMaterial, MeshStandardMaterial, RingGeometry, SphereGeometry, TubeGeometry, Vector3 } from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'

// Formes et matériaux partagés des objets en course (créés une fois, jamais par frame).
// Case à objets : cube de verre irisé aux coins arrondis (teinte par instance qui change avec
// le temps ; dorée pour une case dorée), arêtes lumineuses, point d'interrogation qui flotte au
// centre, halo au sol.
const BOX = 1.3
const EDGE = 0.12

function boxFrame() {
  const half = BOX / 2
  const bars = []
  for (const a of [-half, half]) {
    for (const b of [-half, half]) {
      bars.push(new BoxGeometry(BOX + EDGE, EDGE, EDGE).translate(0, a, b))
      bars.push(new BoxGeometry(EDGE, BOX + EDGE, EDGE).translate(a, 0, b))
      bars.push(new BoxGeometry(EDGE, EDGE, BOX + EDGE).translate(a, b, 0))
    }
  }
  return mergeGeometries(bars)
}

// Point d'interrogation en volume : crochet (tube le long d'une courbe) et point.
function questionMark() {
  const points = [[-0.2, 0.2], [-0.13, 0.33], [0.02, 0.39], [0.17, 0.33], [0.2, 0.18], [0.09, 0.06], [0, -0.03], [0, -0.13]]
  const curve = new CatmullRomCurve3(points.map(([x, y]) => new Vector3(x, y, 0)))
  const hook = new TubeGeometry(curve, 28, 0.065, 8, false)
  const dot = new SphereGeometry(0.08, 10, 8).translate(0, -0.3, 0)
  return mergeGeometries([hook.toNonIndexed(), dot.toNonIndexed()])
}

// Verre prismatique : chaque face a sa couleur (arc-en-ciel), d'après sa normale, comme les
// cases à objets de la référence. Couleurs par sommet (aucun dégradé dessiné : aplat par face,
// fondu seulement sur les arrondis).
const FACE_HUES = [0, 0.16, 0.33, 0.5, 0.62, 0.8]
function prismGlass() {
  const geometry = new RoundedBoxGeometry(BOX, BOX, BOX, 3, 0.16)
  const normals = geometry.getAttribute('normal')
  const colors = new Float32Array(normals.count * 3)
  const color = new Color()
  for (let i = 0; i < normals.count; i += 1) {
    const x = normals.getX(i)
    const y = normals.getY(i)
    const z = normals.getZ(i)
    const ax = Math.abs(x)
    const ay = Math.abs(y)
    const az = Math.abs(z)
    const face = ax >= ay && ax >= az ? (x > 0 ? 0 : 1) : ay >= az ? (y > 0 ? 2 : 3) : z > 0 ? 4 : 5
    color.setHSL(FACE_HUES[face], 1, 0.56).toArray(colors, i * 3)
  }
  geometry.setAttribute('color', new BufferAttribute(colors, 3))
  return geometry
}

export const ITEM_GEOMETRIES = {
  boxGlass: prismGlass(),
  boxFrame: boxFrame(),
  boxGlyph: questionMark(),
  boxHalo: new RingGeometry(0.85, 1.15, 32).rotateX(-Math.PI / 2),
  slick: new CylinderGeometry(1.25, 1.25, 0.04, 20),
  orb: new IcosahedronGeometry(0.42, 1),
}

export const ITEM_MATERIALS = {
  boxGlass: new MeshStandardMaterial({ color: '#ffffff', vertexColors: true, emissive: '#151515', emissiveIntensity: 1, transparent: true, opacity: 0.74, roughness: 0.06, metalness: 0.15, depthWrite: false }),
  boxFrame: new MeshBasicMaterial({ color: '#ffffff', toneMapped: false }),
  boxGlyph: new MeshBasicMaterial({ color: '#ffffff', toneMapped: false }),
  boxHalo: new MeshBasicMaterial({ color: '#ffffff', blending: AdditiveBlending, transparent: true, opacity: 0.55, depthWrite: false, side: DoubleSide, toneMapped: false }),
  slick: new MeshStandardMaterial({ color: '#15151c', roughness: 0.05, metalness: 0.4 }),
  // Projectiles : teinte par instance (couleur de l'objet, config/items.js).
  orb: new MeshStandardMaterial({ color: '#ffffff', emissive: '#3a3a3a', emissiveIntensity: 1, flatShading: true }),
}
