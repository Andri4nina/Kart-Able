# Composants de menu réutilisables

- **Type** : composants UI
- **Fichiers** : `src/components/menu/MenuButton.jsx`, `SettingsButton.jsx`, `BackButton.jsx`, `MenuPage.jsx`, `MenuStepper.jsx`, `CapacityBanner.jsx` (`CapacityBanner`, `Notice`)
- **Phase** : 1B (menu)

| Composant | Props | Rôle |
| --- | --- | --- |
| `MenuButton` | `variant` (`hero` / `default`), `icon`, `label`, `description`, `badge`, `disabled` | Entrée de menu parallélogramme. `hero` = gros bouton principal (ombre jaune). Désactivé : cadenas + badge, pas de survol. `data-nav-item` pour les flèches. |
| `SettingsButton` | `variant` (`menu` / `icon`), `id` | Ouvre l'overlay Paramètres depuis n'importe quel écran (menu, pages, HUD). |
| `BackButton` | — | `navigationStore.back()`. Libellé masqué sur mobile (icône seule, `aria-label` traduit). |
| `MenuPage` | `step`, `eyebrow`, `title`, `subtitle`, `footer`, `children` | Gabarit des écrans du parcours : en-tête (retour, titre, étapes, réglages), contenu défilant, actions en bas. Glissement selon le sens de navigation, apparition séquentielle des blocs. Voile uni `bg-brand-ink/35` sur la scène. |
| `MenuStepper` | `current` | Mode, Type, Joueurs / Connexion, Lobby (libellé selon local / réseau). Visible à partir de `lg`. |
| `CapacityBanner` | `icon`, `label`, `counter` | Bandeau jaune très lisible : « Jusqu'à 8 joueurs » + compteur. |
| `Notice` | `icon`, `children` | Message non bloquant (serveur non connecté, info). |

## Feedback

- Survol : montée légère, décalage, ombre qui s'allonge ou devient rouge (Tailwind, derrière `motion-ok:`).
- Clic : enfoncement (`active:scale`, ombre raccourcie).
- Focus clavier : anneau jaune `focus-visible:ring-4`.

## Conformité règles d'or

- [x] Aucun dégradé linéaire (ombres pleines, voile uni)
- [x] Aucun emoji ; icônes lucide-react porteuses de sens
- [x] Tailwind uniquement
- [x] Micro-interactions Tailwind, transitions Motion
- [x] Tous les libellés reçus déjà traduits ou via `t()`
- [x] Rien d'une phase suivante
