import { Globe } from 'lucide-react'
import { ONLINE_SERVER_URL } from '../../../config/network'
import { useTranslation } from '../../../i18n/useTranslation'
import { connectToServer } from '../../../net/lanSession'
import { useNetStore } from '../../../stores/netStore'
import { Button } from '../../ui/Button'

// Jeu sur Internet : connexion au serveur en ligne de cette version (config/network.js). Les
// salons y sont privés : on crée le sien et on donne son code à ses amis.
export function OnlineServerCard() {
  const { t } = useTranslation()
  const online = useNetStore((state) => state.online && state.status === 'connected')
  const connecting = useNetStore((state) => state.online && state.status === 'connecting')

  return (
    <section aria-label={t('lan.internet.title')} data-net="internet" className="flex flex-col gap-3 bg-brand-ink/90 p-5 text-white shadow-[8px_8px_0_0_rgb(0_0_0/0.35)]">
      <h3 className="inline-flex items-center gap-2 font-display text-xl uppercase leading-none">
        <Globe aria-hidden="true" className="size-5 text-brand-yellow" strokeWidth={2.5} />
        {t('lan.internet.title')}
      </h3>
      <p className="text-sm text-white/70">{t('lan.internet.help')}</p>
      {ONLINE_SERVER_URL ? (
        <Button
          id="online-connect-btn"
          size="md"
          icon={Globe}
          className="self-start"
          disabled={online || connecting}
          onClick={() => connectToServer(ONLINE_SERVER_URL, { online: true })}
        >
          {t(online ? 'lan.internet.connected' : 'lan.internet.connect')}
        </Button>
      ) : (
        <p className="text-sm text-white/55">{t('lan.internet.missing')}</p>
      )}
    </section>
  )
}
