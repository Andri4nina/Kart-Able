# Sélection des véhicules (GLB)

- **Type** : écran + configuration + modèles 3D
- **Fichiers** : `src/components/menu/VehicleSelect.jsx`, `src/components/players/VehicleCard.jsx`, `VehiclePanelInfo.jsx`, `src/config/vehicles.js`, `src/game/vehicleSelect.js`, `src/stores/vehicleSelectionStore.js`, `src/components3d/Vehicles/` (`vehicleAssets.js`, `normalizeModel.js`, `VehicleModel.jsx`)
- **Phase** : 1E, karts peints en 1G

## Flow

Joueurs locaux, puis personnages, puis **véhicules**, puis lobby, puis course. Chaque joueur choisit et confirme son véhicule indépendamment. Plusieurs joueurs peuvent prendre le même véhicule : chacun le voit **à la couleur de son personnage** ([kart-paint.md](kart-paint.md)). Le lobby valide que tous les véhicules sont confirmés (`vehiclesPending`).

## Véhicules (`config/vehicles.js`)

| id | Nom (fr) | Fichier GLB | Profil |
| --- | --- | --- | --- |
| classic | Classique | boom_karts_kart.glb | polyvalent |
| sprint | Sprint | go_kart.glb | léger, reprise |
| hotrod | Hot Rod | boom_karts_hot_rod.glb | pointe, lourd |
| buggy | Buggy | boom_karts_dune_buggy.glb | robuste |
| comet | Comète | jon_arbuckles_kart_speed.glb | vitesse, drift |
| rookie | Recrue | practice_kart.glb | maniabilité |
| flamingo | Flamant | race_kart_pink_style.glb | glisse |

Statistiques sur 10 (`config/stats.js`). Elles ne sont **affichées qu'en solo**, jamais en multijoueur.

## Modèles GLB

- Exports Sketchfab sans Draco ni Meshopt : `useGLTF` (drei) sans décodeur.
- Fichiers dans `src/assets/models`, importés comme URLs (Vite les publie à part ; ~4,4 Mo au total).
- Préchargés pendant la sélection des personnages (`preloadVehicleModels`).
- Chaque affichage est un **clone** (`SkeletonUtils.clone`) : géométries et textures partagées, aucun rechargement.
- `normalizeModel` : centrage X/Z, pose au sol, longueur 2 unités, orientation (`yaw` par véhicule), matériaux très métalliques adoucis (pas de carte d'environnement).
- `paint` : couleur du personnage du joueur, appliquée au clone (`kartPaint.js`).
- **Licences** : les noms de fichiers évoquent d'autres jeux. Vérifier la licence Sketchfab de chaque modèle (attribution, usage commercial) avant publication. Le jeu affiche ses propres noms.

## Conformité règles d'or

- [x] Réutilise le système de sélection générique et la scène de preview
- [x] Aucun texte en dur (noms dans les locales) ; aucun emoji ; Tailwind uniquement
- [x] Pas de statistiques en multijoueur
- [x] Rien d'une phase suivante (aucune conduite)
