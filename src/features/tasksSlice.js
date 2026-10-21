import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '../services/services'

// State de départ : la liste est vide, elle sera remplie par l'API
const initialState = {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    filter: 'all',  // 'all' | 'todo' | 'done'
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

        // Basculer En cours <-> Terminée : action.payload = id
        toggleTaskStatus: (state, action) => {
            const task = state.items.find((task) => task.id === action.payload)
            if (task) {
                task.done = !task.done
            }
        },

        // Changer le filtre : action.payload = 'all' | 'todo' | 'done'
        setFilter: (state, action) => {
            state.filter = action.payload
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
    },
})

export const { addTask, deleteTask, toggleTaskStatus, setFilter } = tasksSlice.actions

export default tasksSlice.reducer
