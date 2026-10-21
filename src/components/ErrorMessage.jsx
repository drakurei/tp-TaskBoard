// Message d'erreur affiché en dessous d'un champ du formulaire
export default function ErrorMessage({ message }) {
    // Pas d'erreur : on n'affiche rien
    if (!message) {
        return null
    }

    return (
        <div className='text-danger small mt-1'>
            {message}
        </div>
    )
}
