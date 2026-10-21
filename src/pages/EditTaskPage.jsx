import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Spinner } from 'react-bootstrap'
import TaskForm from '../components/TaskForm'
import { fetchTasks } from '../features/tasksSlice'

export default function EditTaskPage() {
    const { id } = useParams()
    const task = useSelector((state) => state.tasks.items.find((task) => task.id === Number(id)))
    const status = useSelector((state) => state.tasks.status)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(fetchTasks())
    }, [dispatch])

    if (status === 'idle' || status === 'loading') {
        return (
            <div className='d-flex align-items-center gap-2 text-muted'>
                <Spinner animation='border' size='sm' /> Chargement de la tâche...
            </div>
        )
    }

    if (!task) {
        return (
            <div>
                <p>Cette tâche n'existe pas.</p>
                <Link to='/'>← Retour au dashboard</Link>
            </div>
        )
    }

    return (
        <>
            <Link to={`/tasks/${task.id}`} className='d-inline-block mb-3'>← Retour à la tâche</Link>
            <div className='edit-form'>
                {/* On réutilise le même formulaire que pour la création */}
                <TaskForm task={task} onSaved={() => navigate(`/tasks/${task.id}`)} />
            </div>
        </>
    )
}
