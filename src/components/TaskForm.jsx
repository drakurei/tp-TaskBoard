import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Card, Form, Button } from 'react-bootstrap'
import TaskInput from './TaskInput'
import TaskTextarea from './TaskTextarea'
import TaskSelect from './TaskSelect'
import TaskCheckbox from './TaskCheckbox'
import { priorityOptions } from '../data/priorityOptions'
import { todayISO } from '../utils/dates'
import { createTask, editTask } from '../features/tasksSlice'

const initialFormData = {
    title: '',
    description: '',
    priority: 'low',
    dueDate: '',
    done: false,
}

// Sans prop "task" : formulaire de création
// Avec une prop "task" : formulaire de modification (pré-rempli)
export default function TaskForm({ task, onSaved }) {
    const dispatch = useDispatch()
    const isEditing = task !== undefined
    const [formData, setFormData] = useState(isEditing ? task : initialFormData)
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

        const cleanTask = {
            title: formData.title.trim(),
            description: formData.description.trim(),
            priority: formData.priority,
            dueDate: formData.dueDate,
            done: formData.done,
        }

        // Pas d'erreur : on envoie la tâche au store (qui appelle l'API)
        if (isEditing) {
            dispatch(editTask({ ...cleanTask, id: task.id }))
            onSaved()
        } else {
            dispatch(createTask(cleanTask))
            // On vide le formulaire pour pouvoir créer une autre tâche
            setFormData(initialFormData)
        }
    }

    return (
        <Card className='form-card border-0'>
            <Card.Body>
                <Card.Title className='mb-4'>
                    {isEditing ? 'Modifier la tâche' : 'Nouvelle tâche'}
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
                        min={isEditing ? undefined : todayISO()}
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
                        {isEditing ? 'Enregistrer' : 'Ajouter la tâche'}
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    )
}
