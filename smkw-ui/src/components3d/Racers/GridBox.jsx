import { getMaterial, UNIT_GEOMETRIES } from '../Characters/characterResources'
import { PALETTE } from '../World/palette'

// Case de départ peinte (largeur, longueur).
const [BOX_WIDTH, BOX_LENGTH] = [2.3, 3.4]
const LINE = 0.14

// Case de départ peinte au sol, à la couleur du pilote (cadre ouvert vers l'avant). Elle reste
// sur la grille quand le kart part. `slot` : { x, z, yaw }.
export function GridBox({ slot, color }) {
  const material = getMaterial(color, { glow: true })
  return (
    <group position={[slot.x, 0.055, slot.z]} rotation-y={slot.yaw}>
      <mesh geometry={UNIT_GEOMETRIES.box} material={getMaterial(PALETTE.asphalt)} scale={[BOX_WIDTH, 0.01, BOX_LENGTH]} />
      <mesh geometry={UNIT_GEOMETRIES.box} material={material} position={[-BOX_WIDTH / 2, 0.01, 0]} scale={[LINE, 0.01, BOX_LENGTH]} />
      <mesh geometry={UNIT_GEOMETRIES.box} material={material} position={[BOX_WIDTH / 2, 0.01, 0]} scale={[LINE, 0.01, BOX_LENGTH]} />
      <mesh geometry={UNIT_GEOMETRIES.box} material={material} position={[0, 0.01, BOX_LENGTH / 2]} scale={[BOX_WIDTH + LINE, 0.01, LINE]} />
    </group>
  )
}
