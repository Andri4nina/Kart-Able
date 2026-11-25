import { BufferAttribute, BufferGeometry, Color, DoubleSide, ShaderMaterial, UniformsLib, UniformsUtils, Vector2 } from 'three'
import { createRandom } from '../../game/track/noise'
import { FRAGMENT, VERTEX } from './grassShaders'
import { trackTime } from './trackClock'

// Herbe des circuits, d'après l'herbe du portfolio (Grass / GrassMaterial) : une petite grille
// de brins qui « boucle » autour de la caméra dans le vertex shader (mod sur la position), donc
// un champ dense partout sans couvrir tout le monde. Chaque brin est un triangle face caméra,
// couché là où la texture de données dit « pas d'herbe » (route, sable, eau).
// Version allégée : pas de neige. Les karts couchent l'herbe (uTrample, grassTrample.js). En écran partagé, la caméra de chaque
// case est poussée dans uCameraOffset avant son rendu (onBeforeRender, voir TrackGrass).
// Les brins sont posés sur le relief (texture de hauteurs uHeight, voir trackField.js).

export function buildGrassGeometry({ count, spacing, seed }) {
  const random = createRandom(seed)
  const positions = new Float32Array(count * count * 9)
  const centers = new Float32Array(count * count * 9)
  const half = (count * spacing) / 2
  let vertex = 0
  for (let iz = 0; iz < count; iz += 1) {
    for (let ix = 0; ix < count; ix += 1) {
      const cx = ix * spacing - half + (random() - 0.5) * spacing * 0.8
      const cz = iz * spacing - half + (random() - 0.5) * spacing * 0.8
      const height = 0.3 + random() * 0.45
      for (const [x, y] of [[-0.07, 0], [0.07, 0], [0, height]]) {
        positions.set([x, y, 0], vertex * 3)
        centers.set([cx, 0, cz], vertex * 3)
        vertex += 1
      }
    }
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  geometry.setAttribute('aCenter', new BufferAttribute(centers, 3))
  return { geometry, patchSize: count * spacing }
}

// `uCameraOffset` est poussé avant le rendu de chaque case (voir TrackGrass).
export function createGrassMaterial(field, theme, patchSize, trample) {
  const material = new ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    side: DoubleSide,
    fog: true,
    // Uniforms construits à la main : UniformsUtils.merge clonerait la texture de données.
    uniforms: {
      ...UniformsUtils.clone(UniformsLib.fog),
      uField: { value: field.texture },
      uHeight: { value: field.heightTexture },
      uTrample: { value: trample.texture },
      uHeightRange: { value: new Vector2(field.heightRange[0], field.heightRange[1]) },
      uFieldOrigin: { value: new Vector2(field.origin[0], field.origin[1]) },
      uFieldSize: { value: field.size },
      uCameraOffset: { value: new Vector2() },
      uPatchSize: { value: patchSize },
      uTipColor: { value: new Color(theme.grass.tip) },
      uBaseColor: { value: new Color(theme.grass.base) },
    },
  })
  material.uniforms.uTime = trackTime
  return material
}
