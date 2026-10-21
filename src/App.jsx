import { Container } from 'react-bootstrap'
import TaskDashboard from './components/TaskDashboard'

function App() {
  return (
    <div className='min-vh-100'>
      <Container className='py-4 py-lg-5'>
        <TaskDashboard />
      </Container>
    </div>
  )
}

export default App
