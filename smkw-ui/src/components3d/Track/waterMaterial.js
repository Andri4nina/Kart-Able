import { Color, DataTexture, LinearFilter, MeshLambertMaterial, RedFormat, RepeatWrapping, Vector2 } from 'three'
import { fractalNoise } from '../../game/track/noise'
import { trackTime } from './trackClock'

// Eau des circuits, d'après l'eau du portfolio (WaterView) : un plan posé sur le terrain, animé
// dans le shader à partir de la texture de données (canal B = distance au rivage).
// - l'onde est un modulo sur (distance au bord + temps) : les vagues avancent vers la rive ;
// - la partie entière (numéro de la vague) décale le bruit : chaque vague se brise ailleurs ;
// - la crête s'élargit en arrivant au bord ; turquoise sur les hauts-fonds, bleu au large.
// Version allégée : ni glace, ni pluie, ni reflets (pas de cycle jour / nuit dans le jeu).

let noiseTexture = null

// Bruit tuilable 128 x 128 généré par code (aucun fichier image).
function getNoiseTexture() {
  if (noiseTexture) return noiseTexture
  const size = 128
  const data = new Uint8Array(size * size)
  for (let row = 0; row < size; row += 1) {
    for (let column = 0; column < size; column += 1) data[row * size + column] = Math.round(fractalNoise(column / 16, row / 16, 77, 3) * 255)
  }
  noiseTexture = new DataTexture(data, size, size, RedFormat)
  noiseTexture.wrapS = RepeatWrapping
  noiseTexture.wrapT = RepeatWrapping
  noiseTexture.magFilter = LinearFilter
  noiseTexture.minFilter = LinearFilter
  noiseTexture.needsUpdate = true
  return noiseTexture
}

export function createWaterMaterial(field, theme) {
  const material = new MeshLambertMaterial({ transparent: true, depthWrite: false })
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, {
      uTime: trackTime,
      uField: { value: field.texture },
      uFieldOrigin: { value: new Vector2(field.origin[0], field.origin[1]) },
      uFieldSize: { value: field.size },
      uNoise: { value: getNoiseTexture() },
      uShallow: { value: new Color(theme.water.shallow) },
      uDeep: { value: new Color(theme.water.deep) },
      uFoam: { value: new Color(theme.water.foam) },
    })
    const pars = 'uniform sampler2D uField;\nuniform vec2 uFieldOrigin;\nuniform float uFieldSize;\nvarying vec2 vFieldUv;\nvarying vec2 vWorldXZ;\n'
    shader.vertexShader = `${pars}${shader.vertexShader}`.replace(
      '#include <begin_vertex>',
      '#include <begin_vertex>\nvec4 waterWorld = modelMatrix * vec4(transformed, 1.0);\nvWorldXZ = waterWorld.xz;\nvFieldUv = (waterWorld.xz - uFieldOrigin) / uFieldSize;',
    )
    shader.fragmentShader = `${pars}uniform float uTime;\nuniform sampler2D uNoise;\nuniform vec3 uShallow;\nuniform vec3 uDeep;\nuniform vec3 uFoam;\n${shader.fragmentShader}`.replace(
      '#include <color_fragment>',
      `#include <color_fragment>
      float shoreDistance = texture2D(uField, vFieldUv).b;
      if (shoreDistance < 0.03) discard;
      float depth = clamp((shoreDistance - 0.06) / 0.94, 0.0, 1.0);
      float travel = shoreDistance * 7.0 + uTime * 0.16;
      float progress = fract(travel);
      float wave = floor(travel);
      float noise = texture2D(uNoise, vWorldXZ * 0.045 + vec2(wave * 0.173, wave * 0.487)).r;
      float shaped = progress + (noise - 0.5) * 0.32;
      float crestWidth = mix(0.22, 0.05, depth);
      float crest = smoothstep(0.5 - crestWidth, 0.5, shaped) * (1.0 - smoothstep(0.5, 0.5 + crestWidth, shaped));
      float foam = crest * smoothstep(0.46, 0.74, noise);
      diffuseColor.rgb = mix(uShallow, uDeep, depth * depth) + uFoam * foam;
      diffuseColor.a = min(0.35 + pow(depth, 1.3) * 0.55 + foam * 0.45, 0.9);`,
    )
  }
  return material
}
