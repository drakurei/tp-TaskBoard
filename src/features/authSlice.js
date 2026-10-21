import { createSlice } from '@reduxjs/toolkit'

// ⚠️ Pas de vrai back-end : les comptes sont gardés dans le localStorage du navigateur.
// C'est suffisant pour l'exercice mais ce n'est PAS sécurisé (mot de passe en clair).
const USERS_KEY = 'users'
const CURRENT_USER_KEY = 'currentUser'

function loadUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || []
}

// Au démarrage, on récupère l'utilisateur connecté (pour ne pas être déconnecté après un F5)
const initialState = {
    user: JSON.parse(localStorage.getItem(CURRENT_USER_KEY)),
    error: null,
}

// On ne garde jamais le mot de passe dans le state
function withoutPassword(user) {
    const { password, ...rest } = user
    return rest
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Inscription : action.payload = { name, email, password }
        register: (state, action) => {
            const users = loadUsers()
            const email = action.payload.email.toLowerCase()

            if (users.some((user) => user.email === email)) {
                state.error = 'Un compte existe déjà avec cet email'
                return
            }

            const newUser = { ...action.payload, email, id: Date.now(), createdAt: new Date().toISOString() }
            localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]))

            // Après l'inscription, l'utilisateur est directement connecté
            state.user = withoutPassword(newUser)
            state.error = null
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(state.user))
        },

        // Connexion : action.payload = { email, password }
        login: (state, action) => {
            const email = action.payload.email.toLowerCase()
            const user = loadUsers().find((user) =>
                user.email === email && user.password === action.payload.password
            )

            if (!user) {
                state.error = 'Email ou mot de passe incorrect'
                return
            }

            state.user = withoutPassword(user)
            state.error = null
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(state.user))
        },

        // Déconnexion
        logout: (state) => {
            state.user = null
            localStorage.removeItem(CURRENT_USER_KEY)
        },

        // Effacer le message d'erreur (quand on arrive sur la page de connexion par exemple)
        clearAuthError: (state) => {
            state.error = null
        },
    },
})

export const { register, login, logout, clearAuthError } = authSlice.actions

export default authSlice.reducer

export const selectUser = (state) => state.auth.user
export const selectAuthError = (state) => state.auth.error
