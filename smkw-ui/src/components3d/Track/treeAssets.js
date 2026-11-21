import { Box3, Matrix4, Vector3 } from 'three'
import treePackUrl from '../../assets/models/Tree/lowpoly_tree_pack.glb'

// Pack d'arbres low poly (fourni) : un maillage par essence dans un seul fichier. Chaque
// essence est extraite, posée au sol et ramenée à 1 m de haut ; le placement l'agrandit.
// Vérifier la licence du pack avant publication.
export const TREE_PACK_URL = treePackUrl

const TREE_NODES = {
  greenCube: 'Plane002',
  greenBlock: 'Plane006',
  bluePine: 'Cone002',
  purple: 'Plane009',
  pinkPine: 'Plane011',
  tealLean: 'Plane012',
  acacia: 'Plane013',
  lollipop: 'Icosphere001',
  softPine: 'Icosphere003',
  purpleTwist: 'Icosphere011',
  redCube: 'Cube002',
  limeCube: 'Cube004',
  orangeUmbrella: 'Plane014',
  fir: 'Circle001',
  tallPine: 'Plane015',
}

// Buissons verts du même pack (les rochers noirs ne sont pas utilisés).
export const BUSH_NODES = Object.freeze(['Icosphere012', 'Icosphere019', 'Icosphere020'])

const box = new Box3()
const size = new Vector3()
const center = new Vector3()
const cache = new WeakMap()

function extractPart(scene, nodeName) {
  const node = scene.getObjectByName(nodeName)
  const mesh = node?.isMesh ? node : node?.children.find((child) => child.isMesh)
  if (!mesh) return null
  box.setFromObject(mesh)
  box.getSize(size)
  box.getCenter(center)
  const normalize = new Matrix4().makeScale(1 / size.y, 1 / size.y, 1 / size.y).multiply(new Matrix4().makeTranslation(-center.x, -box.min.y, -center.z))
  return { geometry: mesh.geometry, material: mesh.material, matrix: normalize.multiply(mesh.matrixWorld) }
}

// Pièces instanciables d'une essence (id de TREE_NODES) ou d'un buisson (nom de nœud).
export function getVegetationPart(scene, id) {
  if (!cache.has(scene)) {
    scene.updateMatrixWorld(true)
    cache.set(scene, new Map())
  }
  const parts = cache.get(scene)
  if (!parts.has(id)) parts.set(id, extractPart(scene, TREE_NODES[id] ?? id))
  return parts.get(id)
}
