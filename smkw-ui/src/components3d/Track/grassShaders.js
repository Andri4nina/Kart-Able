// Shaders de l'herbe des circuits (voir grassField.js) : brins posés sur le relief, couchés
// par le vent et par le passage des karts (uTrample).
export const VERTEX = /* glsl */ `
  #include <common>
  #include <fog_pars_vertex>
  attribute vec3 aCenter;
  uniform sampler2D uField;
  uniform sampler2D uHeight;
  uniform sampler2D uTrample;
  uniform vec2 uHeightRange;
  uniform vec2 uFieldOrigin;
  uniform float uFieldSize;
  uniform vec2 uCameraOffset;
  uniform float uPatchSize;
  uniform float uTime;
  varying float vTip;
  varying float vVariation;
  varying float vCrushed;
  void main() {
    float halfPatch = uPatchSize * 0.5;
    vec2 wrapped = mod(aCenter.xz - uCameraOffset + halfPatch, uPatchSize) - halfPatch;
    vec3 center = vec3(wrapped.x + uCameraOffset.x, 0.0, wrapped.y + uCameraOffset.y);
    vec2 fieldUv = (center.xz - uFieldOrigin) / uFieldSize;
    vec4 cell = texture2D(uField, fieldUv);
    center.y = uHeightRange.x + texture2D(uHeight, fieldUv).r * uHeightRange.y;
    float visible = smoothstep(0.15, 0.45, cell.g) * (1.0 - smoothstep(0.02, 0.2, cell.r)) * (1.0 - step(0.02, cell.b));
    vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
    // Écrasée par les roues : le brin se couche dans une direction propre à sa touffe.
    float crushed = texture2D(uTrample, fieldUv).r;
    float lay = fract(sin(dot(center.xz, vec2(4.1, 7.3))) * 917.13) * 6.2832;
    vec2 laid = vec2(cos(lay), sin(lay)) * position.y * 0.9 * crushed;
    float sway = sin(uTime * 1.7 + center.x * 0.35 + center.z * 0.21) * 0.12 * position.y * (1.0 - crushed);
    float standing = position.y * (1.0 - 0.85 * crushed);
    vec3 world = center + (right * position.x + vec3(sway + laid.x, standing, sway * 0.5 + laid.y)) * visible;
    vCrushed = crushed;
    vTip = clamp(position.y / 0.75, 0.0, 1.0);
    vVariation = fract(sin(dot(floor(center.xz * 0.25), vec2(12.9898, 78.233))) * 43758.5453);
    vec4 mvPosition = viewMatrix * vec4(world, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`

export const FRAGMENT = /* glsl */ `
  #include <common>
  #include <fog_pars_fragment>
  uniform vec3 uTipColor;
  uniform vec3 uBaseColor;
  varying float vTip;
  varying float vVariation;
  varying float vCrushed;
  void main() {
    vec3 color = mix(uBaseColor, uTipColor, vTip * (1.0 - 0.5 * vCrushed)) * (0.9 + vVariation * 0.2) * (1.0 - 0.18 * vCrushed);
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
    #include <fog_fragment>
  }
`

