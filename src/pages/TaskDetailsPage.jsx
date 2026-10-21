import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Card, Badge, Button, Spinner } from 'react-bootstrap'
import { fetchTasks, toggleTaskStatus, removeTask } from '../features/tasksSlice'
import { priorityOptions } from '../data/priorityOptions'
import { formatDate, isOverdue } from '../utils/dates'

export default function TaskDetailsPage() {
    // L'id dans l'URL est du texte : on le transforme en nombre pour le comparer
    const { id } = useParams()
    const task = useSelector((state) => state.tasks.items.find((task) => task.id === Number(id)))
    const status = useSelector((state) => state.tasks.status)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // Si on arrive directement sur cette page (ou après un F5), les tâches ne sont pas encore chargées
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

    const priority = priorityOptions.find((option) => option.value === task.priority)

    const handleDelete = async () => {
        await dispatch(removeTask(task.id))
        navigate('/')
    }

    return (
        <>
            <Link to='/' className='d-inline-block mb-3'>← Retour au dashboard</Link>
            <Card className='details-card border-0'>
                <Card.Body className='p-4'>
                    <div className='d-flex gap-2 mb-3'>
                        <Badge bg={priority.variant}>Priorité {priority.label.toLowerCase()}</Badge>
                        <Badge bg={task.done ? 'success' : 'secondary'}>
                            {task.done ? 'Terminée' : 'En cours'}
                        </Badge>
                    </div>
                    <h1 className='h2'>{task.title}</h1>
                    <p className='text-muted'>{task.description}</p>
                    <p className={isOverdue(task) ? 'text-danger fw-semibold' : ''}>
                        📅 Échéance : {formatDate(task.dueDate)}{isOverdue(task) && ' · en retard'}
                    </p>
                    <p className='small text-muted'>Tâche n° {task.id}</p>
                    <div className='d-flex gap-2'>
                        <Button variant='outline-success' onClick={() => dispatch(toggleTaskStatus(task.id))}>
                            {task.done ? 'Remettre en cours' : 'Marquer comme terminée'}
                        </Button>
                        <Link to={`/tasks/${task.id}/edit`} className='btn btn-outline-primary'>
                            Modifier
                        </Link>
                        <Button variant='outline-danger' onClick={handleDelete}>
                            Supprimer
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </>
    )
}
