import { Headphones, HeadphoneOff, Mic, MicOff, PhoneOff, RefreshCw } from 'lucide-react'
import { motion } from 'motion/react'
import { pageItem } from '../../../animations/variants'
import { useTranslation } from '../../../i18n/useTranslation'
import { joinVoice, leaveVoice, reconnectVoice, toggleDeafen, toggleMute } from '../../../net/voiceChat'
import { useNetStore } from '../../../stores/netStore'
import { useVoiceStore } from '../../../stores/voiceStore'
import { Button } from '../../ui/Button'
import { IconButton } from '../../ui/IconButton'

const PEER_DOT = { connecting: 'bg-brand-yellow', connected: 'bg-emerald-400', failed: 'bg-brand-red' }

// Chat vocal du salon (net/voiceChat.js) : activer le micro, le couper, couper le son des
// autres, se reconnecter ou quitter le vocal. Liste des machines en vocal avec leur état.
export function VoicePanel() {
  const { t } = useTranslation()
  const voice = useVoiceStore()
  const members = useNetStore((state) => state.room?.members ?? [])
  const active = voice.status === 'on' || voice.status === 'connecting'
  const peers = members.filter((member) => voice.peers[member.id])

  return (
    <motion.section variants={pageItem} id="voice-panel" data-status={voice.status} className="flex flex-col gap-3 bg-brand-ink/90 p-5 text-white shadow-[8px_8px_0_0_rgb(0_0_0/0.35)]">
      <div className="flex items-center justify-between gap-3">
        <h3 className="inline-flex items-center gap-2 font-display text-xl uppercase leading-none">
          <Mic aria-hidden="true" className="size-5 text-brand-yellow" strokeWidth={2.5} />
          {t('voice.title')}
        </h3>
        <span className="text-[11px] font-bold uppercase tracking-widest text-white/60">{t(`voice.status.${voice.status}`)}</span>
      </div>
      {voice.error ? <p className="text-sm text-brand-yellow">{t(`voice.errors.${voice.error}`)}</p> : null}
      {active ? (
        <div className="flex flex-wrap gap-2">
          <IconButton id="voice-mute-btn" icon={voice.muted ? MicOff : Mic} label={t(voice.muted ? 'voice.unmute' : 'voice.mute')} onClick={toggleMute} className={voice.muted ? 'bg-brand-red' : ''} />
          <IconButton id="voice-deafen-btn" icon={voice.deafened ? HeadphoneOff : Headphones} label={t(voice.deafened ? 'voice.undeafen' : 'voice.deafen')} onClick={toggleDeafen} className={voice.deafened ? 'bg-brand-red' : ''} />
          <IconButton id="voice-reconnect-btn" icon={RefreshCw} label={t('voice.reconnect')} onClick={reconnectVoice} />
          <IconButton id="voice-leave-btn" icon={PhoneOff} label={t('voice.leave')} onClick={leaveVoice} />
        </div>
      ) : (
        <Button id="voice-join-btn" variant="secondary" size="md" icon={Mic} onClick={joinVoice}>
          {t('voice.join')}
        </Button>
      )}
      {active ? (
        <ul className="flex flex-col gap-1 text-sm">
          {peers.length ? null : <li className="text-white/60">{t('voice.alone')}</li>}
          {peers.map((member) => (
            <li key={member.id} className="flex items-center gap-2">
              <span aria-hidden="true" className={`size-2.5 rounded-full ${PEER_DOT[voice.peers[member.id]]}`} />
              <span className="truncate">{member.name}</span>
              <span className="ml-auto text-[11px] uppercase tracking-widest text-white/50">{t(`voice.peer.${voice.peers[member.id]}`)}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </motion.section>
  )
}
