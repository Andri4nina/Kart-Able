import { Network } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect } from 'react'
import { pageItem, pageList } from '../../animations/variants'
import { PLAY_TYPES } from '../../config/gameModes'
import { getGameMode, getPlayerLimit } from '../../game/matchRules'
import { useTranslation } from '../../i18n/useTranslation'
import { connectToServer, leaveRoom } from '../../net/lanSession'
import { SCREENS } from '../../navigation/screens'
import { useMatchSetupStore } from '../../stores/matchSetupStore'
import { useNavigationStore } from '../../stores/navigationStore'
import { useNetStore } from '../../stores/netStore'
import { CapacityBanner, Notice } from './CapacityBanner'
import { LanRooms } from './lan/LanRooms'
import { LanServerForm } from './lan/LanServerForm'
import { MenuPage } from './MenuPage'

// Étape « connexion » du réseau local (LAN) : se connecter au serveur de jeu (application de
// bureau Kart Able de l'hôte, ou smkw-api), puis créer ou rejoindre un salon. Une fois dans un
// salon : les joueurs de cette machine rejoignent et choisissent comme en local.
export function OnlineMultiplayer() {
  const { t } = useTranslation()
  const modeId = useMatchSetupStore((state) => state.modeId)
  const roomCode = useNetStore((state) => state.room?.code ?? null)
  const status = useNetStore((state) => state.status)
  const limit = getPlayerLimit(getGameMode(modeId), PLAY_TYPES.ONLINE)

  // Première visite : essai automatique du serveur qui a servi la page. Retour sur cet écran
  // depuis un salon : on le quitte (choisir un autre salon).
  useEffect(() => {
    const net = useNetStore.getState()
    if (net.status === 'idle') connectToServer('')
    else if (net.room) leaveRoom()
  }, [])

  // Salon rejoint : on passe aux joueurs de cette machine.
  useEffect(() => {
    if (!roomCode) return
    useNavigationStore.getState().navigate(SCREENS.LOCAL_SETUP)
  }, [roomCode])

  return (
    <MenuPage step="connection" title={t('lan.title')} subtitle={t('lan.subtitle')}>
      <motion.div variants={pageItem} className="mb-6 flex flex-col items-start gap-4">
        <CapacityBanner icon={Network} label={t('players.upTo', { count: limit })} />
        {status !== 'connected' ? <Notice icon={Network}>{t('lan.howTo')}</Notice> : null}
      </motion.div>
      <motion.div variants={pageList} className="grid max-w-6xl gap-5 lg:grid-cols-2">
        <motion.div variants={pageItem}>
          <LanServerForm />
        </motion.div>
        <motion.div variants={pageItem}>
          <LanRooms />
        </motion.div>
      </motion.div>
    </MenuPage>
  )
}
