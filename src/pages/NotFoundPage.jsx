import { Link } from 'react-router-dom'

export default function NotFoundPage() {
    return (
        <div className='text-center py-5'>
            <h1>Page introuvable</h1>
            <p className='text-muted'>Cette page n'existe pas.</p>
            <Link to='/' className='btn btn-primary'>Retour au dashboard</Link>
        </div>
    )
}
