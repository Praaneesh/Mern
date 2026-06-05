import { Link } from 'react-router-dom'
import { pageData } from './pageData'
import { useNavigate } from 'react-router-dom'

export function Navbar() {
    const navigate = useNavigate()
    function handleLogout(){
        localStorage.removeItem("token")
        navigate("/")
    }
    
    return (
        <nav className='navbar'>
            <div className="nav-logo">
                <Link to="/home" style={{fontWeight: 800, fontSize: '1.5rem', background: 'var(--gradient-sunrise)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                    ClientPortal
                </Link>
            </div>
            <div className="nav-links">
                <Link to="/home" className="nav-item">👥 Clients</Link>
                <Link to="/materials" className="nav-item">📦 Materials</Link>
                <Link to="/rents" className="nav-item">📋 Rents</Link>
                <button className="logout-btn" onClick={handleLogout}>
                    🚪 Logout
                </button>
            </div>
        </nav>
    )
}