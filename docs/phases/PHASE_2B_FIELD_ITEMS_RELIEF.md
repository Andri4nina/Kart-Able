# Phase 2B : drift revu, 32 pilotes, cases à objets, relief, Summit Cup

## Demande

« Le drift ne suit pas celui des jeux de kart, à améliorer ; 32 joueurs en course, joueurs compris ; créer d'autres coupes et ajouter des montées et descentes ; ajouter les cases à objets ; sur l'objectif du jeu, on en est où ? »

## Livré

- **Drift** : armé tant que Drift est tenu (saut à l'appui) ; il démarre dès que le kart touche le sol avec une direction, pendant le saut ou plus tard (plus de fenêtre de 0,18 s ratée au clavier) ; poussée vers l'extérieur à l'entrée ; corps plus tourné vers l'intérieur (0,6 rad) ; relancer un drift annulé demande de relâcher. Voir [elements/kart-driving.md](../elements/kart-driving.md).
- **32 karts** (`RACE.fieldSize`), joueurs compris ; au-delà des 16 personnages, les bots réutilisent des personnages sur d'autres véhicules.
- **Cases à objets et 5 objets originaux** (nitro, triple nitro, flaque d'huile, orbe de choc, bulle), roulette, tirage selon la place, bots qui s'en servent, HUD. Voir [elements/items.md](../elements/items.md).
- **Relief** : hauteurs dans les points de contrôle, collines, pente qui freine / pousse, petits décollages sur les crêtes, rendu complet sur le relief. Prairie Kairos et Bois de l'Écho ont maintenant du dénivelé. Voir [elements/track-relief.md](../elements/track-relief.md).
- **Summit Cup** : Canyon Couchant, Col Alpin (20 m de dénivelé), Crête des Nuages, Course des Dunes ; ambiances `canyon` et `alpine`.

## Tests

- Drift : armement, départ après le saut, poussée, annulation puis relance.
- 8 circuits x 32 karts jusqu'à l'arrivée : aucun NaN, aucun kart sous le sol, objets utilisés (48 à 60 tête-à-queue par course), joueur en fond de grille : 2 à 6 objets par course après réglage (0 à 1 avant).
- Tracés : aucun croisement (marge route >= 40 m), eau à plus de 30 m, grille à plat, pentes <= 19 %.
- En jeu : 32 karts sur la grille, montée du Col Alpin, rangée de cases sur la route en pente, roulette et triple nitro (3 charges), flaque, orbe, bulle visible, écran de choix avec les 2 coupes, lobby « Course des Dunes · Summit Cup ».
- `npm run check` (326 clés), `npm run build` ; console sans erreur après rechargement.

## Limites connues

- Les sauts restent petits (10 à 25 cm) : de vrais sauts demandent des rampes (mécaniques de circuit).
- Coût d'affichage : ~16-18 ms par image en solo avec 32 karts dans le panneau de test ; l'écran partagé à 4 ou 8 joueurs avec 32 karts sera lourd (fusion des maillages des véhicules et niveaux de détail à prévoir).
- Avec 32 karts, un joueur coincé en fond de peloton trouve moins de cases intactes.

## Où en est l'objectif du jeu (cahier des charges en 8 phases)

| Phase | État |
| --- | --- |
| 1. Gameplay de base | Fait (conduite, drift, turbo, chocs, réapparition, relief) |
| 2. Course | Presque : il manque l'écran de résultats et le meilleur tour affiché |
| 3. Objets | Cases, roulette, inventaire, 5 objets : fait. Reste : plus d'objets (bombe, étoile, éclair, fantôme, missile auto, aimant), son |
| 4. Mécaniques de circuit | Relief et surfaces faits. Reste : pads de turbo, pièces, rampes, raccourcis, glace |
| 5. IA | Partielle : objets utilisés ; pas de drift, rythme encore ajusté artificiellement |
| 6. Modes | Course et contre-la-montre jouables ; Grand Prix (2 coupes prêtes, pas d'enchaînement ni de points), Bataille, Rocket Gol à faire |
| 7. UI / audio / VFX | HUD réel, VFX de drift / turbo / objets ; pas d'audio, pas de mini-carte en course |
| 8. Multijoueur | Local jusqu'à 8 ; serveur Rust à l'état de squelette |

## Conformité règles d'or

- [x] Aucun dégradé linéaire
- [x] Aucun emoji
- [x] Tailwind uniquement
- [x] Mouvement réduit respecté (roulette figée, secousses coupées)
- [x] UI / 3D séparées
- [x] Noms, objets, circuits originaux
