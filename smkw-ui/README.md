# smkw-ui

Frontend de Kart Able (code SMKW) : React + Vite + React Three Fiber + Tailwind CSS + Motion + Zustand.

```
npm install
npm run dev          # http://localhost:5173
npm run check        # oxlint + règles d'or + i18n
npm run check:i18n   # clés des langues, variables, texte en dur
npm run build        # dist/
npm run preview      # sert dist/ (ajouter ?test pour activer les hooks de test)
```

Contrôles du menu : flèches naviguer, `Enter` valider, `Escape` retour / fermer, `F` plein écran.
Langues : `src/locales/` (fr, en, mg). Ajouter une langue = ajouter un fichier JSON.

Documentation : [../docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md), [../docs/REGLES_D_OR.md](../docs/REGLES_D_OR.md), [../docs/TESTING.md](../docs/TESTING.md).
