import { useState } from 'react'
import { verifyUser } from '../api'
import { useNavigate } from 'react-router-dom'

export function Landing() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    async function handleLogin(e) {
        e.preventDefault()
        const token = await verifyUser({ email, password })
        if (token) {
            localStorage.setItem('token', token)
            navigate("/home")
        } else {
            setError("Invalid admin credentials")
        }
    }

    return (
        <div className="hero-container animate-in">
            <div className="hero-content" style={{maxWidth: '400px', margin: '0 auto', background: 'var(--surface)', padding: '40px', borderRadius: '16px', boxShadow: 'var(--shadow)', border: '1px solid var(--border)'}}>
                <h1 className="hero-title" style={{fontSize: '32px', marginBottom: '24px'}}>Admin Login</h1>
                
                {error && <div style={{color: '#ef4444', marginBottom: '16px', padding: '10px', background: '#fee2e2', borderRadius: '8px'}}>{error}</div>}
                
                <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left'}}>
                    <div className="form-group" style={{marginBottom: 0}}>
                        <label className="form-label">Email</label>
                        <input type="email" className="form-input" placeholder="admin@admin.com" onChange={(e) => setEmail(e.target.value)} required/>
                    </div>
                    
                    <div className="form-group" style={{marginBottom: 0}}>
                        <label className="form-label">Password</label>
                        <input type="password" className="form-input" placeholder="••••••••" onChange={(e) => setPassword(e.target.value)} required/>
                    </div>
                    
                    <button type="submit" className="btn-primary" style={{marginTop: '10px'}}>Login to Dashboard</button>
                </form>
            </div>
        </div>
    )
}