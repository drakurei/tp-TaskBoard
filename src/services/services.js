import { daysFromNow } from '../utils/dates'

// API de test : https://jsonplaceholder.typicode.com/
const API_URL = 'https://jsonplaceholder.typicode.com/todos'

const DEFAULT_DESCRIPTION = "Tâche provenant de l'api"
const priorities = ['low', 'medium', 'high']

// L'API renvoie { userId, id, title, completed } :
// on la transforme au format attendu par le dashboard
function toTask(todo) {
    return {
        id: todo.id,
        title: todo.title,
        description: DEFAULT_DESCRIPTION,
        // L'API n'a pas de priorité : on en déduit une à partir de l'id (1 -> medium, 2 -> high, 3 -> low...)
        priority: priorities[todo.id % priorities.length],
        // Ni d'échéance : on en calcule une entre -3 et +6 jours autour d'aujourd'hui
        dueDate: daysFromNow((todo.id % 10) - 3),
        done: todo.completed,
    }
}

// GET : récupère les tâches depuis l'API
export async function getTasks(limit = 10) {
    const response = await fetch(`${API_URL}?_limit=${limit}`)

    if (!response.ok) {
        throw new Error('Erreur lors du chargement des tâches')
    }

    const data = await response.json()
    return data.map(toTask)
}

// POST : l'API simule la création (elle répond mais n'enregistre rien)
export async function createTask(task) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: task.title, completed: task.done, userId: 1 }),
    })

    if (!response.ok) {
        throw new Error('Erreur lors de la création de la tâche')
    }

    // L'API renvoie toujours l'id 201 : on génère notre propre id
    // pour que chaque nouvelle tâche reste unique dans la liste
    const data = await response.json()
    console.log('Réponse de l\'API (POST) :', data)
    return { ...task, id: Date.now() }
}

// DELETE : l'API simule la suppression (la tâche n'est pas réellement supprimée)
export async function deleteTask(id) {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })

    if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la tâche')
    }

    return id
}
