import { useSelector, useDispatch } from 'react-redux'
import { setFilter } from '../features/tasksSlice'

const filters = [
    { value: 'all', label: 'Toutes' },
    { value: 'todo', label: 'À faire' },
    { value: 'done', label: 'Terminées' },
]

export default function TaskFilter() {
    const value = useSelector((state) => state.tasks.filter)
    const dispatch = useDispatch()

    return (
        <div className='task-filter' role='group' aria-label='Filtrer les tâches'>
            { filters.map((filter) => (
                <button
                    key={filter.value}
                    type='button'
                    className={filter.value === value ? 'active' : ''}
                    aria-pressed={filter.value === value}
                    onClick={() => dispatch(setFilter(filter.value))}
                >
                    {filter.label}
                </button>
            )) }
        </div>
    )
}
