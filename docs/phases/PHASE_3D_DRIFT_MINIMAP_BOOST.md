# Phase 3D : glisse du drift, mini-carte, relief, nitro façon voiture-fusée

## Demande

- Une mini-carte pour voir où l'on est.
- Le dérapage n'est toujours pas celui attendu. Réponses de l'utilisateur :
  - « on dirait que je saute et que je prends tout de suite le virage » ;
  - il ne tourne pas assez ;
  - il est trop dur à lancer ;
  - il ne glisse pas assez ;
  - le turbo est trop faible.
- Du relief sur les circuits plats.
- Une nitro, et des traînées quand on l'utilise et quand on relâche un dérapage, façon Rocket League.

## Fait

- **Drift**, voir [elements/kart-driving.md](../elements/kart-driving.md) :
  - vraie glisse : la trajectoire suit le kart avec retard (`carryDrift` 0,5, `driftGrip` 3,6), environ 30° de dérive réelle, plus l'angle du corps ;
  - entrée progressive : la rotation monte de 30 % à 100 % en 0,45 s après l'atterrissage, le kart se met de travers et glisse sur son élan ;
  - la vitesse est gardée pendant la glisse ;
  - virage plus serré (`turnNeutral` 1,6, `turnInside` 2,4) ;
  - lancement plus facile (braquage 0,2, vitesse minimale 30 %) ;
  - mini-turbos plus forts (x1,35, 0,95 s et 2,85 s) ;
  - en drift, la caméra suit la trajectoire, et l'on voit le kart de travers.
- **Mini-carte** : [elements/race-minimap.md](../elements/race-minimap.md).
- **Relief** : Lac Miroir, Côte Turquoise, Combe du Givre et Cascade de Glace ont des montées et descentes (jusqu'à 6 à 9 m) et des collines autour ; le départ et les passages en deltaplane restent à plat.
- **Turbo façon voiture-fusée** (`components3d/Effects/boostEmitters.js`, pool de traînées `boost`), pour toutes les sources de turbo, mini-turbos du drift compris, à la couleur de chacune :
  - flammes plus longues ;
  - deux rubans lumineux qui flottent derrière les échappements ;
  - boules de feu, braises.

## Vérifié

- Banc d'essai du drift (Node) : à l'entrée, glisse de 9° qui monte à 28° en 0,5 s ; vitesse gardée à 28,5 m/s ; bleu après 1 s braqué dedans.
- Simulation, 16 circuits avec 32 pilotes ordinateur : 512 sur 512 à l'arrivée, environ 10 mini-turbos par pilote et par course.
- Dans le jeu, sur Lac Miroir :
  - relief jusqu'à 7,8 m ;
  - mini-carte avec 32 points ;
  - nitro avec rubans ;
  - kart de travers en drift ;
  - aucune erreur dans la console.
