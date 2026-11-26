# Phase 3B : gameplay des courses

## Demande

« Améliore le gameplay des courses pour qu'on puisse bien s'amuser ; prends toujours le kart arcade de référence (Wii) comme modèle. » Les objets restent ceux d'aujourd'hui : les définitifs seront fournis plus tard.

## Fait

Voir [elements/race-feel.md](../elements/race-feel.md) :
- aspiration (sillage, turbo, filets de vent, jauge) ;
- faux départ (moteur calé) ;
- annonces de tour, de dernier tour et de sens interdit ;
- place qui rebondit quand elle change ;
- champ de vision élargi en turbo ;
- cylindrées 50 / 100 / 150 cc.

## Vérifié

- Simulation sans rendu, 16 circuits avec 32 pilotes ordinateur :
  - 100 % des karts à l'arrivée en 50, 100 et 150 cc ;
  - meilleur temps de course en 100 cc entre 128 et 177 s selon le circuit ;
  - en 150 cc, 10 à 15 % plus rapide ; en 50 cc, 20 % plus lent.
- Aspiration réglée à environ 2 turbos par kart et par tour dans un peloton de 32. Le premier réglage en donnait 8, beaucoup trop.
- Dans le jeu (150 cc, Prairie Kairos) :
  - faux départ affiché, moteur calé 1 s, puis le kart repart ;
  - « Sens interdit » après un demi-tour ;
  - « Dernier tour ! » au début du 3e tour ;
  - jauge d'aspiration, puis turbo d'aspiration (flamme bleue) ;
  - onglet Course des paramètres ;
  - aucune erreur dans la console.
- `npm run check`, `npm run build`.
