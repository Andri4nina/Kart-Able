import { LogIn, Plus, RefreshCw, Users } from 'lucide-react'
import { useState } from 'react'
import { normalizeRoomCode } from '../../../game/matchRules'
import { createRoom, joinRoom, refreshRooms } from '../../../net/lanSession'
import { useTranslation } from '../../../i18n/useTranslation'
import { useNetStore } from '../../../stores/netStore'
import { Button } from '../../ui/Button'

// Salons du serveur : en créer un (cette machine devient l'hôte), rejoindre un salon de la
// liste, ou par son code.
function RoomRow({ room }) {
  const { t } = useTranslation()
  return (
    <li className="flex items-center gap-3 border-t border-white/10 pt-2" data-room={room.code}>
      <span className="font-display text-lg tracking-widest text-brand-yellow">{room.code}</span>
      <span className="min-w-0 flex-1 truncate text-sm">
        {room.hostName} · {t(`modes.${room.modeId}.name`)}
      </span>
      <span className="inline-flex items-center gap-1 text-xs font-bold text-white/60">
        <Users aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
        {room.members}
      </span>
      <Button size="md" variant="secondary" icon={LogIn} disabled={room.phase !== 'lobby'} onClick={() => joinRoom(room.code)}>
        {t('lan.rooms.join')}
      </Button>
    </li>
  )
}

export function LanRooms() {
  const { t } = useTranslation()
  const rooms = useNetStore((state) => state.rooms)
  const connected = useNetStore((state) => state.status === 'connected')
  const [code, setCode] = useState('')

  const onJoin = (event) => {
    event.preventDefault()
    if (code) joinRoom(code)
  }

  return (
    <section aria-label={t('lan.rooms.title')} className={`flex flex-col gap-3 bg-brand-ink/90 p-5 text-white shadow-[8px_8px_0_0_rgb(0_0_0/0.35)] ${connected ? '' : 'opacity-50'}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-xl uppercase leading-none">{t('lan.rooms.title')}</h3>
        <div className="flex gap-2">
          <Button id="lan-refresh-btn" size="md" variant="secondary" icon={RefreshCw} disabled={!connected} onClick={refreshRooms}>
            {t('lan.rooms.refresh')}
          </Button>
          <Button id="lan-create-btn" size="md" icon={Plus} disabled={!connected} onClick={createRoom}>
            {t('lan.rooms.create')}
          </Button>
        </div>
      </div>
      {rooms.length ? (
        <ul className="scrollbar-game flex max-h-56 flex-col gap-2 overflow-y-auto">
          {rooms.map((room) => (
            <RoomRow key={room.code} room={room} />
          ))}
        </ul>
      ) : (
        <p className="text-sm text-white/60">{t('lan.rooms.empty')}</p>
      )}
      <form onSubmit={onJoin} className="flex gap-2">
        <input
          id="room-code-input"
          value={code}
          onChange={(event) => setCode(normalizeRoomCode(event.target.value))}
          placeholder={t('online.join.placeholder')}
          aria-label={t('online.join.codeLabel')}
          autoComplete="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-black/45 px-4 py-2 font-display text-lg uppercase tracking-[0.3em] text-white outline-none ring-2 ring-white/10 focus:ring-brand-yellow placeholder:text-white/20"
        />
        <Button id="join-submit-btn" type="submit" size="md" icon={LogIn} disabled={!connected || !code}>
          {t('online.join.submit')}
        </Button>
      </form>
    </section>
  )
}
