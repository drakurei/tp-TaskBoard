import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, Navigate } from 'react-router-dom'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import TaskInput from '../components/TaskInput'
import { login, clearAuthError, selectUser, selectAuthError } from '../features/authSlice'

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [errors, setErrors] = useState({})
    const user = useSelector(selectUser)
    const authError = useSelector(selectAuthError)
    const dispatch = useDispatch()

    // On efface l'ancienne erreur en arrivant sur la page
    useEffect(() => {
        dispatch(clearAuthError())
    }, [dispatch])

    // Déjà connecté : direction le dashboard
    if (user) {
        return <Navigate to='/' replace />
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const newErrors = {}
        if (formData.email.trim() === '') {
            newErrors.email = "L'email est obligatoire"
        }
        if (formData.password === '') {
            newErrors.password = 'Le mot de passe est obligatoire'
        }
        setErrors(newErrors)

        if (Object.keys(newErrors).length > 0) {
            return
        }

        dispatch(login({ email: formData.email.trim(), password: formData.password }))
    }

    return (
        <Card className='auth-card border-0 mx-auto'>
            <Card.Body className='p-4'>
                <Card.Title className='mb-4'>Connexion</Card.Title>
                {authError && <Alert variant='danger'>{authError}</Alert>}
                <Form onSubmit={handleSubmit} noValidate>
                    <TaskInput
                        type='email'
                        label='Email'
                        name='email'
                        placeholder='exemple@mail.fr'
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                    />
                    <TaskInput
                        type='password'
                        label='Mot de passe'
                        name='password'
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                    />
                    <Button type='submit' className='w-100 mb-3'>Se connecter</Button>
                </Form>
                <p className='text-center small mb-0'>
                    Pas encore de compte ? <Link to='/register'>Créer un compte</Link>
                </p>
            </Card.Body>
        </Card>
    )
}
