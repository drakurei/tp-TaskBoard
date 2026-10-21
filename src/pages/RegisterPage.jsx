import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, Navigate } from 'react-router-dom'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import TaskInput from '../components/TaskInput'
import { register, clearAuthError, selectUser, selectAuthError } from '../features/authSlice'

const initialFormData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
}

export default function RegisterPage() {
    const [formData, setFormData] = useState(initialFormData)
    const [errors, setErrors] = useState({})
    const user = useSelector(selectUser)
    const authError = useSelector(selectAuthError)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(clearAuthError())
    }, [dispatch])

    // Une fois inscrit (donc connecté), on part sur le dashboard
    if (user) {
        return <Navigate to='/' replace />
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const newErrors = {}
        if (formData.name.trim() === '') {
            newErrors.name = 'Le nom est obligatoire'
        }
        if (!formData.email.includes('@')) {
            newErrors.email = "L'email n'est pas valide"
        }
        if (formData.password.length < 6) {
            newErrors.password = 'Le mot de passe doit faire au moins 6 caractères'
        }
        if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
        }
        setErrors(newErrors)

        if (Object.keys(newErrors).length > 0) {
            return
        }

        dispatch(register({
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
        }))
    }

    return (
        <Card className='auth-card border-0 mx-auto'>
            <Card.Body className='p-4'>
                <Card.Title className='mb-4'>Inscription</Card.Title>
                {authError && <Alert variant='danger'>{authError}</Alert>}
                <Form onSubmit={handleSubmit} noValidate>
                    <TaskInput
                        label='Nom'
                        name='name'
                        placeholder='Votre nom'
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                    />
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
                    <TaskInput
                        type='password'
                        label='Confirmer le mot de passe'
                        name='confirmPassword'
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={errors.confirmPassword}
                    />
                    <Button type='submit' className='w-100 mb-3'>Créer mon compte</Button>
                </Form>
                <p className='text-center small mb-0'>
                    Déjà un compte ? <Link to='/login'>Se connecter</Link>
                </p>
            </Card.Body>
        </Card>
    )
}
