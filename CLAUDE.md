# Kart Able (code SMKW) — consignes pour les agents

Jeu de course de kart 3D multijoueur pour le web, **Kart Able**, inspiré des jeux de kart arcade, avec sa propre identité visuelle. « SMKW » reste le nom de code (dossiers `smkw-ui`, `smkw-api`, clés de stockage).

- `smkw-ui/` : frontend (React, Vite, React Three Fiber, Drei, Tailwind CSS, Motion, Zustand, lucide-react)
- `smkw-api/` : backend (Rust, squelette léger), prévu pour la phase multijoueur

## À lire avant toute modification

1. [docs/REGLES_D_OR.md](docs/REGLES_D_OR.md) : règles non négociables
2. [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) : structure et flux de dépendances
3. La fiche de la phase en cours dans [docs/phases/](docs/phases/)
4. [progress.md](progress.md) : où en est le travail, TODO laissés par l'agent précédent

## Règles d'or (résumé)

- **Jamais de dégradé linéaire** (CSS, Tailwind `bg-linear-*` / `bg-gradient-*`, SVG).
- **Jamais d'emoji**, nulle part. Des icônes `lucide-react` si, et seulement si, elles sont utiles.
- Tailwind uniquement pour le style. Animations : Tailwind > Motion > `useFrame`. Mouvement réduit respecté.
- UI (`components/`) et 3D (`components3d/`) ne s'importent jamais : elles passent par les stores.
- **Aucun texte UI en dur** : tout passe par `t()` et `src/locales/*.json` (fr = référence, puis en, mg).
- Les modes de jeu se définissent uniquement dans `src/config/gameModes.js`, les personnages dans `src/config/characters.js` (archétype, gabarit, couleur d'identité ; modèle GLB dans `components3d/Characters/characterAssets.js`), les véhicules dans `src/config/vehicles.js`, les coupes et circuits dans `src/config/cups.js` et `src/config/tracks.js` (données par coupe dans `src/config/trackData/`) (générés par `game/track` et `components3d/Track`).
- Toute sélection par joueur réutilise le système générique (`game/selection/`, `createSelectionStore`, `components/selection/`).
- Aucune touche ou bouton physique dans les écrans : passer par `src/input/` (actions abstraites, PlayerInput). Ne jamais supposer le clavier.
- Toute zone qui défile utilise la classe `scrollbar-game`.
- Ressources de tiers : licence notée dans [docs/CREDITS.md](docs/CREDITS.md) avant d'ajouter un fichier.
- **Chaque nouvel élément a sa fiche** `docs/elements/<element>.md` (depuis `_TEMPLATE.md`) avec la checklist « Conformité règles d'or ».
- Ne rien implémenter d'une phase suivante.

## Commandes (dans `smkw-ui/`)

```
npm run dev          # serveur de dev, http://localhost:5173
npm run check        # oxlint + règles d'or + i18n (clés, variables, texte en dur)
npm run build        # build de production
```

## Tests

Workflow `develop-web-game` : [docs/TESTING.md](docs/TESTING.md). Le jeu expose `window.advanceTime(ms)` et `window.render_game_to_text()`.
Après chaque changement significatif : agir, capturer, lire l'état texte, vérifier la console, consigner dans `progress.md`.
