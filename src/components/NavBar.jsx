import { NavLink, Link } from 'react-router-dom'
import { Container } from 'react-bootstrap'

export default function NavBar() {
    return (
        <nav className='app-nav'>
            <Container className='d-flex justify-content-between align-items-center'>
                <Link to='/' className='app-nav__brand'>TaskBoard</Link>
                <div className='d-flex gap-3'>
                    <NavLink to='/' className='app-nav__link'>Dashboard</NavLink>
                </div>
            </Container>
        </nav>
    )
}
