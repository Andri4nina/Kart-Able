# Parties en réseau local (LAN)

- **Type** : système + écrans + store + serveur
- **Fichiers** : `smkw-api/src/` (lib.rs, rooms.rs, protocol.rs, socket.rs), `smkw-ui/src/net/` (netClient.js, lanSession.js, netMatch.js, netRace.js, netBridge.js), `smkw-ui/src/stores/netStore.js`, `smkw-ui/src/game/race/remoteKart.js`, `raceRoster.js`, `raceWorld.js`, `kartMove.js`, `raceSession.js`, `raceFlow.js`, `lobbyReady.js`, `matchRules.js`, `smkw-ui/src/components/menu/OnlineMultiplayer.jsx`, `lan/LanServerForm.jsx`, `lan/LanRooms.jsx`, `lan/useLanLobbyPlayers.js`, `Lobby.jsx`, `LobbyFooter.jsx`, `LobbySummary.jsx`
- **Phase** : 3A

## Rôle

Plusieurs machines du même réseau jouent la même course : application de bureau et navigateur ensemble.

1. **Serveur** (`smkw-api`, Rust) : sert le jeu web et les salons (WebSocket `/ws`). L'application de bureau le lance d'office ; on peut aussi le lancer seul.
2. **Connexion** : Jouer, mode, **Réseau local**. Le jeu se connecte au serveur qui a servi la page (ou à l'adresse saisie, ex. `192.168.1.20:2567`), liste les salons, en crée un ou en rejoint un (liste ou code à 6 caractères).
3. **Joueurs** : chaque machine fait rejoindre ses joueurs (jusqu'à 8, écran partagé), qui choisissent personnage et véhicule ; l'hôte choisit le programme des circuits.
4. **Lobby commun** : les joueurs de toutes les machines, prêts ou non ; l'adresse à donner aux autres. L'hôte lance quand tout le salon est prêt.
5. **Course** : l'hôte compose la partie (joueurs P1..Pn de toutes les machines, pilotes ordinateur, graine commune) et l'envoie. Chaque machine simule ses joueurs ; l'hôte simule aussi les pilotes ordinateur ; 20 fois par seconde, chacune envoie l'état de ses karts, et les karts des autres glissent vers la dernière position reçue (prolongée par leur vitesse). Les courses suivantes (programme, vote, changement de circuit) sont décidées par l'hôte ; les autres attendent.

## Interface

- Protocole (JSON, champ `t`) : client `hello`, `list`, `create`, `join`, `leave`, `profile`, `phase`, `relay` ; serveur `welcome`, `rooms`, `room`, `closed`, `relay`, `error`. Messages de jeu relayés : `start` (partie), `karts` (états).
- `netStore` : `status`, `address`, `lanUrl`, `clientId`, `rooms`, `room`, `error`.
- Partie : `match.net` ({ hostId, clientId, host }), `match.remotes` (joueurs des autres machines) ; kart : `remote`, `net`.
- `GET /api/info` : version, adresse LAN.
- Sélecteurs : `#lan-address-input`, `#lan-connect-btn`, `#lan-status[data-status]`, `#lan-create-btn`, `[data-room]`, `#room-code-input`, `#lobby-start-btn`.

## Limites (version 1)

- Objets : chaque machine gère les siens (cases, tirs) ; leurs effets sur les karts des autres machines ne sont pas transmis.
- En réseau, la pause ne fige pas la course (les autres continuent) ; seul l'hôte peut changer de circuit.
- Le site public en https ne peut pas joindre une machine du réseau local : les joueurs web ouvrent l'adresse de l'hôte.
- Pas de compte, pas de partie par Internet (le serveur le permettrait derrière HTTPS : voir docs/HOSTING.md).

## Dépendances

Serveur : tokio, axum (HTTP + WebSocket), tower-http (fichiers), serde / serde_json, futures-util. Client : WebSocket du navigateur, aucune dépendance npm.

## Performance

Environ 32 karts x 23 nombres x 20 envois par seconde : quelques dizaines de ko/s par machine, négligeable en réseau local. Le serveur relaie sans calcul.

## Conformité règles d'or

- [x] Aucun dégradé linéaire ; aucun emoji ; icônes lucide utiles (Network, Server, Plug, Plus, LogIn, RefreshCw, Users)
- [x] Tailwind uniquement ; zone qui défile : `scrollbar-game`
- [x] Aucun texte en dur (`lan.*`, `online.join.*`) ; entrées par actions abstraites
- [x] Séparation : réseau dans `net/`, règles pures dans `game/`, l'UI lit les stores

## Évolutions prévues

Objets synchronisés, vote partagé, partie par Internet (serveur hébergé, wss), reconnexion.

## Jeu sur Internet (phase 3F)

- **Même protocole, même serveur** (`smkw-api`) que le réseau local. Seule l'adresse change :
  le serveur est public (Fly.io ou autre), joint en `wss://`.
- **Serveur en ligne** : la variable `SMKW_PUBLIC_URL` est définie.
  - `/api/info` renvoie `public` et n'annonce aucune adresse locale.
  - Le jeu passe alors en mode en ligne (`netStore.online`).
- **Salons privés** (`create { private: true }`) : absents de la liste, on les rejoint par leur
  code. Le jeu les crée ainsi dès qu'il est connecté à un serveur en ligne.
- **Limites** (`smkw-api/src/limits.rs`) :
  - 400 connexions, 100 salons ;
  - messages de 64 Ko au plus ;
  - un ping toutes les 20 s, pour que les proxys ne coupent pas un salon en attente.
- **Écran « En réseau »** (`OnlineMultiplayer`) :
  - carte « Sur Internet » (`OnlineServerCard`, bouton « Jouer en ligne ») ;
  - carte « Autre serveur » (adresse libre) ;
  - salons.
  - Sur le site public (https), si un serveur en ligne est configuré, on s'y connecte
    automatiquement ; sinon, on se connecte au serveur qui a servi la page.
- **Adresse saisie** (`netClient.toSocketUrl`) :
  - IP, `localhost`, nom de machine sans point ou `hôte:port` : réseau local, en `ws://`, port 2567 par défaut ;
  - nom de domaine ou `https://...` : serveur en ligne, en `wss://.../ws`.
- **Configuration** : `config/network.js` (`ONLINE_SERVER_URL` ← `VITE_ONLINE_SERVER_URL` au build).
- **Lobby** : l'invitation indique « Jouer en ligne » et le code du salon (`lan.lobby.inviteOnline`).

### Conformité règles d'or (ajouts 3F)

- [x] Textes par `t()` en fr, en, mg ; icône lucide `Globe` utile (Internet)
- [x] Réglages dans `config/network.js` ; aucune touche physique
- [x] Aucun dégradé, aucun emoji
