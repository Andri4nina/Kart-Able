import { Color } from 'three'

// Peinture du kart à la couleur du personnage (comme les jeux de kart de salon) : les zones
// colorées du véhicule (carrosserie, décors) prennent la teinte du personnage en gardant leur
// ombrage ; les zones neutres (pneus, noir, gris, chrome, blanc) restent intactes.
// Un seul programme GPU pour toutes les couleurs (la teinte est un uniform).
const PAINT_GLSL = /* glsl */ `
uniform vec3 uKartPaint;
vec3 kartPaint(vec3 color) {
  float high = max(color.r, max(color.g, color.b));
  float low = min(color.r, min(color.g, color.b));
  float saturation = high > 0.0 ? (high - low) / high : 0.0;
  float mask = smoothstep(0.2, 0.45, saturation);
  vec3 painted = uKartPaint * clamp(high / 0.55, 0.35, 1.25);
  return mix(color, painted, mask);
}
`

function paintMaterial(material, paint) {
  const copy = material.clone()
  const uniform = { value: new Color(paint) }
  copy.onBeforeCompile = (shader) => {
    shader.uniforms.uKartPaint = uniform
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${PAINT_GLSL}`)
      .replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.rgb = kartPaint(diffuseColor.rgb);')
  }
  copy.customProgramCacheKey = () => 'kart-paint'
  return copy
}

// Repeint tous les matériaux d'un véhicule cloné (copies : l'original du cache reste intact).
// Renvoie une fonction qui libère les copies.
export function applyKartPaint(object, paint) {
  const copies = []
  object.traverse((child) => {
    if (!child.isMesh) return
    const list = Array.isArray(child.material) ? child.material : [child.material]
    const painted = list.map((material) => {
      const copy = paintMaterial(material, paint)
      copies.push(copy)
      return copy
    })
    child.material = Array.isArray(child.material) ? painted : painted[0]
  })
  return () => {
    for (const material of copies) material.dispose()
  }
}
