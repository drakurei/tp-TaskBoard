# TODO / Journal des bugs

## Fait

- [x] Création du store (`src/app/store.js`)
- [x] Slice `tasks` : `initialState`, `addTask`, `deleteTask`, `createTask`, `toggleTaskStatus`, `setFilter`, `changePriority`
- [x] `Provider` dans `main.jsx`
- [x] Components branchés sur le store (`useSelector` / `useDispatch`)
- [x] Filtre par statut **et** par priorité
- [x] Inscription / connexion / déconnexion
- [x] Dashboard accessible seulement si on est connecté
- [x] Page détails d'une tâche (router)
- [x] Page profil
- [x] Modification d'une tâche

## Bugs rencontrés et comment on les a résolus

### 1. Les tâches étaient chargées deux fois au démarrage

**Problème :** en mode dev, `<StrictMode>` lance les `useEffect` deux fois. Du coup `fetchTasks()` partait deux fois vers l'API (on le voit dans l'onglet Réseau). Pire : en revenant sur le dashboard depuis la page détails, les tâches étaient rechargées et **les tâches qu'on avait ajoutées ou supprimées revenaient comme avant**.

**Pourquoi :** le `useEffect` du dashboard appelle `fetchTasks()` à chaque fois que le component s'affiche.

**Solution :** on a ajouté une option `condition` dans le `createAsyncThunk` : le thunk ne se lance que si `state.tasks.status === 'idle'`. Le premier appel passe le status à `'loading'`, donc le deuxième est ignoré.

### 2. `sort()` sur le state Redux (piège évité)

**Problème :** dans l'ancien dashboard on faisait `tasks.filter(...).sort(...)`. Si on enlève le `filter`, `tasks.sort(...)` sur le state Redux donne l'erreur `Cannot assign to read only property`.

**Pourquoi :** `sort()` modifie le tableau d'origine, et le state Redux est en lecture seule (gelé par Redux Toolkit).

**Solution :** on fait une copie avant de trier (`[...tasks]` ou `.filter()` qui renvoie déjà un nouveau tableau). Maintenant c'est fait dans le selector `selectVisibleTasks` avec `createSelector`.

### 3. `Cannot read properties of undefined (reading 'user')`

**Problème :** la `NavBar` plantait (page blanche) en ajoutant la connexion.

**Pourquoi :** on avait créé `authSlice.js` mais on avait oublié de l'ajouter dans `configureStore`. Donc `state.auth` n'existait pas et `state.auth.user` plantait.

**Solution :** ajouter `auth: authReducer` dans le `reducer` du store.

### 4. Profil : « 0 / 0 tâches » après un F5

**Problème :** en rechargeant la page `/profile` (ou en y allant directement), le compteur de tâches affichait 0.

**Pourquoi :** les tâches sont chargées par le dashboard. Si on n'est pas passé par le dashboard, le store est vide.

**Solution :** on fait aussi `dispatch(fetchTasks())` dans la page profil, la page détails et la page modification. Grâce au fix n°1, ça ne recharge pas si c'est déjà fait.

### 5. Page détails : comparer l'id de l'URL (piège évité)

**Problème :** sans conversion, `/tasks/3` afficherait « Cette tâche n'existe pas ».

**Pourquoi :** `useParams()` renvoie toujours du texte (`'3'`) alors que nos ids sont des nombres (`3`). Et `'3' === 3` est faux.

**Solution :** `Number(id)` avant de comparer.

### 6. Erreur 500 en modifiant une tâche qu'on a créée

**Problème :** modifier une tâche ajoutée avec le formulaire affichait « Erreur lors de la modification de la tâche ».

**Pourquoi :** JSONPlaceholder ne sauvegarde rien. Il ne connaît que les tâches 1 à 200. Nos tâches créées ont un id `Date.now()` et un `PUT /todos/1792...` répond **500**.

**Solution :** dans `services.js`, si l'id est plus grand que 200 on n'appelle pas l'API et on garde la modification seulement dans le store.

### 7. Toutes les nouvelles tâches avaient le même id (déjà réglé dans Dashboard-api)

**Problème :** l'API répond toujours `id: 201` au `POST`, donc deux tâches ajoutées avaient la même `key` dans la liste (warning React) et supprimer l'une supprimait les deux.

**Solution :** on génère notre propre id avec `Date.now()` après la réponse de l'API.

### 8. Dashboard visible sans être connecté

**Solution :** component `ProtectedRoute` qui redirige vers `/login` avec `<Navigate>` si `state.auth.user` est vide. L'utilisateur connecté est gardé dans le `localStorage` pour ne pas être déconnecté après un F5.

## À faire plus tard

- [ ] Vrai back-end pour les comptes (là les mots de passe sont en clair dans le localStorage, ce n'est pas sécurisé)
- [ ] Garder les tâches de chaque utilisateur séparément
- [ ] Sauvegarder les tâches dans le localStorage (l'API ne garde rien)
