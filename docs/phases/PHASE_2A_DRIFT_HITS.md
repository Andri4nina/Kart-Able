# Phase 2A : drift, chocs, équilibrage, pilotes animés

## Demande

« Améliore le jeu, les chocs, l'équilibrage des véhicules et des personnages ; les rigs et animations des personnages sont très moches. Pour les dérapages, utilise la mécanique des jeux de kart arcade. » Plus : un cahier des charges complet (8 phases) à comparer à l'existant, sans casser ce qui marche ni changer les intentions ; backend en Rust (léger, facile).

## Livré

- **Drift** façon kart arcade : saut, sens choisi à l'atterrissage, jauge selon la qualité (braquage intérieur / extérieur, vitesse, surface), 3 paliers de mini-turbo (bleu, orange, violet), annulation au frein, au ralenti ou sur choc fort. Élan conservé en virage. Voir [elements/kart-driving.md](../elements/kart-driving.md).
- **Turbo centralisé** (`kartBoost.js`, `BOOSTS`) : sources, durée, multiplicateurs, politique de cumul (aucun cumul incontrôlé). Le départ turbo passe par lui.
- **Chocs** : capsules au lieu de disques (plus de bulle invisible de 1,9 m), poussée latérale selon la masse, secousse et perte de vitesse selon la résistance, chocs arrière inélastiques, murs avec rebond et perte de vitesse.
- **Réglages centralisés** : `config/kartTuning.js` (courbes de stats, drift, turbos, chocs, murs). Aucune valeur dans le contrôleur.
- **Équilibrage** : écarts de stats resserrés ; archétype lourd à vitesse de pointe moyenne ; hot rod un peu plus maniable ; buggy tout-terrain (`offRoad` 0,72). Écart mesuré : 5 % max entre combinaisons (pilote automatique, 2 circuits, sans drift ni chocs).
- **Pilotes** : pose assise calculée sur le squelette (9 GLB riggés), gestes amortis (volant, penché dans le virage, bras levés à l'arrivée, bras écartés au choc) ; attitude du kart (saut, glisse, roulis, secousse, nez levé sous turbo). Voir [elements/driver-rig.md](../elements/driver-rig.md).
- **HUD** : vitesse, tour, temps et position réels par joueur ; jauge de mini-turbo ; feux de départ et bandeau d'arrivée (composants existants, enfin branchés) ; mention « démo » retirée sur circuit.
- **Backend** : `smkw-api` passe en Rust (squelette sans dépendance qui compile ; aucune room).

## Audit du cahier des charges (état réel après cette phase)

| Phase du cahier | État | Détail |
| --- | --- | --- |
| 1. Core gameplay | Fait | Contrôleur arcade, caméra de poursuite, circuit, chocs, drift, turbo, réapparition (eau). Pas de marche arrière dédiée (frein tenu = recul), pas de saut hors drift. |
| 2. Race system | En grande partie | Départ (feux façon F1, conservés : intention du projet au lieu du 3-2-1), checkpoints anti-raccourci, tours, classement par progression, arrivée. **Manque : écran de résultats** (la phase `results` est publiée mais rien ne l'affiche), meilleur tour à l'écran, pause dédiée (les paramètres mettent en pause). |
| 3. Items | Absent | Emplacement d'objet vide dans le HUD. Les objets devront avoir des noms et designs originaux (pas de banane, carapace, champignon, Boo ou Bill Balle). |
| 4. Track mechanics | Partiel | Surfaces route / hors-piste / sable / eau. Pas de pads, pièces, rampes, raccourcis, glace. Le turbo est prêt à recevoir les pads (`BOOSTS`). |
| 5. AI | Partiel | Bots qui suivent leur trajectoire et ralentissent avant les virages, niveaux étalés. Ne drift pas, n'utilise pas d'objets. Ajustement de rythme +-7 % (`racePace.js`) : à remplacer par un vrai comportement à la phase IA, le cahier interdit de modifier arbitrairement la vitesse. |
| 6. Game modes | Partiel | Course rapide (avec bots) et contre-la-montre (sans bots) jouables. Bataille et Rocket Gol : configurés, arène sans gameplay. Grand Prix : coupes définies, pas d'enchaînement ni de points. |
| 7. UI / audio / VFX | Partiel | Menus, sélection, HUD réel, VFX de drift et turbo. Pas d'audio, pas de mini-carte en course, pas de particules (fumée, explosion). |
| 8. Multiplayer | Partiel | Local : jusqu'à 8 en écran partagé. Réseau : interface seulement, serveur Rust à l'état de squelette. |
| 16. Presets d'équilibrage | Absent | Un seul jeu de réglages ; les presets Arcade / Compétitif / Détente se brancheront sur `kartTuning.js`. |

Ordre conseillé pour la suite : écran de résultats (phase 2 du cahier), puis objets (phase 3), puis mécaniques de circuit.

## Tests

- Logique (navigateur, modules Vite) : drift intérieur / neutre / extérieur -> paliers 3 / 2 / 1 sans perte de vitesse ; turbo 1,32x ; 4 circuits x 8 karts jusqu'à l'arrivée sans NaN ; chocs latéral (lourd contre léger), côte à côte (aucun contact à 1,3 m), arrière (vitesses égalisées).
- En jeu : saut puis drift à gauche, charge stoppée hors-piste ; départ turbo (`start`, 0,7 s) ; feux 3/5 ; écran partagé 2 joueurs, positions réelles ; course complète en pilote automatique, bandeau « Arrivée », chrono figé, bras levés.
- Planche de rendu des 16 pilotes assis et des 4 gestes.
- `npm run check` (310 clés), `npm run build`, `cargo build` OK.

## Conformité règles d'or

- [x] Aucun dégradé linéaire
- [x] Aucun emoji ; icône `Zap` utile (jauge)
- [x] Tailwind uniquement (tokens `turbo-0..3`, style inline justifié pour la jauge)
- [x] Mouvement réduit : secousse et vibration coupées, gestes sans amorti
- [x] UI / 3D séparées (télémétrie, raceStore)
- [x] Rien d'une phase suivante
