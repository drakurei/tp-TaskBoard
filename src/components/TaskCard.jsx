import { useDispatch } from 'react-redux'
import { Button, Badge } from 'react-bootstrap'
import { toggleTaskStatus, removeTask } from '../features/tasksSlice'
import { priorityOptions } from '../data/priorityOptions'
import { formatDate, isOverdue } from '../utils/dates'

export default function TaskCard({ task }) {
    const dispatch = useDispatch()

    // Retrouve l'option de priorité (label + couleur) à partir de sa valeur
    const priority = priorityOptions.find((option) => option.value === task.priority)
    const overdue = isOverdue(task)

    return (
        <article className={`task-card task-card--${priority.variant} ${task.done ? 'task-card--done' : ''}`}>
            <div className='d-flex justify-content-between align-items-start gap-2'>
                <h3 className='task-card__title'>{task.title}</h3>
                <button
                    type='button'
                    className='task-card__delete'
                    aria-label={`Supprimer « ${task.title} »`}
                    onClick={() => dispatch(removeTask(task.id))}
                >
                    ✕
                </button>
            </div>
            <p className='task-card__text'>{task.description}</p>
            <p className={`task-card__date ${overdue ? 'text-danger fw-semibold' : ''}`}>
                📅 {formatDate(task.dueDate)}{overdue && ' · en retard'}
            </p>
            <div className='d-flex justify-content-between align-items-center'>
                <Button
                    size='sm'
                    variant={task.done ? 'outline-success' : 'outline-secondary'}
                    onClick={() => dispatch(toggleTaskStatus(task.id))}
                >
                    {task.done ? '✓ Terminée' : 'Marquer comme terminée'}
                </Button>
                <Badge bg={priority.variant}>
                    {priority.label}
                </Badge>
            </div>
        </article>
    )
}
