import { Podium } from './Podium'
import { ShowcaseGem } from './ShowcaseGem'
import { TireStack } from './TireStack'
import { TrafficCone } from './TrafficCone'

// Éléments de démonstration de la phase 1 (aucun gameplay, aucun circuit).
const CONE_COUNT = 8
const CONE_RADIUS = 6.5

const CONE_POSITIONS = Array.from({ length: CONE_COUNT }, (_, index) => {
  const angle = (index / CONE_COUNT) * Math.PI * 2 + Math.PI / CONE_COUNT
  return [Math.cos(angle) * CONE_RADIUS, 0, Math.sin(angle) * CONE_RADIUS]
})

const TIRE_STACKS = [
  { position: [-9, 0, -6], count: 3 },
  { position: [9.5, 0, -5], count: 2 },
  { position: [-10, 0, 5], count: 2 },
  { position: [11, 0, 6], count: 3 },
]

export function DemoProps() {
  return (
    <group name="demo-props">
      <Podium />
      <ShowcaseGem />
      {CONE_POSITIONS.map((position, index) => (
        <TrafficCone key={index} position={position} />
      ))}
      {TIRE_STACKS.map((stack, index) => (
        <TireStack key={index} position={stack.position} count={stack.count} />
      ))}
    </group>
  )
}
