# Objets et cases à objets

- **Type** : système + objet 3D + composant UI
- **Fichiers** : `smkw-ui/src/config/items.js`, `smkw-ui/src/game/items/` (itemSystem, itemRules, itemBehaviors, itemEntities, itemPlacement, kartHit, botItems), `smkw-ui/src/components3d/Items/` (RaceItems, ItemInstances, itemResources, boxPose), `smkw-ui/src/components3d/Effects/boxEmitters.js`, `smkw-ui/src/components/ui/hud/ItemSlot.jsx`, `useItemRoulette.js`, `itemIcons.js`
- **Phase** : 2B (premiers objets, demandés avec les cases), cases et tirage revus en 2C

## Rôle

Cases à objets sur les circuits, roulette, inventaire, 5 objets originaux, usage par les joueurs et les bots. Indépendant du rendu : la course (`game/items`) décide, la scène et le HUD lisent.

## Fonctionnement

- **Cases** : rangées en travers de la route (`ITEM_BOXES.rows`, ou `itemRows` d'un circuit), 6 par rangée. Un kart qui passe casse la case (gerbe d'éclats, réapparition après 1,1 s) ; il lance la roulette seulement s'il n'a rien en main. Rendu : cristal à facettes translucide dont la teinte change lentement, cœur lumineux en étoile, anneau en orbite, halo au sol (4 maillages instanciés, couleur par instance).
- **Case dorée** (hasard) : à chaque réapparition, une case a `luckyChance` (12 %) de devenir dorée (plus grosse, or). Elle tire dans `ITEM_DISTRIBUTION.lucky` quelle que soit la place, et sa roulette dure `luckyRoulette` de plus ; le HUD l'annonce (cadre doré, étincelle).
- **Roulette à suspense** : durée tirée au hasard (`roulette.min` .. `max`, 1,1 à 2,3 s) ; l'objet est tiré à la prise selon la place (`ITEM_DISTRIBUTION` tête / milieu / fin, interpolé). Dans le HUD, les icônes défilent dans un ordre aléatoire puis ralentissent jusqu'à la fin du tirage (`useItemRoulette`) ; l'objet apparaît avec un rebond et un éclair.
- **Inventaire** : un emplacement, des charges (triple nitro : 3), usage sur un nouvel appui de l'action `item`.
- **Objets** (`ITEMS`, comportement par type dans `ITEM_BEHAVIORS`) :
  - Nitro, Triple nitro (`boost`) : turbo `item` via `applyBoost` ;
  - Flaque d'huile (`trap`) : posée derrière, 45 s, tête-à-queue au premier qui roule dessus ;
  - Orbe de choc (`projectile`) : lancé devant, suit la route, frappe le premier kart rencontré ;
  - Bulle (`shield`) : absorbe le prochain coup (12 s).
- **Tête-à-queue** (`kartHit.js`) : commandes coupées 1,1 s, vitesse x0,35, drift et turbo perdus ; la bulle l'annule.
- **Bots** (`botItems.js`) : délai de réflexion, puis turbo en ligne droite, piège si quelqu'un suit de près, orbe si un adversaire est devant à portée, bulle tout de suite.
- **Pooling** : 48 flaques et 24 orbes préalloués ; rendu en 6 maillages instanciés (cristal, cœur, anneau, halo des cases ; flaques ; orbes).

Ajouter un objet : une entrée dans `ITEMS` (type existant) + `items.<id>.name` dans chaque locale + une icône dans `itemIcons.js`. Nouveau type : une entrée dans `ITEM_BEHAVIORS`.

## Interface

- État du kart : `item`, `itemCharges`, `itemRoll`, `itemRollTotal`, `itemLucky`, `shield`, `spin`.
- `raceStore.standings[id]` : `item`, `charges`, `rolling`, `rollTime`, `lucky`, `shield`.
- `render_game_to_text().race` : `itemBoxes` (actives / total), `luckyBoxes`, `hazards`, `projectiles` ; par kart `item`, `spin`, `shield`.
- HUD : `[data-item]` (id, `rolling` ou `none`), `[data-lucky]`.

## Performance

Calcul : cases x karts par pas (24 x 32), entités en réserve fixe ; course de 32 karts simulée en ~0,5 s pour 95 s. Rendu : 6 appels pour tous les objets ; éclats des cases dans la couche de particules commune.

## Conformité règles d'or

- [x] Aucun dégradé linéaire
- [x] Aucun emoji ; icônes lucide utiles (Rocket, Droplet, Orbit, ShieldCheck ; Sparkles pour la case dorée)
- [x] Tailwind uniquement
- [x] Roulette d'icônes, rebond et éclair coupés en mouvement réduit (MotionConfig)
- [x] UI / 3D séparées (raceStore, monde de course)
- [x] Noms et formes originaux (aucun objet repris d'un jeu existant ; case en cristal, pas de cube à point d'interrogation)

## Évolutions prévues

Objets de bataille, rangées de cases par circuit réglées à la main, son.

## Case à objets (2E)

Nouveau design : cube de verre irisé aux coins arrondis, penché sur un coin et qui tourne, arêtes lumineuses plus claires, point d'interrogation en volume qui flotte au centre, halo au sol. Case dorée : or et blanc, plus grosse. Fichiers : `components3d/Items/itemResources.js`, `boxPose.js`, `RaceItems.jsx`.
