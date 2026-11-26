# Phase 3C : dérapage, départ, objets et coupes façon Wii

## Demande

« Je ne ressens toujours pas le dérapage de Mario Kart : regarde comment les développeurs l'ont fait ; de même pour les cases à objets et surtout les objets ; le départ turbo doit se déclencher quand on démarre à 3 ; une icône pour chaque coupe, et les circuits s'affichent quand on clique dessus. »

## Recherche

D'après les wikis de la communauté (MarioWiki, MKW TAS Wiki), la version Wii :
- la charge du mini-turbo est un minuteur : 270 unités, 5 par image en braquant vers l'intérieur, 2 sinon (soit ~0,9 s à ~2,3 s) ;
- le super mini-turbo (orange) demande 300 unités de plus et dure trois fois plus longtemps ;
- il n'y a pas de palier violet, et le départ turbo se prend sur le « 2 » (ici sur le « 3 », à la demande).

## Fait

- **Dérapage** : charge au minuteur (x2,5 en braquant dedans) ; deux paliers (bleu, orange), le super trois fois plus long. Voir [elements/kart-driving.md](../elements/kart-driving.md).
- **Départ** : compte à rebours 3, 2, 1 (fini les feux), turbo si on accélère sur le « 3 » et qu'on tient, moteur calé si on accélère avant. Voir [elements/race-feel.md](../elements/race-feel.md).
- **Objets** : 11 objets aux mécaniques de la référence, objets tenus derrière soi, collisions entre objets, objets rares limités. Voir [elements/items.md](../elements/items.md).
- **Cases** : verre prismatique, roulette de durée fixe.
- **Coupes** : emblème par coupe ; un clic affiche ses circuits. Voir [elements/track-select.md](../elements/track-select.md).
- **Correction** : les noms des coupes neige et terre manquaient (clé affichée à la place du nom).

## Vérifié

- Simulation sans rendu, 16 circuits, 32 pilotes ordinateur :
  - 512 sur 512 à l'arrivée ;
  - 2 728 mini-turbos bleus (orange rare, réservé aux meilleurs) ;
  - environ 6 départs turbo par course ;
  - tous les objets utilisés ;
  - environ 4 tête-à-queue dus aux objets par kart et par course.
- Dans le jeu :
  - compte à rebours affiché, départ turbo sur le « 3 » ;
  - emblèmes des 4 coupes, un clic ouvre les circuits ;
  - objet tenu derrière (petit, ne cache pas la vue), posé ou lancé au relâchement, orbe guidé vers le kart de devant ;
  - surcharge ;
  - cases prismatiques ;
  - aucune erreur dans la console.

## Limites

- Objets toujours non synchronisés en réseau local.
- Les modèles 3D des objets restent simples (en attente des objets fournis).
