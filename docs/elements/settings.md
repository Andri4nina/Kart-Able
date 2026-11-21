# Paramètres (SettingsDialog + settingsStore)

- **Type** : écran overlay + store
- **Fichiers** : `src/components/screens/SettingsDialog.jsx`, `src/stores/settingsStore.js`, `src/components/menu/SettingsButton.jsx`
- **Phase** : 1, onglets et langue ajoutés en 1B

## Onglets (ordre du menu Paramètres)

| Onglet | Contenu | Statut |
| --- | --- | --- |
| Langue | `LanguageList` (fr / en / mg), changement immédiat et mémorisé | Actif |
| Audio | « Cette section arrive bientôt » | Bientôt |
| Graphismes | Qualité (Basse / Moyenne / Haute = dpr 1 / 1,5 / 2), Animations (Système / Réduites / Complètes), Champ de vision 55 à 85 | Actif |
| Contrôles | Assignation des touches par profil (Clavier 1, Clavier 2, Manettes), voir [key-bindings.md](key-bindings.md) | Oui |

Indicateur d'onglet partagé (`layoutId`), contenu en fondu court. Flèches pour changer d'onglet (le focus active l'onglet). Pendant l'ouverture, les entrées joueurs (START, flèches...) sont ignorées.

## Interface

- Ouverture : `SettingsButton` partout (`#settings-btn` menu, `#settings-icon-btn` pages, `#hud-settings-btn` jeu, qui met le chrono en pause).
- Fermeture : `#settings-done-btn`, X (focus initial), clic sur le fond, `Échap`.
- `role="dialog"`, `aria-modal`, `role="tablist"` / `tab` / `tabpanel`. Onglets : `#settings-tab-<id>`.

## Persistance

`settingsStore` (clé `smkw-settings`) : `quality`, `motion`, `fov`, setters validés (`QUALITY_LEVELS`, `MOTION_MODES`). La langue est dans `localeStore` (clé `smkw-locale`).

## Conformité règles d'or

- [x] Aucun dégradé linéaire
- [x] Aucun emoji ; icônes Settings, X, Check, Languages, Volume2, MonitorCog, Gamepad2, Wind, Scan
- [x] Tailwind uniquement (`accent-brand-red` pour le slider natif)
- [x] Ouverture / fermeture Motion courtes
- [x] Libellés des options traduits (`settings.graphics.<valeur>`)
- [x] Rien d'une phase suivante (Audio seulement annoncé)

## Évolutions prévues

Audio (volumes) quand le son arrivera. Panneaux dans `components/settings/` (un fichier par onglet, barre d'onglets `SettingsTabs`).
