import { useSelector, useDispatch } from 'react-redux'
import { setFilter, selectFilter } from '../features/tasksSlice'
import { priorityOptions } from '../data/priorityOptions'

const statusFilters = [
    { value: 'all', label: 'Toutes' },
    { value: 'todo', label: 'En cours' },
    { value: 'done', label: 'Terminées' },
]

// On ajoute "Toutes" devant les priorités existantes
const priorityFilters = [{ value: 'all', label: 'Toutes' }, ...priorityOptions]

// Un groupe de boutons (réutilisé pour le statut et pour la priorité)
function FilterGroup({ label, filters, value, onChange }) {
    return (
        <div className='task-filter' role='group' aria-label={label}>
            { filters.map((filter) => (
                <button
                    key={filter.value}
                    type='button'
                    className={filter.value === value ? 'active' : ''}
                    aria-pressed={filter.value === value}
                    onClick={() => onChange(filter.value)}
                >
                    {filter.label}
                </button>
            )) }
        </div>
    )
}

export default function TaskFilter() {
    const filter = useSelector(selectFilter)
    const dispatch = useDispatch()

    return (
        <div className='d-flex flex-wrap gap-2'>
            <FilterGroup
                label='Filtrer par statut'
                filters={statusFilters}
                value={filter.status}
                onChange={(status) => dispatch(setFilter({ status }))}
            />
            <FilterGroup
                label='Filtrer par priorité'
                filters={priorityFilters}
                value={filter.priority}
                onChange={(priority) => dispatch(setFilter({ priority }))}
            />
        </div>
    )
}
