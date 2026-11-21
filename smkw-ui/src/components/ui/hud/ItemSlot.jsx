import { Package } from 'lucide-react'
import { useTranslation } from '../../../i18n/useTranslation'

// Emplacement d'objet vide (le système d'objets arrive dans une phase ultérieure).
// Tailles par requêtes de conteneur : il suit la taille de la case du joueur (écran partagé).
export function ItemSlot() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex size-11 -skew-x-12 items-center justify-center border-2 border-dashed border-white/40 bg-brand-ink/75 @md:size-16 @3xl:size-20">
        <Package aria-hidden="true" className="size-5 skew-x-12 text-white/40 @md:size-7" strokeWidth={2} />
        <span className="sr-only">{t('hud.noItem')}</span>
      </div>
      <span className="hidden text-[10px] font-bold uppercase tracking-[0.25em] text-white/70 @md:inline">{t('hud.item')}</span>
    </div>
  )
}
