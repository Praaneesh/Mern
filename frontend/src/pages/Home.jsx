import { getClients, deleteClient } from '../api'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function Home() {
    const [clients, setClients] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        async function loadClients() {
            const data = await getClients()
            if (data) {
                setClients(data)
            } else {
                navigate("/")
            }
        }
        loadClients()
    }, [navigate])

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this client?")) {
            await deleteClient(id)
            setClients(clients.filter(c => c._id !== id))
        }
    }

    const filteredClients = clients.filter(client => {
        const searchLower = searchTerm.toLowerCase();
        const nameMatch = client.name?.toLowerCase().includes(searchLower);
        const nicknameMatch = client.nickname?.toLowerCase().includes(searchLower);
        return nameMatch || nicknameMatch;
    });

    return (
        <div className="page-container animate-in">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px'}}>
                <h1 className="form-title" style={{marginBottom: 0}}>Client Dashboard</h1>
                <button className="btn-primary" onClick={() => navigate('/createclient')}>
                    + Add New Client
                </button>
            </div>
            <div style={{marginBottom: '32px'}}>
                <input 
                    type="text" 
                    placeholder="Search clients by name or nickname..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input"
                    style={{
                        padding: '16px 24px', 
                        width: '100%', 
                        maxWidth: '500px',
                        fontSize: '16px',
                        backgroundColor: 'white',
                        boxShadow: 'var(--shadow-sm)',
                        border: '1px solid var(--border)'
                    }}
                />
            </div>

            <div className="dashboard-grid">
                {filteredClients.map((client) => {
                    return (
                        <div className="client-card" key={client._id}>
                            <div className="client-content">
                                <h3>{client.name} {client.nickname && `(${client.nickname})`}</h3>
                                <p style={{color: 'var(--text-light)', marginBottom: '8px'}}>{client.email}</p>
                                <p style={{color: 'var(--text-light)', marginBottom: '16px'}}>{client.phone}</p>
                                
                                <div style={{display: 'flex', gap: '10px'}}>
                                    <button className="btn-primary" style={{flex: 1, padding: '8px', fontSize: '14px'}} onClick={() => navigate(`/viewclient/${client._id}`)}>
                                        View Details
                                    </button>
                                    <button className="btn-danger" style={{flex: 1, padding: '8px', fontSize: '14px'}} onClick={() => handleDelete(client._id)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
                {filteredClients.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-state-icon">👥</div>
                        <div className="empty-state-text">
                            {clients.length === 0 ? "No clients found. Add a new client to get started." : "No clients match your search."}
                        </div>
                        {clients.length === 0 && (
                            <button className="btn-primary" onClick={() => navigate('/createclient')} style={{marginTop: '8px', padding: '10px 20px', fontSize: '14px'}}>
                                + Create First Client
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}