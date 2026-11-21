# Sélection des personnages (portraits, gabarits, présélection, unicité)

- **Type** : écran
- **Fichiers** : `src/components/menu/CharacterSelect.jsx`, `src/components/players/CharacterCard.jsx`, `PanelCharacterInfo.jsx`, `CharacterAvatar.jsx`, `src/game/characterSelect.js`, `src/game/characterSelectionRules.js`, `src/stores/characterSelectionStore.js`
- **Système commun** : [selection-system.md](selection-system.md) ; preview : [selection-preview-3d.md](selection-preview-3d.md)
- **Phase** : 1C, 1D, revu en 1E et 1G (16 personnages GLB, portraits)

## Ce que voit le joueur

- **Preview 3D en haut** : le personnage présélectionné **seul, sans véhicule**, à la hauteur de son gabarit (petit, moyen, grand), avec son étiquette (P#, nom).
- **Roster au centre** : 4 x 4 tuiles carrées, **uniquement les portraits** sur la couleur d'identité du personnage, avec les curseurs P1...P8 posés dessus. Un personnage confirmé est grisé et marqué du joueur qui l'a pris. Sur grand écran, la largeur du roster suit la hauteur restante (`calc(53dvh - 7.5rem)`) pour que les quatre rangées tiennent.
- **Panneaux sur les côtés** : identifiant, statut (Présélection / Pris par Px / Confirmé), périphérique, **portrait + nom + archétype · gabarit**, contrôles. **Aucune statistique** : les statistiques sont celles des véhicules, affichées à l'écran suivant (en solo).

## Portraits

Rendus une fois depuis les modèles 3D ([character-models.md](character-models.md)) et lus dans `portraitStore`. `CharacterAvatar` les affiche partout (roster, panneaux, lobby, écran partagé), sur la couleur d'identité du personnage ; silhouette tant qu'ils ne sont pas prêts ou sans personnage (entrée des joueurs).

## Règle d'unicité

Un personnage confirmé est réservé à un seul joueur :
- la présélection ne réserve rien ;
- la navigation saute les personnages réservés ;
- la confirmation d'un personnage pris est refusée par le store, avec secousse du panneau ;
- annuler libère le personnage ;
- la validation finale refuse les doublons (`duplicateCharacters`).

## Suite

Quand tout le monde a confirmé : START ou Continuer, puis sélection des véhicules ([vehicle-select.md](vehicle-select.md)).

## Conformité règles d'or

- [x] Aucun dégradé linéaire (couleurs pleines) ; aucun emoji
- [x] Tailwind uniquement ; aucun texte en dur
- [x] Pas de statistiques à la sélection des personnages
- [x] Rien d'une phase suivante
