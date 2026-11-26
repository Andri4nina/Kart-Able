import { AdditiveBlending, BoxGeometry, Color, IcosahedronGeometry, InstancedMesh, MeshBasicMaterial, MeshLambertMaterial, PlaneGeometry, TetrahedronGeometry } from 'three'
import { createParticlePool } from './particlePool'
import { createTrailPool } from './trailPool'

// Couches de particules de la course (créées une fois par course, libérées à la fin) :
// - glow  : étincelles, braises, éclats (mélange additif, s'éteignent) ;
// - puff  : fumée de pneus et de turbo (translucide, grossit puis s'efface) ;
// - chunk : terre, herbe, gerbes d'eau (opaque, éclairé).
const LAYERS = {
  glow: { capacity: 2048, geometry: () => new BoxGeometry(1, 1, 1), material: () => new MeshBasicMaterial({ blending: AdditiveBlending, transparent: true, depthWrite: false, toneMapped: false }), mode: 'glow', stretch: 0.09 },
  puff: { capacity: 1536, geometry: () => new IcosahedronGeometry(0.5, 0), material: () => new MeshBasicMaterial({ transparent: true, opacity: 0.42, depthWrite: false }), mode: 'puff', stretch: 0 },
  chunk: { capacity: 1024, geometry: () => new TetrahedronGeometry(0.6, 0), material: () => new MeshLambertMaterial({ flatShading: true }), mode: 'puff', stretch: 0 },
}

// Traînées au sol (trailPool.js) : marques de pneus (sombres, s'amincissent) et traînées
// lumineuses du drift (additives, s'éteignent). Plan unité couché, long selon Z.
const flatPlane = () => new PlaneGeometry(1, 1).rotateX(-Math.PI / 2)
const TRAILS = {
  skid: { capacity: 3072, geometry: flatPlane, material: () => new MeshBasicMaterial({ transparent: true, opacity: 0.5, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -6 }), mode: 'skid' },
  streak: { capacity: 1024, geometry: flatPlane, material: () => new MeshBasicMaterial({ blending: AdditiveBlending, transparent: true, depthWrite: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -8 }), mode: 'glow' },
  boost: { capacity: 2048, geometry: flatPlane, material: () => new MeshBasicMaterial({ blending: AdditiveBlending, transparent: true, depthWrite: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -10 }), mode: 'glow' },
}

function createLayers(definitions, prefix, createPool) {
  const white = new Color('#ffffff')
  return Object.fromEntries(
    Object.entries(definitions).map(([name, layer]) => {
      const mesh = new InstancedMesh(layer.geometry(), layer.material(), layer.capacity)
      mesh.name = `${prefix}-${name}`
      mesh.frustumCulled = false
      // Couleur par instance créée avant le premier rendu (le shader la prend en compte).
      for (let i = 0; i < layer.capacity; i += 1) mesh.setColorAt(i, white)
      return [name, { mesh, pool: createPool(layer.capacity), mode: layer.mode, stretch: layer.stretch ?? 0 }]
    }),
  )
}

export const createParticleLayers = () => createLayers(LAYERS, 'particles', createParticlePool)
export const createTrailLayers = () => createLayers(TRAILS, 'trails', createTrailPool)

export function disposeParticleLayers(layers) {
  for (const { mesh } of Object.values(layers)) {
    mesh.geometry.dispose()
    mesh.material.dispose()
    mesh.dispose()
  }
}
