# Phase 3G : Duet Cup et Water Cup

## Demande

- **Duet Cup** : plusieurs chemins au choix, bien équilibrés, et beaucoup de sauts en deltaplane.
- **Water Cup** : on glisse sur l'eau.

## Fait

- **Embranchements** (`splits`) : terre-plein central entre deux voies, collision, choix de voie des pilotes ordinateur, rendu. Voir [elements/track-splits.md](../elements/track-splits.md).
- **Voies d'eau** (`waterways`) : la route devient de l'eau, les karts flottent et glissent, sillage d'écume. Voir [elements/track-waterways.md](../elements/track-waterways.md).
- **Duet Cup** (`config/trackData/duetCup.js`) : Prairies Duo, Canyon de la Fourche, Îles Jumelles, Fourche du Ciel. Cinq embranchements, dix passages en deltaplane.
- **Water Cup** (`config/trackData/waterCup.js`) : Course du Lagon, Rapides de la Rivière, Dédale des Mangroves, Sprint du Port. Deux voies d'eau par circuit, de 180 à 260 m.
- Emblèmes `Split` et `Waves` ; couleurs `--color-cup-duet` et `--color-cup-water` ; textes en fr, en et mg.

## Vérifié

- **Simulation**, 31 pilotes ordinateur sur les 8 circuits :
  - tous à l'arrivée, sans aucune chute ;
  - les pilotes se répartissent moitié-moitié entre les deux voies, avec au plus 0,25 s d'écart entre elles.
- **Non-régression** : résultats identiques sur Prairie Kairos et Jardins Pax.
- **Dans le jeu** :
  - 7 coupes à l'écran des circuits ;
  - course sur Prairies Duo : terre-plein visible ;
  - course sur Course du Lagon : karts sur l'eau, sillage ;
  - aucune erreur dans la console.
- **Builds** : `npm run check` et `npm run build`.
