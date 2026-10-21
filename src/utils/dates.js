// Transforme une Date en texte 'AAAA-MM-JJ' (le format des champs <input type="date">)
export function toISODate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

export function todayISO() {
    return toISODate(new Date())
}

// Date d'aujourd'hui décalée de n jours (n négatif = dans le passé)
export function daysFromNow(n) {
    const date = new Date()
    date.setDate(date.getDate() + n)
    return toISODate(date)
}

// '2026-10-24' -> 'sam. 24 oct.'
export function formatDate(iso) {
    const [year, month, day] = iso.split('-')
    return new Date(year, month - 1, day).toLocaleDateString('fr-FR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
    })
}

// Les dates 'AAAA-MM-JJ' se comparent directement comme du texte
export function isOverdue(task) {
    return !task.done && task.dueDate < todayISO()
}
