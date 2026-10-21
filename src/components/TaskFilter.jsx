const filters = [
    { value: 'all', label: 'Toutes' },
    { value: 'todo', label: 'À faire' },
    { value: 'done', label: 'Terminées' },
]

export default function TaskFilter({ value, onChange }) {
    return (
        <div className='task-filter' role='group' aria-label='Filtrer les tâches'>
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
