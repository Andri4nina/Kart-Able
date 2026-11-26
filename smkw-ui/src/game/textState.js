import { isSystemReducedMotion } from '../hooks/useReducedMotion'
import { SCREENS } from '../navigation/screens'
import { useBindingsStore } from '../stores/bindingsStore'
import { useInputDevicesStore } from '../stores/inputDevicesStore'
import { useLocaleStore } from '../stores/localeStore'
import { useMatchSetupStore } from '../stores/matchSetupStore'
import { selectCurrentScreen, useNavigationStore } from '../stores/navigationStore'
import { useRaceFlowStore } from '../stores/raceFlowStore'
import { useSessionStore } from '../stores/sessionStore'
import { useSettingsStore } from '../stores/settingsStore'
import { useCourseStore } from '../stores/courseStore'
import { useTrackVoteStore } from '../stores/trackVoteStore'
import { describeHud, describeRace } from './race/raceText'
import { collectButtons, collectProps, describeTrack, round, summarizeLocalPlayers } from './textStateParts'

const COORDINATES =
  'meters; origin = arena center at ground level; +x right, +y up, +z toward the race camera'

const roundVector = (v) => [round(v.x), round(v.y), round(v.z)]

// Payload concis pour window.render_game_to_text : ce qui est visible et interactif.
// En partie, les caméras des cases de l'écran partagé sont décrites à part (TestBridge).
export function buildTextState({ camera, scene, timeControl }) {
  const navigation = useNavigationStore.getState()
  const screen = selectCurrentScreen(navigation)
  const setup = useMatchSetupStore.getState()
  const settings = useSettingsStore.getState()
  const match = useSessionStore.getState().match
  const gem = scene.getObjectByName('showcase-gem')
  const reducedMotionActive =
    settings.motion === 'system' ? isSystemReducedMotion() : settings.motion === 'reduced'

  return {
    coordinates: COORDINATES,
    screen,
    stack: navigation.stack,
    timeControl,
    locale: useLocaleStore.getState().locale,
    overlays: { settingsOpen: navigation.settingsOpen },
    focus: document.activeElement?.id || null,
    buttons: collectButtons(),
    matchSetup: {
      modeId: setup.modeId,
      playType: setup.playType,
      online: setup.online,
    },
    localPlayers: summarizeLocalPlayers(),
    inputDevices: Object.values(useInputDevicesStore.getState().devices).map(({ id, connected }) =>
      connected ? id : `${id} (disconnected)`,
    ),
    bindings: useBindingsStore.getState().bindings,
    match,
    track: describeTrack(match),
    trackSelection: (({ step, cupId, playlist }) => ({ step, cupId, playlist }))(useCourseStore.getState()),
    hud: screen === SCREENS.GAME ? describeHud(match) : null,
    race: describeRace(),
    // Enchaînement après la course : coupe (course n / total), étape (résultats, vote, annonce).
    raceFlow: match?.trackId
      ? {
          cup: match.cupId ? { id: match.cupId, round: match.round + 1, of: match.playlist.length } : null,
          ...useRaceFlowStore.getState(),
          votes: Object.fromEntries(Object.entries(useTrackVoteStore.getState().selections).map(([id, selection]) => [id, selection.confirmedId ?? `(${selection.preselectedId})`])),
        }
      : null,
    camera: { position: roundVector(camera.position), fov: round(camera.fov, 1) },
    scene: {
      showcaseGem: gem
        ? { y: round(gem.position.y), rotationY: round(gem.rotation.y), color: `#${gem.material.color.getHexString()}` }
        : null,
      props: collectProps(scene).length,
      racers: scene.getObjectByName('start-grid')?.children.length ?? 0,
    },
    settings: {
      quality: settings.quality,
      motion: settings.motion,
      fov: settings.fov,
      reducedMotionActive,
    },
  }
}
