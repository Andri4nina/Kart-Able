# Phase 1I — Assignation des touches

**Statut** : terminée (2026-10-08)
**Demande** : « maintenant l'assignation des touches, tu peux faire marcher » : rendre fonctionnel l'onglet Contrôles des paramètres (jusqu'ici « bientôt »).

## Fait

- Onglet Contrôles : profils Clavier 1, Clavier 2, Manettes ; deux touches par action ; capture de la prochaine touche ou du prochain bouton ; retrait ; touches par défaut. Voir [key-bindings.md](../elements/key-bindings.md).
- Actions de course ajoutées à la couche d'entrée (accélérer, freiner, tourner, drift, objet) : réglables dès maintenant, utilisées en phase 2.
- Règles : touches réservées, pas de touche partagée entre les deux claviers, échange en cas de conflit, START obligatoire, réglages relus et nettoyés.
- La couche d'entrée lit l'assignation (claviers et manettes) ; toutes les aides à l'écran la suivent, avec les noms de la disposition réelle du clavier (ZQSD en AZERTY).
- Découpages : `inputManager.js` (manettes dans `gamepadPolling.js`), `SettingsDialog.jsx` (onglets dans `components/settings/`).

## Décisions

- Une disposition commune à toutes les manettes (comme les jeux de salon) ; le stick gauche dirige toujours.
- Une touche peut servir dans les menus et en course (contextes séparés), jamais pour deux actions du même contexte.

## Hors périmètre

Utilisation des actions de course (conduite, phase 2), sensibilité du stick, vibrations.

## Dépendances ajoutées

Aucune.
