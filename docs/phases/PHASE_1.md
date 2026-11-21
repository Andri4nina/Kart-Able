# Phase 1 — Base technique

**Statut** : terminée (2026-09-25)
**Objectif** : une base propre, légère, performante et extensible. Aucun gameplay.

## Périmètre

Inclus :
- Stack : React, Vite, React Three Fiber, Three.js, Drei, Tailwind CSS, Motion, Zustand (+ lucide-react pour les icônes).
- Scène R3F minimale : Canvas, caméra perspective remplaçable, éclairage léger, sol, éléments de démonstration.
- Écran d'accueil : logo/titre, PLAY, SETTINGS, raccourcis clavier.
- HUD de démonstration (valeurs fictives, chrono réel).
- Animations UI : titre progressif, boutons décalés, hover/clic, transition vers le jeu, apparition du HUD, `prefers-reduced-motion`.
- Hooks de test du workflow develop-web-game.

Exclus (phases suivantes) : kart jouable, physique, circuit, objets, bots, multijoueur, système de tours.

## Livrables

| Livrable | Emplacement |
| --- | --- |
| Frontend | `smkw-ui/` |
| Règles d'or + vérification auto | `docs/REGLES_D_OR.md`, `smkw-ui/scripts/check-golden-rules.mjs` |
| Architecture | `docs/ARCHITECTURE.md` |
| Fiches éléments | `docs/elements/*.md` |
| Workflow de test | `docs/TESTING.md`, `.claude/skills/develop-web-game/SKILL.md` |
| Journal | `progress.md` |

## Dépendances installées

Runtime : `react`, `react-dom`, `three`, `@react-three/fiber`, `@react-three/drei`, `zustand`, `motion`, `lucide-react`.
Dev : `vite`, `@vitejs/plugin-react`, `tailwindcss`, `@tailwindcss/vite`, `oxlint`, `@types/react`, `@types/react-dom`.

## Performance constatée

- Bundle : app ~35 kB, three ~740 kB (~190 kB gzip), R3F+drei ~190 kB, React ~207 kB, Motion ~128 kB. Découpé en chunks vendors.
- Scène : ~55 meshes (donc ~55 draw calls), une dizaine de géométries et de matériaux partagés, aucune texture, aucune ombre, 2 lumières.
- Zéro re-render React par frame (chrono et vitesse en abonnement transitoire).

## Prêt pour la phase 2 (kart et contrôles)

- `CAMERA_BEHAVIORS.game` à remplacer par une caméra de poursuite.
- `telemetryStore.speed` déjà affiché par le compteur de vitesse.
- `SCREENS` / `SCREEN_COMPONENTS` extensibles ; `GameCanvas` prêt à recevoir une `RaceScene`.
- `<Suspense>` et `assetsInclude` prêts pour un modèle de kart GLB.
- `useGlobalHotkeys` centralise le clavier ; les contrôles du kart iront dans un hook dédié (`game/kart/`).
- `advanceTime` déterministe : les tests de conduite pourront rejouer des entrées frame par frame.
