import {
  Color,
  DataUtils,
  DirectionalLight,
  HalfFloatType,
  HemisphereLight,
  MathUtils,
  PerspectiveCamera,
  Scene,
  WebGLRenderTarget,
} from 'three'

const SIZE = 192
const FOV = 24
const previousClear = new Color()

// Linéaire (0..1) vers un octet sRGB.
function toSrgbByte(linear) {
  const value = linear <= 0.0031308 ? linear * 12.92 : 1.055 * Math.pow(linear, 1 / 2.4) - 0.055
  return Math.round(Math.min(1, Math.max(0, value)) * 255)
}

// Pixels demi-flottants (linéaires, origine en bas) vers une image PNG en data URL.
function toDataUrl(halfPixels) {
  const canvas = document.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE
  const context = canvas.getContext('2d')
  const image = context.createImageData(SIZE, SIZE)
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      const from = ((SIZE - 1 - y) * SIZE + x) * 4
      const to = (y * SIZE + x) * 4
      for (let channel = 0; channel < 3; channel += 1) {
        image.data[to + channel] = toSrgbByte(DataUtils.fromHalfFloat(halfPixels[from + channel]))
      }
      image.data[to + 3] = Math.round(Math.min(1, DataUtils.fromHalfFloat(halfPixels[from + 3])) * 255)
    }
  }
  context.putImageData(image, 0, 0)
  return canvas.toDataURL('image/png')
}

// Rend une seule fois le haut d'un personnage préparé (pieds à y = 0, hauteur `height`) dans une
// texture hors écran, fond transparent, et renvoie l'image. `framing` : [centre, hauteur] du
// cadrage en fraction de la hauteur. N'affecte pas le rendu de la scène principale.
export function renderPortrait(gl, object, height, [centerRatio, spanRatio]) {
  const scene = new Scene()
  scene.add(new HemisphereLight('#ffffff', '#8a8f9c', 2.4))
  const key = new DirectionalLight('#ffffff', 2.2)
  key.position.set(1.5, 3, 4)
  scene.add(key, object)

  const centerY = height * centerRatio
  const span = height * spanRatio
  const camera = new PerspectiveCamera(FOV, 1, 0.05, 50)
  camera.position.set(0, centerY, span / 2 / Math.tan(MathUtils.degToRad(FOV / 2)))
  camera.lookAt(0, centerY, 0)

  const target = new WebGLRenderTarget(SIZE, SIZE, { type: HalfFloatType, samples: 4 })
  const previousTarget = gl.getRenderTarget()
  const previousAlpha = gl.getClearAlpha()
  gl.getClearColor(previousClear)

  const pixels = new Uint16Array(SIZE * SIZE * 4)
  try {
    gl.setRenderTarget(target)
    gl.setClearColor(0x000000, 0)
    gl.clear()
    gl.render(scene, camera)
    gl.readRenderTargetPixels(target, 0, 0, SIZE, SIZE, pixels)
  } finally {
    gl.setRenderTarget(previousTarget)
    gl.setClearColor(previousClear, previousAlpha)
    target.dispose()
    scene.remove(object)
  }
  return toDataUrl(pixels)
}
