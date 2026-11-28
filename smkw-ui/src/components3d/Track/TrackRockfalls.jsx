import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { CircleGeometry, Euler, Matrix4, MeshBasicMaterial, Quaternion, Vector3 } from 'three'
import { getRace } from '../../game/race/raceSession'
import { getGroundHeight } from '../../game/track/trackHeight'
import { readRock } from '../../game/track/trackRockfalls'
import { FEATURE_GEOMETRIES, getRockMaterial } from './featureResources'

// Éboulements (game/track/trackRockfalls.js) : ombre d'alerte qui grandit et fonce sur la route,
// rocher qui tombe, reste posé, puis s'enfonce en s'effritant. Deux maillages en instances ;
// l'état de chaque rocher ne dépend que du temps de course. Aucune allocation par frame.
const SHADOW_GEOMETRY = new CircleGeometry(1, 20).rotateX(-Math.PI / 2)
const SHADOW_MATERIAL = new MeshBasicMaterial({ color: '#2a1208', transparent: true, opacity: 0.55, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -6 })
const DEFAULT_ROCK = '#a0603a'
const matrix = new Matrix4()
const position = new Vector3()
const rotation = new Quaternion()
const euler = new Euler()
const scale = new Vector3()
const state = { stage: 'idle', t: 0, height: 0 }

function hide(mesh, i) {
  matrix.makeScale(0, 0, 0)
  mesh.setMatrixAt(i, matrix)
}

export function TrackRockfalls({ geometry, theme }) {
  const rocksRef = useRef(null)
  const shadowsRef = useRef(null)
  const rocks = geometry.fallingRocks
  const grounds = useMemo(() => rocks.map((rock) => getGroundHeight(geometry, rock.x, rock.z)), [geometry, rocks])

  useFrame(({ clock }) => {
    const rockMesh = rocksRef.current
    const shadowMesh = shadowsRef.current
    if (!rockMesh || !shadowMesh) return
    const time = getRace()?.raceTime ?? clock.elapsedTime
    rocks.forEach((rock, i) => {
      readRock(rock, time, state)
      const r = rock.radius
      const ground = grounds[i]
      const falling = state.stage === 'warn' || state.stage === 'fall'
      if (falling) {
        const grow = state.stage === 'warn' ? 0.35 + 0.65 * state.t : 1
        position.set(rock.x, ground + 0.06, rock.z)
        matrix.compose(position, rotation.identity(), scale.setScalar(r * 1.15 * grow))
        shadowMesh.setMatrixAt(i, matrix)
      } else hide(shadowMesh, i)
      if (state.stage === 'idle' || state.stage === 'warn') return hide(rockMesh, i)
      const sink = state.stage === 'crumble' ? state.t : 0
      position.set(rock.x, ground + r * 0.5 + state.height - sink * r, rock.z)
      euler.set(rock.x + (state.stage === 'fall' ? state.t * 3 : 3), rock.phase, rock.z * 0.3)
      matrix.compose(position, rotation.setFromEuler(euler), scale.setScalar(r * (1 - sink * 0.5)))
      rockMesh.setMatrixAt(i, matrix)
    })
    rockMesh.instanceMatrix.needsUpdate = true
    shadowMesh.instanceMatrix.needsUpdate = true
  })

  if (!rocks.length) return null
  return (
    <group name="track-rockfalls">
      <instancedMesh ref={rocksRef} args={[FEATURE_GEOMETRIES.rock, getRockMaterial(theme.rock ?? DEFAULT_ROCK), rocks.length]} frustumCulled={false} castShadow />
      <instancedMesh ref={shadowsRef} args={[SHADOW_GEOMETRY, SHADOW_MATERIAL, rocks.length]} frustumCulled={false} renderOrder={2} />
    </group>
  )
}
