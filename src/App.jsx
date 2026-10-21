import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import NavBar from './components/NavBar'
import DashboardPage from './pages/DashboardPage'
import TaskDetailsPage from './pages/TaskDetailsPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <BrowserRouter>
      <div className='min-vh-100'>
        <NavBar />
        <Container className='py-4 py-lg-5'>
          <Routes>
            <Route path='/' element={<DashboardPage />} />
            <Route path='/tasks/:id' element={<TaskDetailsPage />} />
            <Route path='*' element={<NotFoundPage />} />
          </Routes>
        </Container>
      </div>
    </BrowserRouter>
  )
}

export default App
