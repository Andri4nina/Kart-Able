import { useLayoutEffect, useRef } from 'react'
import { Matrix4, Quaternion, Vector3 } from 'three'

// Objets répétés (arbres, barrières, tribunes...) dessinés en instances : un maillage instancié
// par pièce du modèle, quel que soit le nombre de copies. `parts` : [{ geometry, material,
// matrix }] (matrice de la pièce dans son modèle) ; `transforms` : [{ x, y, z, yaw, scale }].

const placement = new Matrix4()
const combined = new Matrix4()
const position = new Vector3()
const rotation = new Quaternion()
const scale = new Vector3()
const UP = new Vector3(0, 1, 0)

function InstancedPart({ part, transforms }) {
  const meshRef = useRef(null)

  useLayoutEffect(() => {
    const mesh = meshRef.current
    transforms.forEach((transform, index) => {
      position.set(transform.x, transform.y ?? 0, transform.z)
      rotation.setFromAxisAngle(UP, transform.yaw ?? 0)
      scale.setScalar(transform.scale ?? 1)
      placement.compose(position, rotation, scale)
      combined.multiplyMatrices(placement, part.matrix)
      mesh.setMatrixAt(index, combined)
    })
    mesh.instanceMatrix.needsUpdate = true
    mesh.computeBoundingSphere()
  }, [part, transforms])

  return <instancedMesh ref={meshRef} args={[part.geometry, part.material, transforms.length]} />
}

export function InstancedParts({ parts, transforms, name }) {
  if (!parts || transforms.length === 0) return null
  return (
    <group name={name}>
      {parts.map((part, index) => (
        <InstancedPart key={`${index}-${transforms.length}`} part={part} transforms={transforms} />
      ))}
    </group>
  )
}
