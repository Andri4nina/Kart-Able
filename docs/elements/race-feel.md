# Sensations de course : aspiration, faux départ, annonces, cylindrées

- **Type** : système + composants UI + effets 3D
- **Fichiers** : `smkw-ui/src/config/raceFeel.js`, `config/kartTuning.js` (`BOOSTS.draft`), `game/race/kartDraft.js`, `game/race/startLights.js` (`trackStartPress`, `resolveStart`), `components/screens/race/StartCountdown.jsx`, `game/race/raceControls.js`, `game/race/raceKart.js`, `game/race/kartStats.js` (`scaleKartStats`), `game/race/racePublish.js`, `game/matchConfig.js` (`speedClass`), `stores/settingsStore.js`, `components/ui/hud/RaceCallout.jsx`, `DraftGauge.jsx`, `PositionBadge.jsx`, `components/settings/RacePanel.jsx`, `components3d/Effects/draftEmitters.js`, `components3d/Camera/chaseCamera.js` (`getChaseFovKick`)
- **Phase** : 3B

## Rôle

Rendre les courses plus vivantes, d'après les mécaniques du kart arcade de référence (console de salon) :
- **Aspiration** : rouler 2 s dans le sillage d'un kart (en ligne droite, sans drift, à plus de 70 % de sa vitesse max) déclenche un turbo. Ensuite, 4 s avant de pouvoir recharger. Filets de vent autour du kart et jauge « Aspiration » dans le HUD. Les pilotes ordinateur en profitent aussi : le peloton se dépasse.
- **Départ** (3C) : compte à rebours 3, 2, 1, « Partez ! ». Accélérer pendant le « 3 » et tenir jusqu'au départ = départ turbo ; accélérer avant le « 3 » et tenir = moteur calé 1 s (« Faux départ ») ; pendant le « 2 » ou le « 1 » = départ normal. Les meilleurs pilotes ordinateur partent en turbo.
- **Annonces** : « Tour 2 », « Dernier tour ! », « Sens interdit » (contresens pendant 0,8 s).
- **Place** : le chiffre de la place rebondit à chaque changement.
- **Vitesse** : en turbo, le champ de vision s'ouvre de 9 degrés et la caméra recule un peu. Désactivé en mouvement réduit.
- **Cylindrées** 50 / 100 / 150 cc (Paramètres, onglet Course) : vitesse de pointe, accélération et niveau des pilotes ordinateur. Elle est enregistrée dans la partie (`match.speedClass`) ; en réseau local, c'est celle de l'hôte.

## Interface

- `raceStore.standings[id]` : `wrongWay`, `stalled` ; télémétrie : `draft` (0..1).
- Kart : `draft`, `drafting`, `draftCooldown`, `wrongWay`, `falseStart`, `stall`.
- Sélecteurs : `[data-callout]` (`newLap`, `finalLap`, `wrongWay`, `falseStart`), `[data-hud=draft]`, `#settings-tab-race`.

## Performance

L'aspiration est vérifiée une fois par frame, pour tous les karts contre tous (32 x 31 tests simples). Aucun re-render par frame : la jauge est lue en transitoire, et les annonces changent seulement quand l'état change.

## Conformité règles d'or

- [x] Aucun dégradé linéaire
- [x] Aucun emoji ; icônes lucide utiles (Wind, Flag, RotateCcw, OctagonAlert, CircleAlert, Gauge)
- [x] Tailwind uniquement (styles inline justifiés : jauge haute fréquence)
- [x] Animations : Motion, courtes ; mouvement réduit respecté (MotionConfig, champ de vision fixe)
- [x] Séparation UI / état / 3D respectée (game/ pur, UI par les stores)
- [x] Rien d'une phase suivante (objets inchangés, en attente des objets fournis)

## Évolutions prévues

Sons (moteur calé, aspiration, dernier tour), mode miroir, regard arrière.
