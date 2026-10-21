import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Row, Col, ProgressBar, Alert, Spinner } from 'react-bootstrap'
import TaskForm from './TaskForm'
import TaskList from './TaskList'
import TaskFilter from './TaskFilter'
import { fetchTasks } from '../features/tasksSlice'
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
    // Les tâches ne sont plus dans un useState : on les lit dans le store
    const tasks = useSelector((state) => state.tasks.items)
    const filter = useSelector((state) => state.tasks.filter)
    const status = useSelector((state) => state.tasks.status)
    const error = useSelector((state) => state.tasks.error)
    const dispatch = useDispatch()

    // Au premier rendu, on récupère les tâches depuis l'API
    useEffect(() => {
        dispatch(fetchTasks())
    }, [dispatch])

    const doneCount = tasks.filter((task) => task.done).length
    const overdueCount = tasks.filter(isOverdue).length
    const progress = tasks.length === 0 ? 0 : Math.round((doneCount / tasks.length) * 100)

    // On filtre selon le bouton choisi, puis on trie par échéance (la plus proche en premier)
    // [...tasks] : on fait une copie car sort() modifie le tableau et le state Redux est en lecture seule
    const visibleTasks = [...tasks]
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
                <h1 className='dashboard-header__title'>Mes tâches (Redux)</h1>
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
                    <TaskForm />
                </Col>
                <Col lg={8}>
                    <div className='d-flex justify-content-between align-items-center mb-3'>
                        <h2 className='h5 mb-0'>Mes tâches</h2>
                        <TaskFilter />
                    </div>
                    {status === 'loading' ? (
                        <div className='d-flex align-items-center gap-2 text-muted'>
                            <Spinner animation='border' size='sm' /> Chargement des tâches...
                        </div>
                    ) : (
                        <TaskList tasks={visibleTasks} />
                    )}
                </Col>
            </Row>
        </>
    )
}
