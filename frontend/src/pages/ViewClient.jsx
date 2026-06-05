import { getClient } from '../api'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

export function ViewClient() {
    const [client, setClient] = useState({})
    let params = useParams()
    const navigate = useNavigate()
    let id = params.id

    useEffect(() => {
        async function loadClient() {
            const data = await getClient(id)
            if (data.dateAdded) {
                let date = new Date(data.dateAdded)
                data.dateAdded = date.toString().slice(4, 15)
            }
            setClient(data)
        }
        loadClient()
    }, [id])

    return (
        <div className="view-client-container animate-in">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <button className="nav-item" onClick={() => navigate('/home')} style={{display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border)', background: 'white', padding: '8px 16px', borderRadius: '12px', width: 'fit-content', cursor: 'pointer'}}>
                    ← Back to Dashboard
                </button>
                <button className="btn-primary" onClick={() => navigate(`/editclient/${id}`)} style={{padding: '8px 16px', margin: 0}}>
                    Edit Client
                </button>
            </div>
            <h1 className="client-title">{client.name} {client.nickname && `(${client.nickname})`}</h1>
            <div style={{marginBottom: '24px'}}>
                <span style={{fontSize: '14px', fontWeight: '600', color: 'var(--accent)', background: 'rgba(16, 185, 129, 0.1)', padding: '6px 12px', borderRadius: '8px'}}>
                    Added: {client.dateAdded}
                </span>
            </div>
            
            <div className="client-details-card">
                <h2 style={{fontSize: '22px', fontWeight: '700', color: 'var(--text-h)', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px'}}>
                    Contact Information
                </h2>
                
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px'}}>
                    <div className="detail-row">
                        <span className="detail-label">Email Address</span>
                        <span className="detail-value">{client.email || 'N/A'}</span>
                    </div>
                    
                    <div className="detail-row">
                        <span className="detail-label">Phone Number</span>
                        <span className="detail-value">{client.phone || 'N/A'}</span>
                    </div>
                    
                    <div className="detail-row" style={{gridColumn: '1 / -1'}}>
                        <span className="detail-label">Physical Address</span>
                        <span className="detail-value">{client.address || 'N/A'}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}