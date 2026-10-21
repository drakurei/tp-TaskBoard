import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { selectUser } from '../features/authSlice'

// Entoure les pages réservées aux utilisateurs connectés
export default function ProtectedRoute({ children }) {
    const user = useSelector(selectUser)

    // Pas connecté : on redirige vers la page de connexion
    if (!user) {
        return <Navigate to='/login' replace />
    }

    return children
}
