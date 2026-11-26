import { Plug, Server } from 'lucide-react'
import { useState } from 'react'
import { connectToServer } from '../../../net/lanSession'
import { useTranslation } from '../../../i18n/useTranslation'
import { useNetStore } from '../../../stores/netStore'
import { Button } from '../../ui/Button'

// Connexion au serveur de jeu du réseau local : celui qui a servi la page (application de
// bureau, ou adresse de l'hôte ouverte dans le navigateur), ou l'adresse d'un hôte (IP:port).
const STATUS_TONES = { connected: 'bg-brand-yellow text-brand-ink', connecting: 'bg-white/15 text-white', error: 'bg-brand-red text-white', idle: 'bg-white/10 text-white/70' }

export function LanServerForm() {
  const { t } = useTranslation()
  const status = useNetStore((state) => state.status)
  const error = useNetStore((state) => state.error)
  const [address, setAddress] = useState(() => useNetStore.getState().address)

  const onSubmit = (event) => {
    event.preventDefault()
    connectToServer(address)
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3 bg-brand-ink/90 p-5 text-white shadow-[8px_8px_0_0_rgb(0_0_0/0.35)]">
      <h3 className="inline-flex items-center gap-2 font-display text-xl uppercase leading-none">
        <Server aria-hidden="true" className="size-5 text-brand-yellow" strokeWidth={2.5} />
        {t('lan.server.title')}
      </h3>
      <p className="text-sm text-white/70">{t('lan.server.help')}</p>
      <label htmlFor="lan-address-input" className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/55">
        {t('lan.server.addressLabel')}
      </label>
      <div className="flex flex-wrap gap-2">
        <input
          id="lan-address-input"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder={t('lan.server.placeholder')}
          autoComplete="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-black/45 px-4 py-3 font-mono text-base text-white outline-none ring-2 ring-white/10 transition focus:ring-brand-yellow placeholder:text-white/25"
        />
        <Button id="lan-connect-btn" type="submit" size="md" icon={Plug}>
          {t('lan.server.connect')}
        </Button>
      </div>
      <p id="lan-status" data-status={status} className={`self-start px-2 py-1 text-xs font-bold uppercase tracking-widest ${STATUS_TONES[status]}`}>
        {t(`lan.status.${status}`)}
        {error ? ` · ${t(`lan.errors.${error}`)}` : ''}
      </p>
    </form>
  )
}
