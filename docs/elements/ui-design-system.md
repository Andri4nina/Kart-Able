# Design system UI

- **Type** : composants UI
- **Fichiers** : `src/index.css`, `src/components/ui/Button.jsx`, `IconButton.jsx`, `Logo.jsx`, `KeyHint.jsx`, `SegmentedControl.jsx`, `SettingRow.jsx`
- **Phase** : 1

## Rôle

Vocabulaire visuel commun : esthétique course arcade, parallélogrammes (`-skew-x-12` + contenu redressé `skew-x-12`), ombres portées pleines, typographie display.

## Tokens (`@theme` dans index.css)

| Token | Valeur | Usage |
| --- | --- | --- |
| `brand-red` | `#e63946` | Action principale, sélection, accent |
| `brand-yellow` | `#ffc93c` | Ombre portée des CTA, labels d'accent, focus |
| `brand-ink` | `#14161c` | Panneaux, texte sur jaune |
| `brand-sky` | `#8ccff2` | Fond avant montage du Canvas |
| `brand-orange` | `#ff7a1a` | Accent du mode Bataille |
| `brand-blue` | `#2f80ed` | Accent du mode Rocket Gol |
| `player-1` à `player-8` | rouge, bleu, jaune, vert, orange, violet, rose, turquoise | Couleur de chaque joueur local |
| `font-display` | Bungee | Titres, boutons, chiffres du HUD |
| `font-sans` | Chakra Petch | Texte courant, labels |

Variante `motion-ok:` : n'applique un transform que si le mouvement n'est pas réduit (attribut `data-reduced-motion` posé par App).

Variantes `cell-short:` (hauteur < 15rem) et `cell-low:` (hauteur < 24rem) : requêtes de conteneur sur la **hauteur** d'une case d'écran partagé (`[container-type:size]`), les variantes `@md`... de Tailwind ne portant que sur la largeur (voir [split-screen.md](split-screen.md)).

Tokens d'archétypes : `class-tank` (bleu), `class-standard` (vert), `class-speed` (rouge), `class-special` (violet).

## Barre de défilement `scrollbar-game`

Utilitaire Tailwind (`@utility` dans index.css) pour toutes les zones qui défilent, notamment en responsive :
- piste sombre translucide avec un filet clair ;
- curseur rouge de marque, carré, en retrait (bordure transparente), jaune au survol et à l'appui, 48 px minimum ;
- pas de flèches, défilement contenu (`overscroll-behavior: contain`) ;
- Firefox : `scrollbar-width: thin` + couleurs équivalentes (dans `@supports`, pour ne pas désactiver les pseudo-éléments WebKit ailleurs).

Utilisé par `MenuPage` (contenu des écrans du parcours) et `SettingsDialog` (panneau d'onglet).

## Composants

| Composant | Props clés | Notes |
| --- | --- | --- |
| `Button` | `variant` (primary/secondary), `size` (lg/md), `icon`, `showArrow` | Hover : montée + scale + ombre qui s'allonge ; active : enfoncement. |
| `IconButton` | `icon`, `label` (obligatoire) | `aria-label` + `title`. |
| `Logo` | — | Nom et tagline depuis `BRAND` (config). Double ombre texte pleine. |
| `KeyHint` | `keys`, `label` | Uniquement sur le menu, pas pendant le jeu. |
| `SegmentedControl` | `label`, `options`, `value`, `onChange` | Boutons `aria-pressed`. |
| `SettingRow` | `icon`, `label`, `htmlFor`, `value`, `hint` | |

## Icônes

`lucide-react` (tree-shaké, seules les icônes importées sont bundlées). Icônes utilisées : Play, Settings, ChevronRight, Flag, Timer, Gauge, Package, LogOut, Info, X, Check, MonitorCog, Wind, Scan.

## Performance

Pas de `backdrop-blur` au-dessus du Canvas (coûteux sur GPU) : panneaux en couleur pleine avec opacité.

## Conformité règles d'or

- [x] Aucun dégradé linéaire (ombres et couleurs pleines)
- [x] Aucun emoji ; icônes lucide-react porteuses de sens
- [x] Tailwind uniquement ; un seul fichier CSS (tokens + variante)
- [x] Micro-interactions Tailwind, transforms derrière `motion-ok:`
- [x] Aucun import de `components3d/`
- [x] Rien d'une phase suivante

## Évolutions prévues

Composants de classement, compte à rebours, minimap (phases course).
