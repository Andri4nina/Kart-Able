# Phase 1B — Menu principal, navigation et i18n

**Statut** : terminée (2026-09-25)
**Objectif** : l'expérience de navigation complète du menu, prête à accueillir les modes de jeu, le multijoueur local (8) et en réseau (32). Aucun gameplay.

## Périmètre

Inclus :
- Parcours : Menu principal, Mode de jeu, Type de partie (Local / Réseau), Joueurs locaux ou Partie en réseau, Lobby.
- Modes définis en configuration : Course, Contre-la-montre, Bataille, Rocket Gol.
- Local : « Jusqu'à 8 joueurs », emplacements, choix Clavier / Manette.
- Réseau : « Jusqu'à 32 joueurs », créer, rejoindre (code), matchmaking annoncé ; aucun serveur.
- i18n : français (référence), English, Malagasy ; changement instantané ; langue mémorisée ; ajout d'une langue = un fichier.
- Paramètres à onglets : Langue, Audio (bientôt), Graphismes, Contrôles (bientôt).
- Scène 3D décorative légère : plan caméra par écran, objet vitrine teinté selon le mode.

Exclus : physique, kart, circuit, bots, objets, backend, Colyseus, matchmaking, système de course, Garage, Quitter (web).

Interprétation : l'étape « TYPE DE JEU » du parcours demandé est l'écran du choix Local / Réseau (MODE DE JEU -> TYPE DE JEU [Local / Réseau] -> LOBBY).

## Dépendances ajoutées

Aucune. i18n maison (Intl.PluralRules + `import.meta.glob`), navigation maison (Zustand déjà présent).

## Architecture

Voir [ARCHITECTURE.md](../ARCHITECTURE.md) sections 2 et 3 : UI, puis Navigation, puis Configuration de jeu, puis Systèmes de jeu (futurs).

## Vérifications

- `npm run check` : oxlint, règles d'or, i18n (3 langues, 128 clés, aucun texte en dur).
- `npm run build` : app ~92 kB (~28 kB gzip), vendors inchangés.
- Navigateur : parcours complet local et réseau, flèches / Entrée / Échap, langue persistée après rechargement, mobile 375 px sans défilement horizontal, aucune erreur console.

## Prêt pour la suite

- Phase 2 (kart) : `sessionStore.match` fournit mode, type et joueurs ; `CAMERA_BEHAVIORS.game` à remplacer ; `Contrôles` à remplir.
- Manettes : `game/input/` (Gamepad API) branchera `addLocalPlayer` / `setPlayerDevice` et les actions de navigation.
- Réseau : `net/` (client Colyseus) remplacera `hostOnlineMatch` / `joinOnlineMatch` et lèvera `serverRequired`.
- Nouveaux modes / langues : une entrée de config / un fichier JSON.
