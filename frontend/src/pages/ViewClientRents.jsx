import { getRentsByClient, getClient, deleteRent } from '../api'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export function ViewClientRents() {
    const { clientId } = useParams()
    const [rents, setRents] = useState([])
    const [clientName, setClientName] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        async function loadData() {
            const [clientData, rentsData] = await Promise.all([
                getClient(clientId),
                getRentsByClient(clientId)
            ])
            if (clientData) {
                setClientName(clientData.name)
            }
            if (rentsData) {
                setRents(rentsData)
            }
            setIsLoading(false)
        }
        loadData()
    }, [clientId])

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this rent record?")) {
            await deleteRent(id)
            setRents(rents.filter(r => r._id !== id))
        }
    }

    if (isLoading) {
        return <div className="page-container animate-in">Loading...</div>
    }

    const totalClientCost = rents.reduce((sum, rent) => sum + (parseFloat(rent.totalCost) || 0), 0)

    return (
        <div className="page-container animate-in">
            <button className="nav-item" onClick={() => navigate('/rents')} style={{marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border)', background: 'white', padding: '8px 16px', borderRadius: '12px', width: 'fit-content', cursor: 'pointer'}}>
                ← Back to Dashboard
            </button>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px'}}>
                <h1 className="form-title" style={{marginBottom: 0}}>All Rents for {clientName}</h1>
                <button className="btn-primary" onClick={() => navigate('/createrent')}>
                    + Add New Rent
                </button>
            </div>

            <div className="client-card" style={{maxWidth: '800px'}}>
                <div className="client-content">
                    <div style={{marginBottom: '16px'}}>
                        {rents.map((rent) => (
                            <div key={rent._id} style={{marginBottom: '12px', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border)'}}>
                                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px'}}>
                                    <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                                        <span style={{color: 'var(--text-light)', fontSize: '13px', fontWeight: '500'}}>Start: {new Date(rent.dateAdded).toLocaleDateString()}</span>
                                        <span style={{color: 'var(--text-light)', fontSize: '13px', fontWeight: '500'}}>
                                            End: {rent.endDate ? new Date(rent.endDate).toLocaleDateString() : <span style={{color: '#f59e0b', fontWeight: '600'}}>Ongoing</span>}
                                        </span>
                                    </div>
                                    <span style={{fontWeight: '700', fontSize: '15px', color: 'var(--accent)'}}>
                                        Rs. {parseFloat(rent.totalCost).toFixed(2)}
                                    </span>
                                </div>
                                <ul style={{margin: 0, paddingLeft: '20px', fontSize: '14px', color: 'var(--text-light)'}}>
                                    {rent.materials.map((mat, idx) => (
                                        <li key={idx} style={{marginBottom: '4px'}}>{mat.materialName} × {mat.quantity} @ Rs.{parseFloat(mat.weeklyRent ?? mat.price ?? 0).toFixed(2)}/wk</li>
                                    ))}
                                </ul>
                                <div style={{marginTop: '16px', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '16px'}}>
                                    <button 
                                        style={{background: 'transparent', border: 'none', color: 'var(--accent)', fontSize: '13px', cursor: 'pointer', fontWeight: '600'}} 
                                        onClick={() => navigate(`/editrent/${rent._id}`)}
                                    >
                                        Edit rent
                                    </button>
                                    <button 
                                        style={{background: 'transparent', border: 'none', color: '#ef4444', fontSize: '13px', cursor: 'pointer', fontWeight: '600'}} 
                                        onClick={() => handleDelete(rent._id)}
                                    >
                                        Delete rent
                                    </button>
                                </div>
                            </div>
                        ))}
                        {rents.length === 0 && (
                            <div style={{textAlign: 'center', padding: '20px', color: 'var(--text-light)'}}>
                                No active rents for this client.
                            </div>
                        )}
                    </div>

                    <div style={{borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <span style={{color: 'var(--text)', fontWeight: '600', fontSize: '18px'}}>Total Rent:</span>
                        <span style={{color: 'var(--accent)', fontWeight: '800', fontSize: '20px'}}>
                            Rs. {totalClientCost.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
