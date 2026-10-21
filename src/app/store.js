import { configureStore } from '@reduxjs/toolkit'
import tasksReducer from '../features/tasksSlice'
import authReducer from '../features/authSlice'

// Le store centralise le state global de l'application
export const store = configureStore({
    reducer: {
        // state.tasks sera géré par le tasksSlice
        tasks: tasksReducer,
        // state.auth sera géré par le authSlice
        auth: authReducer,
    },
})
