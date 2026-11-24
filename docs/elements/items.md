# Objets et cases à objets

- **Type** : système + objet 3D + composant UI
- **Fichiers** : `smkw-ui/src/config/items.js`, `smkw-ui/src/game/items/` (itemSystem, itemRules, itemBehaviors, itemEntities, itemPlacement, kartHit, botItems), `smkw-ui/src/components3d/Items/` (RaceItems, ItemInstances, itemResources), `smkw-ui/src/components/ui/hud/ItemSlot.jsx`, `itemIcons.js`
- **Phase** : 2B (premiers objets, demandés avec les cases)

## Rôle

Cases à objets sur les circuits, roulette, inventaire, 5 objets originaux, usage par les joueurs et les bots. Indépendant du rendu : la course (`game/items`) décide, la scène et le HUD lisent.

## Fonctionnement

- **Cases** : rangées en travers de la route (`ITEM_BOXES.rows`, ou `itemRows` d'un circuit), 6 par rangée. Un kart qui passe casse la case (réapparition après 1,1 s) ; il lance la roulette seulement s'il n'a rien en main.
- **Roulette** : 1,3 s ; l'objet est tiré à la prise selon la place (`ITEM_DISTRIBUTION` tête / milieu / fin, interpolé).
- **Inventaire** : un emplacement, des charges (triple nitro : 3), usage sur un nouvel appui de l'action `item`.
- **Objets** (`ITEMS`, comportement par type dans `ITEM_BEHAVIORS`) :
  - Nitro, Triple nitro (`boost`) : turbo `item` via `applyBoost` ;
  - Flaque d'huile (`trap`) : posée derrière, 45 s, tête-à-queue au premier qui roule dessus ;
  - Orbe de choc (`projectile`) : lancé devant, suit la route, frappe le premier kart rencontré ;
  - Bulle (`shield`) : absorbe le prochain coup (12 s).
- **Tête-à-queue** (`kartHit.js`) : commandes coupées 1,1 s, vitesse x0,35, drift et turbo perdus ; la bulle l'annule.
- **Bots** (`botItems.js`) : délai de réflexion, puis turbo en ligne droite, piège si quelqu'un suit de près, orbe si un adversaire est devant à portée, bulle tout de suite.
- **Pooling** : 48 flaques et 24 orbes préalloués ; rendu en 4 maillages instanciés (coques et cœurs des cases, flaques, orbes).

Ajouter un objet : une entrée dans `ITEMS` (type existant) + `items.<id>.name` dans chaque locale + une icône dans `itemIcons.js`. Nouveau type : une entrée dans `ITEM_BEHAVIORS`.

## Interface

- État du kart : `item`, `itemCharges`, `itemRoll`, `shield`, `spin`.
- `raceStore.standings[id]` : `item`, `charges`, `rolling`, `shield`.
- `render_game_to_text().race` : `itemBoxes` (actives / total), `hazards`, `projectiles` ; par kart `item`, `spin`, `shield`.
- HUD : `[data-item]` (id, `rolling` ou `none`).

## Performance

Calcul : cases x karts par pas (24 x 32), entités en réserve fixe ; course de 32 karts simulée en ~0,5 s pour 95 s. Rendu : 4 appels pour tous les objets.

## Conformité règles d'or

- [x] Aucun dégradé linéaire
- [x] Aucun emoji ; icônes lucide utiles (Rocket, Droplet, Orbit, ShieldCheck)
- [x] Tailwind uniquement
- [x] Roulette d'icônes coupée en mouvement réduit
- [x] UI / 3D séparées (raceStore, monde de course)
- [x] Noms et formes originaux (aucun objet repris d'un jeu existant)

## Évolutions prévues

Objets de bataille, rangées de cases par circuit réglées à la main, son.
