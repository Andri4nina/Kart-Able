import { Color, MeshLambertMaterial, Vector2 } from 'three'

// Asphalte par défaut (valeurs linéaires, comme le shader).
const ASPHALT = Object.freeze([0.105, 0.115, 0.135])

// Matériaux du sol d'un circuit : terrain et route. Lambert (léger) complété par
// onBeforeCompile pour lire la texture de données du circuit (trackField.js).
const LAKE_DEPTH = 3.2

// Uniforms communs : la carte de données et son emprise dans le monde.
function fieldUniforms(field) {
  return {
    uField: { value: field.texture },
    uFieldOrigin: { value: new Vector2(field.origin[0], field.origin[1]) },
    uFieldSize: { value: field.size },
  }
}

const FIELD_PARS = /* glsl */ `
uniform sampler2D uField;
uniform vec2 uFieldOrigin;
uniform float uFieldSize;
varying vec2 vFieldUv;
`

// Terrain : herbe (deux teintes selon la densité), accotement, sable, lit des lacs creusé.
export function createTerrainMaterial(field, theme) {
  const material = new MeshLambertMaterial()
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, fieldUniforms(field), {
      uGroundA: { value: new Color(theme.ground[0]) },
      uGroundB: { value: new Color(theme.ground[1]) },
      uShoulder: { value: new Color(theme.shoulder) },
      uSand: { value: new Color(theme.sand) },
      uLakeDepth: { value: LAKE_DEPTH },
    })
    shader.vertexShader = `${FIELD_PARS}uniform float uLakeDepth;\n${shader.vertexShader}`.replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>
      vec4 fieldWorld = modelMatrix * vec4(transformed, 1.0);
      vFieldUv = (fieldWorld.xz - uFieldOrigin) / uFieldSize;
      transformed.y -= texture2D(uField, vFieldUv).b * uLakeDepth;`,
    )
    shader.fragmentShader = `${FIELD_PARS}uniform vec3 uGroundA;\nuniform vec3 uGroundB;\nuniform vec3 uShoulder;\nuniform vec3 uSand;\n${shader.fragmentShader}`.replace(
      '#include <color_fragment>',
      `#include <color_fragment>
      vec4 cell = texture2D(uField, vFieldUv);
      vec3 ground = mix(uGroundB, uGroundA, smoothstep(0.0, 1.0, cell.g));
      ground = mix(ground, uShoulder, smoothstep(0.05, 0.6, cell.r));
      ground = mix(ground, uSand, smoothstep(0.1, 0.7, cell.a));
      diffuseColor.rgb = ground;`,
    )
  }
  return material
}

// Route : revêtement (asphalte, neige tassée, terre selon l'ambiance) et lignes blanches de
// bord (attribut aRoad, voir roadGeometry.js).
export function createRoadMaterial(theme) {
  const material = new MeshLambertMaterial({ polygonOffset: true, polygonOffsetFactor: -2 })
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uRoad = { value: theme?.road ? new Color(theme.road) : new Color().setRGB(...ASPHALT) }
    shader.vertexShader = `attribute vec2 aRoad;\nvarying vec2 vRoad;\n${shader.vertexShader}`.replace(
      '#include <begin_vertex>',
      '#include <begin_vertex>\nvRoad = aRoad;',
    )
    shader.fragmentShader = `varying vec2 vRoad;\nuniform vec3 uRoad;\n${shader.fragmentShader}`.replace(
      '#include <color_fragment>',
      `#include <color_fragment>
      float grain = fract(sin(dot(floor(vRoad * vec2(18.0, 1.5)), vec2(12.9898, 78.233))) * 43758.5453);
      vec3 asphalt = uRoad * (0.92 + grain * 0.16);
      float edge = step(0.94, abs(vRoad.x));
      diffuseColor.rgb = mix(asphalt, vec3(0.92), edge);`,
    )
  }
  return material
}

// Marquages (bordures, damier, repères) : couleurs de sommet, faces tournées vers le haut.
export function createMarkingsMaterial() {
  return new MeshLambertMaterial({ vertexColors: true, polygonOffset: true, polygonOffsetFactor: -4 })
}
