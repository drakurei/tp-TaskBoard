import { Row, Col } from 'react-bootstrap'
import TaskCard from './TaskCard'

export default function TaskList({ tasks }) {
    if (tasks.length === 0) {
        return <p className='text-muted'>Aucune tâche ici pour le moment.</p>
    }

    return (
        <Row className='g-3'>
            { tasks.map((task) => (
                <Col md={6} key={task.id}>
                    <TaskCard task={task} />
                </Col>
            )) }
        </Row>
    )
}
