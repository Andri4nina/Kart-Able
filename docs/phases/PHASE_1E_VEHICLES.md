# Phase 1E — Personnage seul, visages, sélection des véhicules (GLB)

**Statut** : terminée (2026-10-01)
**Demande** : à la sélection des personnages, afficher le personnage seul (sans voiture), les visages dans la grille et le nom dans la présélection, sans statistiques en multijoueur ; puis une sélection des véhicules avec les GLB disponibles ; puis le lobby pour lancer la course.

## Flow local

Joueurs locaux, puis personnages, puis **véhicules**, puis lobby, puis course (écran de démo).

## Fait

- Système de sélection rendu générique (règles, store, contrôleur, composants UI), utilisé par les personnages (unique) et les véhicules (partageable).
- Personnages : figurine 3D seule, visages SVG (roster et avatars), nom dans la présélection, aucune statistique.
- Véhicules : 7 GLB (`src/assets/models`) clonés et normalisés, préchargés pendant le choix des personnages, statistiques en solo uniquement.
- Validation finale : personnages uniques et confirmés, véhicules confirmés ; `match.players[]` avec `characterId` et `vehicleId`.
- Ancien modèle kart + pilote supprimé.

## Décisions

- Les statistiques d'archétype des personnages restent en configuration (modificateurs pour la phase physique), sans être affichées.
- Les véhicules affichent nos propres noms (Classique, Sprint, Hot Rod, Buggy, Comète, Recrue, Flamant).
- **Licences des GLB à vérifier** avant publication (noms de fichiers issus d'autres jeux).

## Dépendances ajoutées

Aucune (`useGLTF` de drei, `SkeletonUtils` de three).
