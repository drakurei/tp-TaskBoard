import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import * as api from '../services/services'

// State de départ : la liste est vide, elle sera remplie par l'API
const initialState = {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    filter: {
        status: 'all',   // 'all' | 'todo' | 'done'
        priority: 'all', // 'all' | 'low' | 'medium' | 'high'
    },
}

// ===== Actions asynchrones (appels à l'API) =====

// GET : récupère les tâches
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
    return await api.getTasks()
}, {
    // On ne charge qu'une seule fois : sinon le StrictMode (et chaque retour sur le dashboard)
    // relançait l'appel et écrasait les tâches ajoutées / supprimées
    condition: (_, { getState }) => getState().tasks.status === 'idle',
})

// POST : crée la tâche côté API puis l'ajoute dans le store avec addTask
export const createTask = createAsyncThunk('tasks/createTask', async (task, { dispatch }) => {
    const newTask = await api.createTask(task)
    dispatch(addTask(newTask))
    return newTask
})

// DELETE : supprime la tâche côté API puis la retire du store avec deleteTask
export const removeTask = createAsyncThunk('tasks/removeTask', async (id, { dispatch }) => {
    await api.deleteTask(id)
    dispatch(deleteTask(id))
    return id
})

// PUT : modifie la tâche côté API puis dans le store avec updateTask
export const editTask = createAsyncThunk('tasks/editTask', async (task, { dispatch }) => {
    const updatedTask = await api.updateTask(task)
    dispatch(updateTask(updatedTask))
    return updatedTask
})

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        // Ajouter une tâche : action.payload = la tâche
        // Grâce à Immer, on peut "muter" le state directement
        addTask: (state, action) => {
            state.items.push(action.payload)
        },

        // Supprimer une tâche : action.payload = id
        deleteTask: (state, action) => {
            state.items = state.items.filter((task) => task.id !== action.payload)
        },

        // Modifier une tâche : action.payload = la tâche complète (avec son id)
        updateTask: (state, action) => {
            const index = state.items.findIndex((task) => task.id === action.payload.id)
            if (index !== -1) {
                state.items[index] = action.payload
            }
        },

        // Basculer En cours <-> Terminée : action.payload = id
        toggleTaskStatus: (state, action) => {
            const task = state.items.find((task) => task.id === action.payload)
            if (task) {
                task.done = !task.done
            }
        },

        // Modifier un ou plusieurs filtres : action.payload = { status } et/ou { priority }
        // Les deux filtres se cumulent (statut ET priorité)
        setFilter: (state, action) => {
            state.filter = { ...state.filter, ...action.payload }
        },

        // Changer la priorité d'une tâche : action.payload = { id, priority }
        changePriority: (state, action) => {
            const { id, priority } = action.payload
            const task = state.items.find((task) => task.id === id)
            if (task) {
                task.priority = priority
            }
        },
    },
    // Réactions aux actions asynchrones (pending / fulfilled / rejected)
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.items = action.payload
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(createTask.fulfilled, (state) => {
                state.error = null
            })
            .addCase(createTask.rejected, (state, action) => {
                state.error = action.error.message
            })
            .addCase(removeTask.fulfilled, (state) => {
                state.error = null
            })
            .addCase(removeTask.rejected, (state, action) => {
                state.error = action.error.message
            })
            .addCase(editTask.fulfilled, (state) => {
                state.error = null
            })
            .addCase(editTask.rejected, (state, action) => {
                state.error = action.error.message
            })
    },
})

export const { addTask, deleteTask, updateTask, toggleTaskStatus, setFilter, changePriority } = tasksSlice.actions

export default tasksSlice.reducer

// ===== Selectors : lire le state depuis les components avec useSelector() =====
export const selectTasks = (state) => state.tasks.items
export const selectFilter = (state) => state.tasks.filter

// Tâches filtrées (statut ET priorité) puis triées par échéance
// createSelector mémorise le résultat : on ne recalcule que si items ou filter changent
export const selectVisibleTasks = createSelector(
    [selectTasks, selectFilter],
    (tasks, { status, priority }) => tasks
        .filter((task) => {
            if (status === 'todo') return !task.done
            if (status === 'done') return task.done
            return true
        })
        .filter((task) => priority === 'all' || task.priority === priority)
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
)
