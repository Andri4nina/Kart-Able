import { VOICE } from '../config/network'
import { useVoiceStore } from '../stores/voiceStore'

// Liaisons audio du chat vocal, une par machine distante (WebRTC). `signal(to, payload)` envoie
// un message de négociation à une machine (relayé par le serveur). Le son reçu est joué par un
// élément audio caché ; `setDeafened` le coupe sans fermer la liaison.
const peers = new Map()
let deafened = false

const store = () => useVoiceStore.getState()

function stateOf(connection) {
  if (connection.connectionState === 'connected') return 'connected'
  if (connection.connectionState === 'failed' || connection.connectionState === 'closed') return 'failed'
  return 'connecting'
}

function openPeer(id, stream, signal) {
  closePeer(id)
  const connection = new RTCPeerConnection({ iceServers: VOICE.iceServers })
  const audio = new Audio()
  audio.autoplay = true
  audio.muted = deafened
  for (const track of stream.getTracks()) connection.addTrack(track, stream)
  connection.onicecandidate = (event) => event.candidate && signal(id, { op: 'ice', candidate: event.candidate.toJSON() })
  connection.ontrack = (event) => {
    audio.srcObject = event.streams[0]
    audio.play().catch(() => {})
  }
  connection.onconnectionstatechange = () => peers.get(id)?.connection === connection && store().setPeer(id, stateOf(connection))
  peers.set(id, { connection, audio })
  store().setPeer(id, 'connecting')
  return connection
}

export async function sendOffer(id, stream, signal) {
  const connection = openPeer(id, stream, signal)
  await connection.setLocalDescription(await connection.createOffer())
  signal(id, { op: 'offer', sdp: connection.localDescription.toJSON() })
}

export async function acceptOffer(id, sdp, stream, signal) {
  const connection = openPeer(id, stream, signal)
  await connection.setRemoteDescription(sdp)
  await connection.setLocalDescription(await connection.createAnswer())
  signal(id, { op: 'answer', sdp: connection.localDescription.toJSON() })
}

export async function acceptAnswer(id, sdp) {
  const peer = peers.get(id)
  if (peer && peer.connection.signalingState === 'have-local-offer') await peer.connection.setRemoteDescription(sdp)
}

export async function addCandidate(id, candidate) {
  const peer = peers.get(id)
  if (peer?.connection.remoteDescription) await peer.connection.addIceCandidate(candidate).catch(() => {})
}

export function closePeer(id) {
  const peer = peers.get(id)
  if (!peer) return
  peer.connection.close()
  peer.audio.srcObject = null
  peers.delete(id)
  store().removePeer(id)
}

export const closeAllPeers = () => [...peers.keys()].forEach(closePeer)
export const peerIds = () => [...peers.keys()]

export function setDeafened(value) {
  deafened = value
  for (const { audio } of peers.values()) audio.muted = value
}
