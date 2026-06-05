import { getRents, deleteRent } from '../api'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function Rents() {
    const [rents, setRents] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        async function loadRents() {
            const data = await getRents()
            if (data) {
                setRents(data)
            } else {
                navigate("/")
            }
        }
        loadRents()
    }, [navigate])

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this rent record?")) {
            await deleteRent(id)
            setRents(rents.filter(r => r._id !== id))
        }
    }

    const filteredRents = rents.filter(rent => {
        const searchLower = searchTerm.toLowerCase();
        return rent.clientName?.toLowerCase().includes(searchLower);
    });

    const groupedRents = {};
    filteredRents.forEach(rent => {
        if (!groupedRents[rent.clientId]) {
            groupedRents[rent.clientId] = {
                clientName: rent.clientName,
                clientId: rent.clientId,
                rents: [],
                totalClientCost: 0
            };
        }
        groupedRents[rent.clientId].rents.push(rent);
        groupedRents[rent.clientId].totalClientCost += parseFloat(rent.totalCost) || 0;
    });

    const groupedRentsArray = Object.values(groupedRents);

    return (
        <div className="page-container animate-in">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px'}}>
                <h1 className="form-title" style={{marginBottom: 0}}>Rents Dashboard</h1>
                <button className="btn-primary" onClick={() => navigate('/createrent')}>
                    + Add New Rent
                </button>
            </div>
            <div style={{marginBottom: '32px'}}>
                <input 
                    type="text" 
                    placeholder="Search rents by client name..." 
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
                {groupedRentsArray.map((group) => {
                    return (
                        <div className="client-card" key={group.clientId}>
                            <div className="client-content">
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                                    <h3>{group.clientName}</h3>
                                    <span className="badge badge-active">Active</span>
                                </div>
                                
                                <div style={{marginBottom: '16px'}}>
                                    {group.rents.slice(0, 2).map((rent) => (
                                        <div key={rent._id} className="list-item-hover" style={{marginBottom: '12px', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border)'}}>
                                            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                                                <div style={{display: 'flex', flexDirection: 'column', gap: '2px'}}>
                                                    <span style={{color: 'var(--text-light)', fontSize: '12px'}}>Start: {new Date(rent.dateAdded).toLocaleDateString()}</span>
                                                    <span style={{color: 'var(--text-light)', fontSize: '12px'}}>
                                                        End: {rent.endDate ? new Date(rent.endDate).toLocaleDateString() : <span style={{color: '#f59e0b', fontWeight: '600'}}>Ongoing</span>}
                                                    </span>
                                                </div>
                                                <span style={{fontWeight: '700', fontSize: '14px', color: 'var(--accent)'}}>
                                                    Rs. {parseFloat(rent.totalCost).toFixed(2)}
                                                </span>
                                            </div>
                                            <ul style={{margin: 0, paddingLeft: '20px', fontSize: '13px', color: 'var(--text-light)'}}>
                                                {rent.materials.map((mat, idx) => (
                                                    <li key={idx}>{mat.materialName} × {mat.quantity} @ Rs.{parseFloat(mat.weeklyRent ?? mat.price ?? 0).toFixed(2)}/wk</li>
                                                ))}
                                            </ul>
                                            <div style={{marginTop: '12px', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '16px'}}>
                                                <button 
                                                    style={{background: 'transparent', border: 'none', color: 'var(--accent)', fontSize: '12px', cursor: 'pointer', fontWeight: '600'}} 
                                                    onClick={() => navigate(`/editrent/${rent._id}`)}
                                                >
                                                    Edit rent
                                                </button>
                                                <button 
                                                    style={{background: 'transparent', border: 'none', color: '#ef4444', fontSize: '12px', cursor: 'pointer', fontWeight: '600'}} 
                                                    onClick={() => handleDelete(rent._id)}
                                                >
                                                    Delete rent
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {group.rents.length > 2 && (
                                    <div style={{textAlign: 'center', marginBottom: '16px'}}>
                                        <button 
                                            style={{background: 'var(--accent)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600'}}
                                            onClick={() => navigate(`/clientrents/${group.clientId}`)}
                                        >
                                            View all {group.rents.length} rentals
                                        </button>
                                    </div>
                                )}

                                <div style={{borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <span style={{color: 'var(--text)', fontWeight: '600', fontSize: '16px'}}>Total Rent:</span>
                                    <span style={{color: 'var(--accent)', fontWeight: '800', fontSize: '18px'}}>
                                        Rs. {group.totalClientCost.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                })}
                {groupedRentsArray.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-state-icon">📋</div>
                        <div className="empty-state-text">
                            {rents.length === 0 ? "No rent records found. Add a new rent to get started." : "No rent records match your search."}
                        </div>
                        {rents.length === 0 && (
                            <button className="btn-primary" onClick={() => navigate('/createrent')} style={{marginTop: '8px', padding: '10px 20px', fontSize: '14px'}}>
                                + Create First Rent
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
