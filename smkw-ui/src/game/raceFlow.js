import { RACE, TRACK_VOTE } from '../config/race'
import { INPUT_ACTIONS } from '../input/actions'
import { usePauseStore } from '../stores/pauseStore'
import { shareMatch } from '../net/netMatch'
import { useRaceFlowStore } from '../stores/raceFlowStore'
import { useRaceStore } from '../stores/raceStore'
import { useSessionStore } from '../stores/sessionStore'
import { useTrackVoteStore } from '../stores/trackVoteStore'
import { getRace, startRace } from './race/raceSession'
import { buildChangedMatch, buildNextMatch, buildVotedMatch, getVoteOptions, hasNextRace, tallyVotes } from './raceSequence'
import { createSelectionController } from './selection/createSelectionController'
import { areAllConfirmed, getConfirmedId } from './selection/selectionRules'

// Après une course : écran des résultats (points de la course, total de la partie), puis
// course suivante du programme, ou vote des joueurs pour le circuit suivant (le plus choisi est
// couru ; égalité : tirage au sort). En pleine course : changement de circuit (menu pause).
// Entrées : START ou A (n'importe quel joueur) pour continuer ; pendant le vote, chaque joueur
// choisit avec son périphérique (même contrôleur que les écrans de sélection).
const VOTE_COLUMNS = 4
const newSeed = () => Math.floor(Math.random() * 2 ** 31)
const matchPlayerIds = () => (useSessionStore.getState().match?.players ?? []).map((player) => player.id)
let revealTimer = null

function launch(match) {
  clearTimeout(revealTimer)
  usePauseStore.getState().reset()
  useRaceFlowStore.getState().reset()
  useSessionStore.getState().begin(match)
  startRace(match)
  shareMatch(match)
}

// Réseau local : seul l'hôte fait avancer la partie (résultats, vote, changement de circuit).
export const isNetGuest = () => Boolean(useSessionStore.getState().match?.net && !useSessionStore.getState().match.net.host)

// Les résultats n'acceptent une commande qu'après un court délai (appui involontaire).
function resultsReady() {
  const world = getRace()
  return Boolean(world && world.resultsAt !== null && world.time - world.resultsAt >= RACE.resultsInputDelay)
}

export function beginTrackVote() {
  const match = useSessionStore.getState().match
  useRaceFlowStore.getState().set({ step: 'vote', options: getVoteOptions(match), winner: null, counts: {} })
  useTrackVoteStore.getState().begin(match.players)
}

// Bouton « Continuer » des résultats : course suivante du programme, sinon le vote.
export function continueAfterResults() {
  const { match } = useSessionStore.getState()
  const { results } = useRaceStore.getState()
  if (!match || !results || useRaceFlowStore.getState().step || isNetGuest()) return false
  if (hasNextRace(match)) launch(buildNextMatch(match, results, newSeed()))
  else beginTrackVote()
  return true
}

// Menu pause : la course en cours est abandonnée (sans points) pour `trackId`.
export function changeTrack(trackId) {
  const { match } = useSessionStore.getState()
  if (!match?.trackId || !trackId || isNetGuest()) return false
  launch(buildChangedMatch(match, trackId, newSeed()))
  return true
}

// Fin du vote (tout le monde a choisi) : dépouillement, annonce, puis départ.
export function finishTrackVote() {
  const flow = useRaceFlowStore.getState()
  if (flow.step !== 'vote') return false
  const { selections } = useTrackVoteStore.getState()
  const votes = matchPlayerIds().map((id) => getConfirmedId(selections, id)).filter(Boolean)
  const { winner, counts } = tallyVotes(votes, flow.options, Math.random())
  flow.set({ step: 'reveal', winner, counts })
  clearTimeout(revealTimer)
  revealTimer = setTimeout(startVotedRace, TRACK_VOTE.revealMs)
  return true
}

export function startVotedRace() {
  const { match } = useSessionStore.getState()
  const { results } = useRaceStore.getState()
  const { step, winner } = useRaceFlowStore.getState()
  if (!match || step !== 'reveal' || !winner) return false
  launch(buildVotedMatch(match, winner, results ?? [], newSeed()))
  return true
}

export function resetRaceFlow() {
  clearTimeout(revealTimer)
  useRaceFlowStore.getState().reset()
  useTrackVoteStore.getState().reset()
}

const voteController = createSelectionController({ useStore: useTrackVoteStore, columns: VOTE_COLUMNS, onComplete: finishTrackVote })

export function handleRaceFlowInput(input) {
  if (useRaceStore.getState().phase !== 'results') return false
  const { step } = useRaceFlowStore.getState()
  if (step === 'vote') {
    const used = voteController(input)
    if (areAllConfirmed(matchPlayerIds(), useTrackVoteStore.getState().selections)) finishTrackVote()
    return used
  }
  if (step || !input.playerId) return false
  if (input.action !== INPUT_ACTIONS.START && input.action !== INPUT_ACTIONS.CONFIRM) return false
  return resultsReady() ? continueAfterResults() : true
}
