# dashboard-redux-api

Dashboard de gestion de tâches en React, avec Redux Toolkit et l'API de test [JSONPlaceholder](https://jsonplaceholder.typicode.com/).

**Démo :** https://drakurei.github.io/tp-TaskBoard/

## Fonctionnalités

- Chargement des tâches depuis l'API (`GET`)
- Ajouter (`POST`), supprimer (`DELETE`) et modifier (`PUT`) une tâche
- Passer une tâche de « En cours » à « Terminée »
- Changer la priorité d'une tâche
- Filtrer par statut **et** par priorité
- Inscription / connexion / déconnexion
- Dashboard réservé aux utilisateurs connectés
- Page détails d'une tâche, page modification, page profil

## Stack

- React + Vite
- Redux Toolkit / React Redux
- React Router
- React Bootstrap

## Organisation

- `src/app/store.js` : création du store
- `src/features/tasksSlice.js` : state des tâches, actions, appels API (`createAsyncThunk`) et selectors
- `src/features/authSlice.js` : inscription, connexion, déconnexion
- `src/services/services.js` : les `fetch` vers l'API
- `src/pages/` : les pages du router
- `src/components/` : les components réutilisables

## Pages

| URL | Page |
| --- | --- |
| `/login` | Connexion |
| `/register` | Inscription |
| `/` | Dashboard (connecté) |
| `/tasks/:id` | Détails d'une tâche (connecté) |
| `/tasks/:id/edit` | Modifier une tâche (connecté) |
| `/profile` | Profil (connecté) |

## Lancer le projet

```bash
npm install
npm run dev
```

Les bugs rencontrés et leurs solutions sont dans [TODO.md](TODO.md).

## Déployer

```bash
npm run deploy
```
