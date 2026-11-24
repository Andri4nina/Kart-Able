import { BufferAttribute, BufferGeometry, Color, DoubleSide, ShaderMaterial, UniformsLib, UniformsUtils, Vector2 } from 'three'
import { createRandom } from '../../game/track/noise'
import { trackTime } from './trackClock'

// Herbe des circuits, d'après l'herbe du portfolio (Grass / GrassMaterial) : une petite grille
// de brins qui « boucle » autour de la caméra dans le vertex shader (mod sur la position), donc
// un champ dense partout sans couvrir tout le monde. Chaque brin est un triangle face caméra,
// couché là où la texture de données dit « pas d'herbe » (route, sable, eau).
// Version allégée : pas de traînée de pas ni de neige. En écran partagé, la caméra de chaque
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

const VERTEX = /* glsl */ `
  #include <common>
  #include <fog_pars_vertex>
  attribute vec3 aCenter;
  uniform sampler2D uField;
  uniform sampler2D uHeight;
  uniform vec2 uHeightRange;
  uniform vec2 uFieldOrigin;
  uniform float uFieldSize;
  uniform vec2 uCameraOffset;
  uniform float uPatchSize;
  uniform float uTime;
  varying float vTip;
  varying float vVariation;
  void main() {
    float halfPatch = uPatchSize * 0.5;
    vec2 wrapped = mod(aCenter.xz - uCameraOffset + halfPatch, uPatchSize) - halfPatch;
    vec3 center = vec3(wrapped.x + uCameraOffset.x, 0.0, wrapped.y + uCameraOffset.y);
    vec2 fieldUv = (center.xz - uFieldOrigin) / uFieldSize;
    vec4 cell = texture2D(uField, fieldUv);
    center.y = uHeightRange.x + texture2D(uHeight, fieldUv).r * uHeightRange.y;
    float visible = smoothstep(0.15, 0.45, cell.g) * (1.0 - smoothstep(0.02, 0.2, cell.r)) * (1.0 - step(0.02, cell.b));
    vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
    float sway = sin(uTime * 1.7 + center.x * 0.35 + center.z * 0.21) * 0.12 * position.y;
    vec3 world = center + (right * position.x + vec3(sway, position.y, sway * 0.5)) * visible;
    vTip = clamp(position.y / 0.75, 0.0, 1.0);
    vVariation = fract(sin(dot(floor(center.xz * 0.25), vec2(12.9898, 78.233))) * 43758.5453);
    vec4 mvPosition = viewMatrix * vec4(world, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`

const FRAGMENT = /* glsl */ `
  #include <common>
  #include <fog_pars_fragment>
  uniform vec3 uTipColor;
  uniform vec3 uBaseColor;
  varying float vTip;
  varying float vVariation;
  void main() {
    vec3 color = mix(uBaseColor, uTipColor, vTip) * (0.9 + vVariation * 0.2);
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
    #include <fog_fragment>
  }
`

// `uCameraOffset` est poussé avant le rendu de chaque case (voir TrackGrass).
export function createGrassMaterial(field, theme, patchSize) {
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
