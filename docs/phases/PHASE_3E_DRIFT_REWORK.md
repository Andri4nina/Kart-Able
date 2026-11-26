# Phase 3E : drift refait, hébergement Vercel

## Demande

1. « Le dérapage n'est toujours pas ça », avec deux cahiers des charges successifs :
   - drift façon version Wii : entrée agressive, kart visiblement de travers, arrière qui glisse,
     trajectoire contrôlée, contre-braquage utile, vitesse gardée, relâchement immédiat ;
   - séparer l'orientation, la vitesse, la vitesse latérale et l'angle de glisse, et laisser
     l'angle ÉMERGER de l'adhérence au lieu de l'imposer.
2. Pouvoir héberger le jeu sur Vercel.
3. Tout commiter.

## Diagnostic

- **Phase 3D** : la rotation était très forte et la vitesse ne suivait qu'à moitié. La trajectoire découlait d'un équilibre non piloté. Un angle visuel s'ajoutait par-dessus. Résultat : patinoire, puis virage brusque.
- **Première refonte 3E** : la trajectoire était tournée directement, et l'angle était un ressort vers une valeur cible.
  - Effet : une animation posée sur une courbe, sans vitesse latérale ni adhérence ; l'arrière ne décrochait jamais.
  - L'entrée était molle (rotation à 45 % au départ).
  - La caméra, très alignée sur la trajectoire, rendait l'angle peu lisible.

## Fait

- **Drift** : voir [elements/kart-driving.md](../elements/kart-driving.md), section « Drift : glisse par adhérence ».
  - Le braquage pilote la rotation (avec inertie).
  - La vitesse suit par l'adhérence et l'angle émerge.
  - L'entrée est agressive : décrochage pendant le saut.
  - Le contre-braquage stabilise.
  - La sortie est douce.
  - Les mini-turbos donnent un élan immédiat.
  - Réglages par kart.
- **Vercel** : voir [HOSTING.md](../HOSTING.md).
  - `vercel.json` à la racine : construit `smkw-ui` et publie `smkw-ui/dist`, sans réglage dans l'interface.
  - `.vercelignore` : n'envoie que le jeu web.
  - Scripts `npm run deploy:preview` et `npm run deploy` (commande Vercel).

## Vérifié

- **Banc d'essai (Node)** :
  - angle de glisse émergent : 35° dedans, 23° au neutre, 7° en contre-braquage ;
  - rayons de 11, 17 et 36 m ;
  - vitesse gardée à 28,5 m/s ;
  - entrée : nez à 33° et trajectoire à 16° après 0,3 s ;
  - sortie : 31° puis 7° en 0,2 s, trajectoire inchangée ;
  - drift enchaîné dans l'autre sens sans à-coup.
- **Simulation**, 16 circuits avec 31 pilotes ordinateur :
  - tous à l'arrivée ;
  - environ 4 à 7 mini-turbos par pilote et par course ;
  - moins de sorties de piste qu'avant.
- **Dans le jeu (Lac Miroir)** : kart de travers dans le virage, traces en arc, aucune erreur dans la console.
- **Build** : `npm run build` depuis la racine (`--prefix smkw-ui`), comme sur Vercel.
