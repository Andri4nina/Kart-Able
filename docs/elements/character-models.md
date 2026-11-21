# Personnages GLB et portraits

- **Type** : objets 3D + système + store
- **Fichiers** : `src/assets/models/Character/*.glb`, `src/components3d/Characters/` (`characterAssets.js`, `prepareCharacter.js`, `CharacterModel.jsx`, `PortraitStudio.jsx`, `renderPortrait.js`), `src/stores/portraitStore.js`, `src/components/players/CharacterAvatar.jsx`
- **Phase** : 1G

## Rôle

Afficher les 16 personnages à partir des modèles GLB fournis : sur leur socle à la sélection, au volant de leur kart en course, et en **portrait** (visage) dans le roster, les panneaux, le lobby et l'écran partagé.

## Préparation d'un modèle (`prepareCharacter`)

Les exports Sketchfab ont des échelles très différentes (de 0,02 à 324 unités) :
1. clone avec squelette (`SkeletonUtils.clone`) : géométries et textures partagées ;
2. pose : première image de son animation (`clip`), si elle existe ;
3. orientation vers +Z (`yaw` : le chat et le robot volant sont tournés d'un quart de tour) ;
4. mise au sol, centrage et mise à la **hauteur du gabarit**, mesurée sur la pose (boîte précise, squelette compris, calculée une fois par fichier) ;
5. teinte à la couleur du personnage pour un modèle livré sans couleur (`tint` : Tempo).

Hauteurs (`CHARACTER_HEIGHTS`) : 1,65 sur le socle et 1 au volant pour un grand ; moyen x 0,82, petit x 0,64.

## Animations

`loop` : animation d'attente jouée en boucle (Marlo, Timo, Osso, Sir Gibus, Kosmo), par un `AnimationMixer` mis à jour dans `useFrame`. En mouvement réduit, la pose reste fixe. Les animations de marche ou de danse ne servent qu'à la pose (Diesel, Tempo, Pompon), les autres modèles sont statiques.

## Portraits (`PortraitStudio`)

- Monté dans le Canvas dès l'écran des joueurs locaux : il charge les 16 modèles (cache `useGLTF`) et rend chaque visage **une seule fois** dans une texture hors écran (192 px, demi-flottants, fond transparent), convertie en PNG sRGB.
- `portrait` dans `characterAssets.js` : centre et hauteur du cadrage, en fraction de la hauteur du modèle (humain, chibi, rond, ou valeur propre).
- Les images vont dans `portraitStore` ; l'UI (`CharacterAvatar`) les affiche sur la couleur d'identité du personnage, avec une silhouette tant qu'elles ne sont pas prêtes. L'UI n'importe aucun module 3D.
- Mesuré : les 16 portraits sont prêts environ 2 s après l'arrivée sur l'écran des joueurs.

## Interface et tests

- Groupe `character-<id>` (sonde `preview` de `render_game_to_text`).
- `usePortraitStore.getState().portraits` : un PNG par personnage.

## Performance

Environ 10 Mo de GLB pour les 16 personnages, chargés une fois. Clones partagés ; matériaux copiés seulement pour la teinte. Une passe de rendu par portrait, une seule fois. Une mise à jour de mixer par personnage animé et par frame.

## Licences

Noms de fichiers issus de Sketchfab, certains évoquent des personnages existants (« smol Ame », « Puro »...). Vérifier la licence de chaque modèle (attribution, usage commercial) avant publication. Le jeu affiche ses propres noms.

## Conformité règles d'or

- [x] Aucun dégradé linéaire ; aucun emoji
- [x] UI et 3D séparées : les portraits passent par `portraitStore`
- [x] `useFrame` seulement pour les animations d'attente ; mouvement réduit respecté
- [x] Rien d'une phase suivante
