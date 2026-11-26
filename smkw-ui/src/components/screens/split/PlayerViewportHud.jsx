import { motion } from 'motion/react'
import { hudFrom } from '../../../animations/variants'
import { useTranslation } from '../../../i18n/useTranslation'
import { useRaceStore } from '../../../stores/raceStore'
import { CharacterAvatar } from '../../players/CharacterAvatar'
import { getPlayerColors } from '../../players/playerVisuals'
import { DraftGauge } from '../../ui/hud/DraftGauge'
import { DriftGauge } from '../../ui/hud/DriftGauge'
import { FinishBanner } from '../../ui/hud/FinishBanner'
import { ItemSlot } from '../../ui/hud/ItemSlot'
import { LapPanel } from '../../ui/hud/LapPanel'
import { PositionBadge } from '../../ui/hud/PositionBadge'
import { RaceCallout } from '../../ui/hud/RaceCallout'
import { RaceMinimap } from '../../ui/hud/RaceMinimap'
import { Speedometer } from '../../ui/hud/Speedometer'

// Étiquette du joueur : numéro sur sa couleur, puis visage et nom du personnage
// (masqués dans les cases étroites pour laisser la place aux actions communes).
function PlayerTag({ player, colors }) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-2">
      <span className={`-skew-x-12 px-2.5 py-1 shadow-[4px_4px_0_0_rgb(0_0_0/0.3)] ${colors.bg}`}>
        <span className="inline-block skew-x-12 font-display text-lg leading-none text-brand-ink @md:text-2xl">{player.id}</span>
      </span>
      {player.characterId ? (
        <span className="hidden min-w-0 items-center gap-2 bg-brand-ink/80 py-0.5 pl-0.5 pr-2.5 @xs:flex">
          <CharacterAvatar characterId={player.characterId} size="sm" className="hidden @md:flex" />
          <span className="truncate text-[11px] font-bold uppercase tracking-widest text-white @md:text-sm">
            {t(`characters.${player.characterId}.name`)}
          </span>
        </span>
      ) : null}
    </div>
  )
}

// Case d'un joueur en écran partagé : la vue 3D est rendue en dessous par la scène
// (même découpage, config/splitScreen.js) ; ici le cadre à sa couleur et son HUD.
// La case est un conteneur (largeur et hauteur) : le HUD suit sa taille (@md..., cell-short:...).
// `framed` : séparation et cadre seulement à plusieurs joueurs. Position réelle en course
// (raceStore), sinon l'ordre de la grille.
export function PlayerViewportHud({ player, position, total, framed }) {
  const { t } = useTranslation()
  const racePosition = useRaceStore((state) => state.standings[player.id]?.position ?? position)
  const raceTotal = useRaceStore((state) => state.total || total)
  const colors = getPlayerColors(player.index)
  const frame = framed ? `border-2 border-brand-ink ring-[3px] ring-inset ${colors.ring}` : ''

  return (
    <section
      aria-label={t('hud.playerView', { player: player.id })}
      data-player={player.id}
      className={`relative min-h-0 min-w-0 overflow-hidden [container-type:size] ${frame}`}
    >
      <FinishBanner playerId={player.id} />
      <RaceCallout playerId={player.id} />
      <div className="absolute inset-0 flex flex-col justify-between gap-2 p-2.5 @md:p-4 @3xl:p-6">
        <motion.div variants={hudFrom.left} className="flex flex-col items-start gap-2">
          <PlayerTag player={player} colors={colors} />
          <div className="cell-short:hidden">
            <div className="hidden @3xs:block">
              <ItemSlot playerId={player.id} />
            </div>
          </div>
          <DriftGauge playerId={player.id} />
          <DraftGauge playerId={player.id} />
        </motion.div>

        <div className="flex items-end justify-between gap-2">
          <motion.div variants={hudFrom.left} className="flex items-end gap-3">
            <div className="cell-low:hidden">
              <div className="hidden @3xl:block">
                <Speedometer playerId={player.id} />
              </div>
            </div>
            <div className="hidden @3xs:block">
              <LapPanel playerId={player.id} />
            </div>
          </motion.div>
          <motion.div variants={hudFrom.right} className="flex flex-col items-end gap-2">
            <div className="hidden @xs:block cell-short:hidden">
              <RaceMinimap playerId={player.id} />
            </div>
            <PositionBadge position={racePosition} total={raceTotal} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
