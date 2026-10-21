import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import NavBar from './components/NavBar'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardPage from './pages/DashboardPage'
import TaskDetailsPage from './pages/TaskDetailsPage'
import EditTaskPage from './pages/EditTaskPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <BrowserRouter>
      <div className='min-vh-100'>
        <NavBar />
        <Container className='py-4 py-lg-5'>
          <Routes>
            {/* Pages accessibles seulement si on est connecté */}
            <Route path='/' element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path='/tasks/:id' element={<ProtectedRoute><TaskDetailsPage /></ProtectedRoute>} />
            <Route path='/tasks/:id/edit' element={<ProtectedRoute><EditTaskPage /></ProtectedRoute>} />
            <Route path='/profile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

            {/* Pages publiques */}
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='*' element={<NotFoundPage />} />
          </Routes>
        </Container>
      </div>
    </BrowserRouter>
  )
}

export default App
