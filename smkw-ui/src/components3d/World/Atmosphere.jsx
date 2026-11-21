import { useSessionStore } from '../../stores/sessionStore'
import { PALETTE } from './palette'

// Distances du brouillard : arène du menu, ou circuit (bien plus grand, le brouillard cache le
// bord du terrain généré).
const FOG = { arena: [35, 110], track: [140, 520] }

// Fond et brouillard dessinés dans le Canvas (pas de fond CSS). Couleur unie.
export function Atmosphere() {
  const onTrack = useSessionStore((state) => Boolean(state.match?.trackId))
  const [near, far] = onTrack ? FOG.track : FOG.arena
  return (
    <>
      <color attach="background" args={[PALETTE.sky]} />
      <fog key={onTrack ? 'track' : 'arena'} attach="fog" args={[PALETTE.sky, near, far]} />
    </>
  )
}
