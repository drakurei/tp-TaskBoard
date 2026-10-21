import { NavLink, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Container } from 'react-bootstrap'
import { logout, selectUser } from '../features/authSlice'

export default function NavBar() {
    const user = useSelector(selectUser)
    const dispatch = useDispatch()

    return (
        <nav className='app-nav'>
            <Container className='d-flex justify-content-between align-items-center'>
                <Link to='/' className='app-nav__brand'>TaskBoard</Link>
                {/* Les liens changent selon que l'utilisateur est connecté ou non */}
                {user ? (
                    <div className='d-flex align-items-center gap-3'>
                        <NavLink to='/' end className='app-nav__link'>Dashboard</NavLink>
                        <NavLink to='/profile' className='app-nav__link'>{user.name}</NavLink>
                        <button type='button' className='btn btn-sm btn-outline-secondary' onClick={() => dispatch(logout())}>
                            Déconnexion
                        </button>
                    </div>
                ) : (
                    <div className='d-flex align-items-center gap-3'>
                        <NavLink to='/login' className='app-nav__link'>Connexion</NavLink>
                        <NavLink to='/register' className='app-nav__link'>Inscription</NavLink>
                    </div>
                )}
            </Container>
        </nav>
    )
}
