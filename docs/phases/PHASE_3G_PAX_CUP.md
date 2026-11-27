# Phase 3G : Pax Cup (coupe technique, sans objets)

## Demande

Une nouvelle coupe, la **Pax Cup** : très technique, sans objets ; c'est le pilote qui fait la course. 4 circuits, comme toutes les coupes.

## Fait

- **Circuits** : `config/trackData/paxCup.js`. Ils sont branchés dans `config/tracks.js` et dans `config/cups.js` (coupe `pax`).
  - **Jardins Pax** (`paxGardens`, prairie) : épingles serrées, chicane, petit étang.
  - **Col des Lanternes** (`lanternPass`, forêt) : triple S en montée, relief.
  - **Méandres d'Eau Calme** (`stillwaterBend`, lac) : virages en série autour d'un étang.
  - **Spirale du Zénith** (`zenithSpiral`, alpin) : lacets jusqu'à 12 m (avant échelle), longue descente technique.
- **Sans objets** : `itemRows: []`, donc aucune case à objets ni case chance. Aucun tremplin, un seul pad par circuit. Les rochers imposent la trajectoire.
- **Routes** : 13 de large avant échelle (17 m), le minimum des autres coupes. La grille reste à 20 (26 m).
- **Emblème** : icône lucide `Route`, couleur `--color-cup-pax` (#7c5cc4).
- **Textes** : `cups.pax`, `tracks.<id>.name` et `.description`, en fr, en et mg.

## Vérifié

- **`measureTrackClearance`** : la route ne se recoupe pas (marge de 32 à 41 m) et reste hors de l'eau (21 m et plus).
- **Simulation**, avec 31 pilotes ordinateur et 3 tours par circuit :
  - tous à l'arrivée sur les 4 circuits ;
  - de 175 à 202 s par course, contre environ 150 s ailleurs (circuits plus longs et plus lents) ;
  - drifts et mini-turbos nombreux.
- **Corrections faites pendant la vérification** :
  - une chicane trop serrée faisait recouper une porte à l'envers, et un tour ne comptait plus : adoucie ;
  - un rocher au milieu du triple S bloquait les pilotes : déplacé.
- **Dans le jeu** :
  - la carte de la coupe et ses 4 circuits ;
  - course lancée sur Jardins Pax : `itemBoxes 0/0` ;
  - aucune erreur dans la console.
