import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import { Vector3 } from 'three'
import { MAX_FRAME_DELTA } from '../../config/gameConfig'
import { getCellCount, getSplitGrid, getViewportRect, isPortrait } from '../../config/splitScreen'
import { getRace, getRaceKart } from '../../game/race/raceSession'
import { getRacerOrder } from '../../game/race/raceRoster'
import { getRaceBounds, getRaceStartSlot } from '../../game/race/startSlots'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { SCREENS } from '../../navigation/screens'
import { selectCurrentScreen, useNavigationStore } from '../../stores/navigationStore'
import { useSessionStore } from '../../stores/sessionStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { fitCellFraming, getChaseFovKick, OVERVIEW_FOV, writeChaseCamera, writeKartChase, writeOverviewCamera } from './chaseCamera'
import { recordSplitView, setSplitViewCount, splitCameras } from './splitViews'

// Priorité > 0 : R3F cesse son rendu automatique tant que ce composant est monté.
const RENDER_PRIORITY = 1
// Objets réutilisés : aucune allocation par frame.
const lookTarget = new Vector3()
const framing = { fov: 0, distance: 1 }

// Vue d'ensemble : vue de très haut, elle serait noyée dans le brouillard de course. On écarte
// le brouillard le temps de cette case seulement (mêmes shaders, seules ses distances changent).
const OVERVIEW_FOG = { near: 700, far: 2600 }

function renderCell(gl, scene, camera, overview) {
  const fog = overview ? scene.fog : null
  const near = fog?.near
  const far = fog?.far
  if (fog) Object.assign(fog, OVERVIEW_FOG)
  gl.render(scene, camera)
  if (fog) Object.assign(fog, { near, far })
}

// Une caméra par case : poursuite derrière le kart du joueur (en course), ou derrière sa place
// de départ (modes d'arène) ; vue d'ensemble pour une case vide. L'ordre des joueurs dans la
// partie donne leur case.
function SplitViews({ match }) {
  const players = match.players
  const reducedMotion = useReducedMotion()
  const slots = useMemo(() => players.map((player) => getRaceStartSlot(match, getRacerOrder(match, player.id))), [match, players])
  const bounds = useMemo(() => getRaceBounds(match), [match])
  useEffect(() => () => setSplitViewCount(0), [])

  useFrame(({ gl, scene, size }, delta) => {
    const race = getRace()
    const dt = Math.min(delta, MAX_FRAME_DELTA)
    const grid = getSplitGrid(players.length, isPortrait(size.width, size.height))
    const cellCount = getCellCount(grid)
    const playerFov = useSettingsStore.getState().fov
    gl.setScissorTest(true)

    for (let cell = 0; cell < cellCount; cell += 1) {
      const rect = getViewportRect(cell, grid)
      // Bords arrondis au pixel ; WebGL compte les lignes depuis le bas.
      const left = Math.round(rect.x * size.width)
      const top = Math.round(rect.y * size.height)
      const width = Math.round((rect.x + rect.width) * size.width) - left
      const height = Math.round((rect.y + rect.height) * size.height) - top
      const bottom = size.height - top - height

      const player = players[cell]
      const camera = splitCameras[cell]
      const aspect = width / Math.max(1, height)
      const kart = player ? getRaceKart(player.id) : null
      const kick = kart && !reducedMotion ? getChaseFovKick(cell) : 0
      const { fov, distance } = fitCellFraming(player ? playerFov + kick : OVERVIEW_FOV, aspect, framing)
      if (kart) writeKartChase(cell, kart, race, dt, reducedMotion, distance, camera.position, lookTarget)
      else if (player) writeChaseCamera(slots[cell], distance, camera.position, lookTarget)
      // Vue d'ensemble : une case plus haute que large recule d'autant pour montrer tout le circuit.
      else writeOverviewCamera(distance * Math.max(1, 1 / aspect), camera.position, lookTarget, bounds)
      camera.lookAt(lookTarget)

      if (camera.fov !== fov || camera.aspect !== aspect) {
        camera.fov = fov
        camera.aspect = aspect
        camera.updateProjectionMatrix()
      }

      gl.setViewport(left, bottom, width, height)
      gl.setScissor(left, bottom, width, height)
      renderCell(gl, scene, camera, !player)
      recordSplitView(cell, player?.id ?? null, left, top, width, height)
    }

    setSplitViewCount(cellCount)
    gl.setScissorTest(false)
    gl.setViewport(0, 0, size.width, size.height)
  }, RENDER_PRIORITY)

  return null
}

// Écran partagé pendant la partie : actif seulement sur l'écran de jeu avec des joueurs locaux.
// Ailleurs, R3F reprend son rendu habituel avec la caméra du menu (CameraRig).
export function SplitScreenRenderer() {
  const inGame = useNavigationStore((state) => selectCurrentScreen(state) === SCREENS.GAME)
  const match = useSessionStore((state) => state.match)
  if (!inGame || !match?.players?.length) return null
  return <SplitViews match={match} />
}
