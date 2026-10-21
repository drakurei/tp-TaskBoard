import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Card, Form, Button } from 'react-bootstrap'
import TaskInput from './TaskInput'
import TaskTextarea from './TaskTextarea'
import TaskSelect from './TaskSelect'
import TaskCheckbox from './TaskCheckbox'
import { priorityOptions } from '../data/priorityOptions'
import { todayISO } from '../utils/dates'
import { createTask } from '../features/tasksSlice'

const initialFormData = {
    title: '',
    description: '',
    priority: 'low',
    dueDate: '',
    done: false,
}

export default function TaskForm() {
    const dispatch = useDispatch()
    const [formData, setFormData] = useState(initialFormData)
    const [errors, setErrors] = useState({})

    // Un seul handler pour tous les champs, grâce à l'attribut name
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        })
    }

    const handleSubmit = (e) => {
        // On bloque le rechargement de la page
        e.preventDefault()

        // Contrôles : le titre et la description ne doivent pas être vides
        const newErrors = {}
        if (formData.title.trim() === '') {
            newErrors.title = 'Le titre est obligatoire'
        }
        if (formData.description.trim() === '') {
            newErrors.description = 'La description est obligatoire'
        }
        if (formData.dueDate === '') {
            newErrors.dueDate = "L'échéance est obligatoire"
        }

        setErrors(newErrors)

        // En cas d'erreur, on bloque la validation
        if (Object.keys(newErrors).length > 0) {
            return
        }

        // Pas d'erreur : on envoie la tâche au store (qui appelle l'API)
        dispatch(createTask({
            title: formData.title.trim(),
            description: formData.description.trim(),
            priority: formData.priority,
            dueDate: formData.dueDate,
            done: formData.done,
        }))

        // On vide le formulaire pour pouvoir créer une autre tâche
        setFormData(initialFormData)
    }

    return (
        <Card className='form-card border-0'>
            <Card.Body>
                <Card.Title className='mb-4'>
                    Nouvelle tâche
                </Card.Title>
                <Form onSubmit={handleSubmit} noValidate>
                    <TaskInput
                        label='Titre'
                        name='title'
                        placeholder='Saisir un titre'
                        value={formData.title}
                        onChange={handleChange}
                        error={errors.title}
                    />
                    <TaskTextarea
                        label='Description'
                        name='description'
                        placeholder='Saisir une description'
                        value={formData.description}
                        onChange={handleChange}
                        error={errors.description}
                    />
                    <TaskInput
                        type='date'
                        label='Échéance'
                        name='dueDate'
                        min={todayISO()}
                        value={formData.dueDate}
                        onChange={handleChange}
                        error={errors.dueDate}
                    />
                    <TaskSelect
                        label='Priorité'
                        name='priority'
                        options={priorityOptions}
                        value={formData.priority}
                        onChange={handleChange}
                    />
                    <TaskCheckbox
                        label='Déjà terminée'
                        name='done'
                        checked={formData.done}
                        onChange={handleChange}
                    />
                    <Button type='submit' variant='primary' className='w-100'>
                        Ajouter la tâche
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    )
}
