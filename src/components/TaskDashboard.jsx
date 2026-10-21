import { useState, useEffect } from 'react'
import { Row, Col, ProgressBar, Alert, Spinner } from 'react-bootstrap'
import TaskForm from './TaskForm'
import TaskList from './TaskList'
import TaskFilter from './TaskFilter'
import { getTasks, createTask, deleteTask as deleteTaskApi } from '../services/services'
import { isOverdue } from '../utils/dates'

// Petite carte de statistique (Total / Terminées / En retard)
function StatCard({ label, value, accent }) {
    return (
        <div className={`stat-card stat-card--${accent}`}>
            <p className='stat-card__label'>{label}</p>
            <p className='stat-card__value'>{value}</p>
        </div>
    )
}

export default function TaskDashboard() {
    // Le state des tâches vit ici : il est partagé entre TaskForm et TaskList
    const [tasks, setTasks] = useState([])
    const [filter, setFilter] = useState('all')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Au premier rendu, on récupère les tâches depuis l'API
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await getTasks()
                setTasks(data)
            } catch (error) {
                console.log(error)
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchTasks()
    }, [])

    // Appelée par TaskForm quand le formulaire est valide
    const addTask = async (task) => {
        try {
            const newTask = await createTask(task)
            setTasks((current) => [...current, newTask])
            setError(null)
        } catch (error) {
            setError(error.message)
        }
    }

    // Appelée par TaskCard au clic sur le bouton de statut
    const toggleDone = (id) => {
        setTasks(tasks.map((task) =>
            task.id === id ? { ...task, done: !task.done } : task
        ))
    }

    // Appelée par TaskCard au clic sur la croix
    const deleteTask = async (id) => {
        try {
            await deleteTaskApi(id)
            // L'API ne supprime rien : c'est notre state qui retire la tâche de l'affichage
            setTasks((current) => current.filter((task) => task.id !== id))
            setError(null)
        } catch (error) {
            setError(error.message)
        }
    }

    const doneCount = tasks.filter((task) => task.done).length
    const overdueCount = tasks.filter(isOverdue).length
    const progress = tasks.length === 0 ? 0 : Math.round((doneCount / tasks.length) * 100)

    // On filtre selon le bouton choisi, puis on trie par échéance (la plus proche en premier)
    const visibleTasks = tasks
        .filter((task) => {
            if (filter === 'todo') return !task.done
            if (filter === 'done') return task.done
            return true
        })
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate))

    return (
        <>
            <header className='dashboard-header mb-4'>
                <p className='dashboard-header__eyebrow'>Tableau de bord</p>
                <h1 className='dashboard-header__title'>Mes tâches (API)</h1>
                <div className='d-flex align-items-center gap-3 mt-3'>
                    <ProgressBar now={progress} className='flex-grow-1' aria-label='Progression' />
                    <span className='fw-semibold'>{progress} %</span>
                </div>
            </header>
            {error && <Alert variant='danger'>{error}</Alert>}
            <Row className='g-3 mb-4'>
                <Col xs={4}>
                    <StatCard label='Tâches' value={tasks.length} accent='primary' />
                </Col>
                <Col xs={4}>
                    <StatCard label='Terminées' value={doneCount} accent='success' />
                </Col>
                <Col xs={4}>
                    <StatCard label='En retard' value={overdueCount} accent='danger' />
                </Col>
            </Row>
            <Row className='g-4'>
                <Col lg={4}>
                    <TaskForm onAddTask={addTask} />
                </Col>
                <Col lg={8}>
                    <div className='d-flex justify-content-between align-items-center mb-3'>
                        <h2 className='h5 mb-0'>Mes tâches</h2>
                        <TaskFilter value={filter} onChange={setFilter} />
                    </div>
                    {loading ? (
                        <div className='d-flex align-items-center gap-2 text-muted'>
                            <Spinner animation='border' size='sm' /> Chargement des tâches...
                        </div>
                    ) : (
                        <TaskList tasks={visibleTasks} onToggleDone={toggleDone} onDelete={deleteTask} />
                    )}
                </Col>
            </Row>
        </>
    )
}
