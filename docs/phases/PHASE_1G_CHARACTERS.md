# Phase 1G — Personnages GLB, gabarits, identité colorée, Kart Able

**Statut** : terminée (2026-10-08)
**Demande** : afficher les personnages fournis (GLB) en équivalence de taille (petit, moyen, grand, répartition libre) ; comme dans les jeux de kart de salon, donner à chaque personnage son identité colorée sur les véhicules ; un nom spécial pour chaque personnage ; renommer le jeu « Kart Able ».

## Fait

- 16 personnages GLB (`src/assets/models/Character`) : 5 grands, 5 moyens, 6 petits ; 4 par archétype. Voir [character-classes.md](../elements/character-classes.md).
- Préparation des modèles : orientation, pose, mise au sol, hauteur du gabarit, animation d'attente en boucle quand le modèle en a une, teinte pour le modèle sans couleur. Voir [character-models.md](../elements/character-models.md).
- Portraits rendus depuis les modèles 3D (une fois, hors écran) : roster en tuiles 4 x 4, panneaux, lobby, écran partagé. Les visages SVG et les figurines low-poly sont supprimés.
- Karts repeints à la couleur du personnage, à la sélection des véhicules et en course. Voir [kart-paint.md](../elements/kart-paint.md).
- Noms : Diesel, Marlo, Timo, Pyrox, Osso, Rubis, Mitsu, Volt, Sir Gibus, Tempo, Frisko, Kosmo, Nox, Zenji, Pompon, Miella.
- Nom du jeu : **Kart Able** (logo, titre de la page, docs). « SMKW » reste le nom de code (dossiers, clés de stockage).

## Décisions

- Gabarit ≈ poids : les tanks sont grands, les vitesses petits ; les spéciaux (survol) sont les personnages qui volent ou flottent.
- Le panneau de présélection affiche « archétype · gabarit » ; toujours aucune statistique.
- Pilote debout dans le kart, le bas du corps caché : pas de pose assise dans les modèles fournis.
- Le pack d'arbres (`assets/models/Tree`) n'est pas utilisé : il servira au décor du circuit.

## Hors périmètre

Conduite, physique, circuit, objets.

## Dépendances ajoutées

Aucune.
