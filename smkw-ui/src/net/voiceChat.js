import { VOICE } from '../config/network'
import { useNetStore } from '../stores/netStore'
import { useVoiceStore } from '../stores/voiceStore'
import { sendRelay } from './lanSession'
import { acceptAnswer, acceptOffer, addCandidate, closeAllPeers, closePeer, peerIds, sendOffer, setDeafened } from './voicePeers'

// Chat vocal d'un salon en réseau : chaque machine qui active son micro rejoint le vocal, et une
// liaison audio directe s'ouvre avec chaque autre machine du vocal (voicePeers.js). Négociation
// par messages relayés { kind: 'voice', op, to? } :
// - join (à tous) : j'entre dans le vocal ; here (à une machine) : j'y suis déjà ;
// - offer / answer / ice : négociation WebRTC ; leave (à tous) : je quitte le vocal.
// Des deux machines, celle au plus petit identifiant envoie l'offre (pas d'offres croisées).
let stream = null

const store = () => useVoiceStore.getState()
const myId = () => useNetStore.getState().clientId
const signal = (to, payload) => sendRelay({ kind: 'voice', to, ...payload })

function micError(error) {
  if (!navigator.mediaDevices?.getUserMedia) return 'unavailable'
  return error?.name === 'NotAllowedError' || error?.name === 'SecurityError' ? 'denied' : 'noMicrophone'
}

export async function joinVoice() {
  if (stream || !useNetStore.getState().room) return
  store().set({ status: 'connecting', error: null })
  try {
    if (!navigator.mediaDevices?.getUserMedia) throw new Error('unavailable')
    stream = await navigator.mediaDevices.getUserMedia({ audio: VOICE.audio, video: false })
  } catch (error) {
    store().set({ status: 'error', error: micError(error) })
    return
  }
  for (const track of stream.getAudioTracks()) track.enabled = !store().muted
  setDeafened(store().deafened)
  store().set({ status: 'on' })
  sendRelay({ kind: 'voice', op: 'join' })
}

export function leaveVoice() {
  if (stream) sendRelay({ kind: 'voice', op: 'leave' })
  closeAllPeers()
  stream?.getTracks().forEach((track) => track.stop())
  stream = null
  store().set({ status: 'off', peers: {} })
}

// Reconnexion : on quitte et on revient (nouveau micro, nouvelles liaisons).
export async function reconnectVoice() {
  leaveVoice()
  await joinVoice()
}

export function toggleMute() {
  const muted = !store().muted
  stream?.getAudioTracks().forEach((track) => (track.enabled = !muted))
  store().set({ muted })
}

export function toggleDeafen() {
  const deafened = !store().deafened
  setDeafened(deafened)
  store().set({ deafened })
}

// Message 'voice' reçu de la machine `from` (net/netBridge.js).
export function handleVoiceSignal(data, from) {
  if (data.to !== undefined && data.to !== myId()) return
  if (data.op === 'leave') return closePeer(from)
  if (!stream) return
  const run = {
    join: () => (myId() < from ? sendOffer(from, stream, signal) : Promise.resolve(signal(from, { op: 'here' }))),
    here: () => sendOffer(from, stream, signal),
    offer: () => acceptOffer(from, data.sdp, stream, signal),
    answer: () => acceptAnswer(from, data.sdp),
    ice: () => addCandidate(from, data.candidate),
  }[data.op]
  run?.().catch(() => store().setPeer(from, 'failed'))
}

// Salon mis à jour : liaisons fermées avec les machines parties ; plus de salon, plus de vocal.
export function syncVoiceRoom(room) {
  if (!room) return stream ? leaveVoice() : undefined
  const members = new Set(room.members.map((member) => member.id))
  for (const id of peerIds()) if (!members.has(id)) closePeer(id)
}
