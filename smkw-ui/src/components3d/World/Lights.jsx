import { PALETTE } from './palette'

// Éclairage léger : une hémisphère (ambiance) + une directionnelle, sans ombres.
export function Lights() {
  return (
    <>
      <hemisphereLight args={[PALETTE.hemiSky, PALETTE.hemiGround, 1.6]} />
      <directionalLight position={[8, 14, 6]} intensity={1.8} />
    </>
  )
}
