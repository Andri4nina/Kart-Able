# Archétypes, gabarits et personnages

- **Type** : configuration
- **Fichiers** : `src/config/characters.js`, textes `classes.*`, `sizes.*`, `characters.*` dans `src/locales/*.json`, visuels UI `src/components/players/playerVisuals.js`, tokens `--color-char-*` (`src/index.css`), modèles 3D [character-models.md](character-models.md)
- **Phase** : 1C, 8 personnages en 1D, 16 personnages GLB en 1G

## Modèle

```js
CHARACTER_CLASSES = { tank, standard, speed, special }   // stats sur 10 + mécanique éventuelle
CHARACTER_SIZES = { small: 0.64, medium: 0.82, large: 1 } // hauteur relative du gabarit
ROSTER_COLUMNS = 4                                       // une colonne par archétype
CHARACTERS = [{ id, classId, size, color }, ...]         // 16, grille du roster ligne par ligne
```

La sélection ne stocke qu'un `characterId`. Avec la règle d'unicité, 8 joueurs ont toujours le choix entre 16 personnages.

## Les 16 personnages

| Personnage | Modèle | Archétype | Gabarit | Couleur |
| --- | --- | --- | --- | --- |
| Diesel | motard | Tank | Grand | rouille `#b5651d` |
| Marlo | garçon en marinière | Standard | Moyen | violet `#7b4dff` |
| Timo | enfant à casquette | Vitesse | Petit | vert `#2bb673` |
| Pyrox | esprit de feu | Spécial | Grand | orange `#ff6a13` |
| Osso | squelette | Tank | Grand | blanc os `#f2ede0` |
| Rubis | démone | Standard | Moyen | rubis `#e0115f` |
| Mitsu | chat en peluche | Vitesse | Petit | lavande `#b8a9ff` |
| Volt | robot volant | Spécial | Grand | citron vert `#a3e635` |
| Sir Gibus | gentleman | Tank | Grand | bordeaux `#7a1f3d` |
| Tempo | mannequin danseur | Standard | Moyen | magenta `#ff3fa4` |
| Frisko | pingouin glacé | Vitesse | Petit | glace `#5ce1e6` |
| Kosmo | robot-chat | Spécial | Moyen | bleu `#2f6fed` |
| Nox | peluche noire | Tank | Moyen | noir `#1f1f2b` |
| Zenji | vieux maître | Standard | Petit | sarcelle `#0f8b8d` |
| Pompon | cochon en peluche | Vitesse | Petit | rose `#ff9ec4` |
| Miella | abeille | Spécial | Petit | miel `#ffc21a` |

- **Gabarits** (5 grands, 5 moyens, 6 petits) : tous les modèles sont ramenés à la hauteur de leur gabarit, quelle que soit leur taille d'origine. Ils suivent globalement l'archétype (tanks grands, vitesses petits), comme le poids dans les jeux de kart. Les archétypes spéciaux (survol) sont des personnages qui volent ou flottent.
- **Couleur d'identité** : peinture du kart du personnage ([kart-paint.md](kart-paint.md)) et fond de son portrait. Les tokens `--color-char-*` de `index.css` reprennent les mêmes valeurs ; `check:rules` vérifie qu'ils sont identiques.
- Panneau de présélection : nom, puis « archétype · gabarit » (ex. « Tank · Grand »).

## Statistiques d'archétype (sur 10)

Non affichées : ce sont des modificateurs de gameplay pour la phase physique. Les statistiques montrées au joueur sont celles des véhicules, en solo.

| Stat | Tank | Standard | Speed | Special |
| --- | --- | --- | --- | --- |
| Vitesse max | 4 | 6 | **9** | 6 |
| Accélération | 3 | 6 | 4 | **7** |
| Poids | **9** | 5 | 3 | 2 |
| Maniabilité | 3 | 6 | 3 | 4 |
| Drift | 4 | 6 | **9** | 3 |
| Résistance aux chocs | **9** | 5 | 3 | 2 |
| Total | 32 | 34 | 31 | 24 + mécanique |

## Ajouter un personnage

1. Le GLB dans `src/assets/models/Character/` et son entrée dans `components3d/Characters/characterAssets.js` (orientation, animation, cadrage du portrait).
2. Entrée dans `CHARACTERS` (`classId`, `size`, `color`), token `--color-char-<id>` dans `index.css`, classe `bg-char-<id>` dans `playerVisuals.js`.
3. `characters.<id>.name` dans chaque locale (`npm run check`).

## Conformité règles d'or

- [x] Aucune statistique dans les composants
- [x] Textes via i18n (noms et gabarits compris)
- [x] Aucun emoji ; couleurs pleines
- [x] Rien d'une phase suivante (aucune physique)
