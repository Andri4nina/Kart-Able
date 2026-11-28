import { Mic, MicOff } from 'lucide-react'
import { useTranslation } from '../../../i18n/useTranslation'
import { toggleMute } from '../../../net/voiceChat'
import { useVoiceStore } from '../../../stores/voiceStore'
import { IconButton } from '../IconButton'

// En course, si le chat vocal est actif : couper / rétablir son micro (net/voiceChat.js).
export function VoiceToggle() {
  const { t } = useTranslation()
  const on = useVoiceStore((state) => state.status === 'on')
  const muted = useVoiceStore((state) => state.muted)
  if (!on) return null
  return <IconButton id="hud-voice-btn" icon={muted ? MicOff : Mic} label={t(muted ? 'voice.unmute' : 'voice.mute')} onClick={toggleMute} className={muted ? 'bg-brand-red' : ''} />
}
