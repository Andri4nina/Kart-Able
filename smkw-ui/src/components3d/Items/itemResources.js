import { AdditiveBlending, BoxGeometry, CatmullRomCurve3, CylinderGeometry, DoubleSide, IcosahedronGeometry, MeshBasicMaterial, MeshStandardMaterial, RingGeometry, SphereGeometry, TubeGeometry, Vector3 } from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { PALETTE } from '../World/palette'

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

export const ITEM_GEOMETRIES = {
  boxGlass: new RoundedBoxGeometry(BOX, BOX, BOX, 3, 0.16),
  boxFrame: boxFrame(),
  boxGlyph: questionMark(),
  boxHalo: new RingGeometry(0.85, 1.15, 32).rotateX(-Math.PI / 2),
  slick: new CylinderGeometry(1.25, 1.25, 0.04, 20),
  orb: new IcosahedronGeometry(0.42, 1),
}

export const ITEM_MATERIALS = {
  boxGlass: new MeshStandardMaterial({ color: '#ffffff', emissive: '#2a2a2a', emissiveIntensity: 1, transparent: true, opacity: 0.64, roughness: 0.06, metalness: 0.15, depthWrite: false }),
  boxFrame: new MeshBasicMaterial({ color: '#ffffff', toneMapped: false }),
  boxGlyph: new MeshBasicMaterial({ color: '#ffffff', toneMapped: false }),
  boxHalo: new MeshBasicMaterial({ color: '#ffffff', blending: AdditiveBlending, transparent: true, opacity: 0.55, depthWrite: false, side: DoubleSide, toneMapped: false }),
  slick: new MeshStandardMaterial({ color: '#15151c', roughness: 0.05, metalness: 0.4 }),
  orb: new MeshStandardMaterial({ color: PALETTE.purple, emissive: PALETTE.purple, emissiveIntensity: 1, flatShading: true }),
}
