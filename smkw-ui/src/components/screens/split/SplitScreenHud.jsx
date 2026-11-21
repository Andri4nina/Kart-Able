import { Map as MapIcon } from 'lucide-react'
import { getCellCount, getSplitGrid, getSplitGridKey } from '../../../config/splitScreen'
import { useTranslation } from '../../../i18n/useTranslation'
import { PlayerViewportHud } from './PlayerViewportHud'

// Grille CSS identique au découpage de la scène (config/splitScreen.js), par clé de grille
// paysage ; en portrait, une grille plus large que haute est retournée (variante portrait:).
const GRID_CLASSES = {
  '1x1': 'grid-cols-1 grid-rows-1',
  '1x2': 'grid-cols-1 grid-rows-2',
  '2x2': 'grid-cols-2 grid-rows-2',
  '3x2': 'grid-cols-3 grid-rows-2 portrait:grid-cols-2 portrait:grid-rows-3',
  '4x2': 'grid-cols-4 grid-rows-2 portrait:grid-cols-2 portrait:grid-rows-4',
}

// Case sans joueur (ex. 3 joueurs en 2x2) : la scène y montre une vue d'ensemble.
function OverviewCell() {
  const { t } = useTranslation()
  return (
    <div className="relative min-h-0 min-w-0 overflow-hidden border-2 border-brand-ink">
      <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 bg-brand-ink/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-white/75">
        <MapIcon aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
        {t('hud.overview')}
      </span>
    </div>
  )
}

// Écran partagé : une case par joueur local (ordre de la partie = case = place sur la grille).
export function SplitScreenHud({ players }) {
  const grid = getSplitGrid(players.length)
  const cells = Array.from({ length: getCellCount(grid) }, (_, order) => players[order] ?? null)
  const framed = players.length > 1

  return (
    <div className={`absolute inset-0 grid ${GRID_CLASSES[getSplitGridKey(players.length)]}`}>
      {cells.map((player, order) =>
        player ? (
          <PlayerViewportHud key={player.id} player={player} position={order + 1} total={players.length} framed={framed} />
        ) : (
          <OverviewCell key={`overview-${order}`} />
        ),
      )}
    </div>
  )
}
