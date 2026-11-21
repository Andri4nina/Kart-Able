# Règles d'or — Kart Able

Ces règles s'appliquent à **tout** le projet (smkw-ui, smkw-api, docs), à chaque phase.
Elles priment sur toute autre préférence. Vérification automatique : `npm run check` dans `smkw-ui/` (oxlint + `check:rules` + `check:i18n`).

---

## 1. Interdits visuels absolus

| Règle | Détail | Alternative |
| --- | --- | --- |
| **Aucun dégradé linéaire** | Ni `linear-gradient()`, ni `repeating-linear-gradient()`, ni classes Tailwind `bg-linear-*` / `bg-gradient-*`, ni `<linearGradient>` SVG. | Couleurs pleines, opacité (`bg-brand-ink/85`), ombres portées pleines (`shadow-[6px_6px_0_0_...]`). |
| **Aucun emoji** | Nulle part : UI, textes, code, commentaires, docs, commits. | Icônes **lucide-react** (`import { Flag } from 'lucide-react'`). |
| **Icônes uniquement si utiles** | Une icône doit porter du sens (action, catégorie, état). Pas de décoration gratuite. | Icône + `aria-hidden="true"` si un texte l'accompagne ; sinon `aria-label` sur le bouton. |

## 2. Styling

- **Tailwind CSS uniquement**, classes directement dans les composants React.
- Interdits : CSS Modules, styled-components, Emotion, Sass, fichiers CSS de composants, autre framework CSS.
- Un seul fichier CSS : `smkw-ui/src/index.css`, limité à `@import "tailwindcss"`, `@theme` (tokens), `@custom-variant` et `@utility`. `@utility` est réservé à ce que les classes ne peuvent pas exprimer (aujourd'hui : `scrollbar-game`, les pseudo-éléments de barre de défilement) et s'utilise ensuite comme une classe Tailwind.
- Toute zone qui défile utilise `scrollbar-game` (barre aux couleurs du jeu), jamais la barre native.
- Styles inline : **seulement** par nécessité technique (valeur dynamique haute fréquence écrite via ref, ex. barre de vitesse). Toujours commenter pourquoi.
- Couleurs de marque via tokens : `brand-red`, `brand-yellow`, `brand-ink`, `brand-sky`. Pas de couleurs hexadécimales en dur dans les classes.

## 3. Animations (par ordre de priorité)

1. **Tailwind** pour les micro-interactions : `transition`, `duration-*`, `ease-*`, hover, active, scale, translate, opacity.
2. **Motion** (`motion/react`) pour : apparitions, transitions d'écran, séquences décalées, menus, HUD.
3. **`useFrame` (R3F)** pour les animations 3D simples : rotation, flottement, mouvement, caméra.

- Ne jamais animer un objet 3D avec Motion si `useFrame` suffit.
- Interdits : GSAP, React Spring, Anime.js, toute autre lib d'animation (GSAP seulement si un vrai besoin apparaît, après validation).
- Animations **courtes** (0,18 s à 0,5 s ; 0,7 s max pour le wipe d'écran).
- **Mouvement réduit respecté partout** : une seule source de vérité, `useReducedMotion()` (préférence système + réglage joueur).
  - UI Tailwind : préfixer les transforms par `motion-ok:`.
  - Motion : `MotionConfig reducedMotion` piloté par App.
  - 3D : pose fixe / caméra sans lissage quand le mouvement est réduit.

## 4. Performance

À éviter : post-processing lourd, bloom, grandes textures, modèles lourds, ombres complexes (shadow maps), centaines d'objets animés, re-renders React inutiles, animations permanentes coûteuses, `backdrop-blur` plein écran au-dessus du Canvas.

À faire :
- Valeurs haute fréquence (chrono, vitesse) : store `telemetryStore` + abonnement transitoire (`useTelemetryListener`), jamais un `useState` mis à jour par frame.
- Dans `useFrame` : lire les stores via `getState()`, réutiliser les vecteurs (aucune allocation par frame).
- Géométries / matériaux partagés au niveau module.
- Pixel ratio plafonné par le preset de qualité.
- Préparer sans implémenter prématurément : GLB/GLTF, Draco, KTX2, instancing, LOD, object pooling.

## 5. Architecture

- Séparation stricte : **UI React** (`components/`) / **navigation** (`navigation/`, `navigationStore`) / **configuration de jeu** (`config/gameModes.js`, `game/matchRules.js`, `matchSetupStore`) / **systèmes de jeu** (`game/session.js`, `sessionStore`, puis phase 2+) / **scène 3D** (`components3d/`, `scenes/`).
- Les modes de jeu sont définis **une seule fois** dans `config/gameModes.js`. Aucun composant ne liste les modes en dur.
- Les archétypes et personnages sont définis **une seule fois** dans `config/characters.js`. Aucune statistique dans les composants.
- **Aucun écran ne lit une touche ou un bouton physique** : tout passe par la couche d'entrée (`src/input/`), qui produit des actions abstraites (`start`, `confirm`, `back`, directions). Ne jamais supposer que le clavier est le périphérique utilisé.
- Pas de bouton « Ajouter un joueur » : un joueur local rejoint uniquement en appuyant sur START avec son périphérique.
- `components/` n'importe jamais `components3d/` et inversement. Ils communiquent **uniquement via les stores**.
- Composants petits et ciblés, pas de composant monolithique : **environ 100 lignes maximum par fichier**. Un fichier existant plus long est découpé quand on le modifie pour une fonctionnalité (pas de refactorisation globale). `npm run check:rules` liste les fichiers concernés, à titre indicatif.
- Clean Architecture : données (`config/`), règles pures (`game/*Rules.js`), état (`stores/`), contrôleurs (`game/`), UI (`components/`), scène (`components3d/`, `scenes/`). Une validation métier vit dans les règles et le store, jamais seulement dans l'UI.
- Réutiliser avant de créer : étendre un système existant plutôt que d'en dupliquer un. Un seul Canvas, une seule scène.
- `useFrame` uniquement pour ce qui change réellement à chaque frame (animation continue). Sinon : sélecteurs Zustand ou événements.
- Aucune dépendance inutile. Toute nouvelle dépendance doit être justifiée dans la doc de l'élément.

## 6. Textes et langues (i18n)

- **Aucun texte d'interface écrit en dur** dans un composant (contenu, `aria-label`, `title`, `placeholder`...). Tout passe par `t('cle')` (`src/i18n/useTranslation.js`).
- Les textes vivent dans `smkw-ui/src/locales/<code>.json`. **`fr.json` est la référence** : toute nouvelle clé y est ajoutée d'abord, puis dans chaque langue.
- Langues actuelles : français, English, Malagasy. Ajouter une langue = ajouter un fichier JSON avec `_meta.name` (nom natif), rien d'autre.
- Pluriels et ordinaux via objets `{ "one": ..., "other": ... }` (Intl.PluralRules), jamais de concaténation.
- Seules exceptions : le nom de marque (`BRAND.name`), les codes de langue, les identifiants joueurs (`P1`...`P8`) et les données saisies par le joueur. Les noms de personnages passent eux aussi par i18n (`characters.<id>.name`).
- Vérification automatique : `npm run check:i18n` (parité des clés et des variables `{{x}}`, détection de texte en dur).

## 7. Documentation obligatoire

- **Chaque élément** (écran, composant notable, système, store, scène, service backend) a son fichier `.md` dans `docs/elements/`, créé à partir de `docs/elements/_TEMPLATE.md`.
- Chaque doc d'élément contient une section **« Conformité règles d'or »** cochée.
- Toute nouvelle règle validée par le projet est ajoutée **ici**.

## 8. Discipline de phase

- Ne rien implémenter qui appartient à une phase suivante.
- Chaque phase a sa fiche dans `docs/phases/` (objectif, livrables, statut, ce qui est prêt pour la suite).
- Workflow de test obligatoire après chaque changement significatif : voir `docs/TESTING.md`.
