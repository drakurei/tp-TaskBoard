import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card, Row, Col, Button } from 'react-bootstrap'
import { logout, selectUser } from '../features/authSlice'
import { fetchTasks, selectTasks } from '../features/tasksSlice'

export default function ProfilePage() {
    const user = useSelector(selectUser)
    const tasks = useSelector(selectTasks)
    const dispatch = useDispatch()

    // Si on arrive directement sur le profil, les tâches ne sont pas encore chargées
    useEffect(() => {
        dispatch(fetchTasks())
    }, [dispatch])

    const doneCount = tasks.filter((task) => task.done).length

    return (
        <Card className='details-card border-0'>
            <Card.Body className='p-4'>
                <div className='d-flex align-items-center gap-3 mb-4'>
                    {/* Avatar : la première lettre du nom */}
                    <div className='profile-avatar'>{user.name.charAt(0).toUpperCase()}</div>
                    <div>
                        <h1 className='h3 mb-0'>{user.name}</h1>
                        <p className='text-muted mb-0'>{user.email}</p>
                    </div>
                </div>
                <Row className='mb-4'>
                    <Col xs={6}>
                        <p className='stat-card__label'>Membre depuis le</p>
                        <p className='fw-semibold'>{new Date(user.createdAt).toLocaleDateString('fr-FR')}</p>
                    </Col>
                    <Col xs={6}>
                        <p className='stat-card__label'>Tâches terminées</p>
                        <p className='fw-semibold'>{doneCount} / {tasks.length}</p>
                    </Col>
                </Row>
                <Button variant='outline-danger' onClick={() => dispatch(logout())}>
                    Se déconnecter
                </Button>
            </Card.Body>
        </Card>
    )
}
