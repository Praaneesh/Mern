import { getMaterial } from '../api'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

export function ViewMaterial() {
    const [material, setMaterial] = useState({})
    let params = useParams()
    const navigate = useNavigate()
    let id = params.id

    useEffect(() => {
        async function loadMaterial() {
            const data = await getMaterial(id)
            if (data && data.dateAdded) {
                let date = new Date(data.dateAdded)
                data.dateAdded = date.toString().slice(4, 15)
            }
            setMaterial(data || {})
        }
        loadMaterial()
    }, [id])

    return (
        <div className="view-client-container animate-in">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <button className="nav-item" onClick={() => navigate('/materials')} style={{display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border)', background: 'white', padding: '8px 16px', borderRadius: '12px', width: 'fit-content', cursor: 'pointer'}}>
                    ← Back to Materials
                </button>
                <button className="btn-primary" onClick={() => navigate(`/editmaterial/${id}`)} style={{padding: '8px 16px', margin: 0}}>
                    Edit Material
                </button>
            </div>
            <h1 className="client-title">{material.name}</h1>
            <div style={{marginBottom: '24px'}}>
                <span style={{fontSize: '14px', fontWeight: '600', color: 'var(--accent)', background: 'rgba(16, 185, 129, 0.1)', padding: '6px 12px', borderRadius: '8px'}}>
                    Added: {material.dateAdded}
                </span>
            </div>
            
            <div className="client-details-card">
                <h2 style={{fontSize: '22px', fontWeight: '700', color: 'var(--text-h)', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px'}}>
                    Material Specifications
                </h2>
                
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px'}}>
                    <div className="detail-row">
                        <span className="detail-label">Specification</span>
                        <span className="detail-value">{material.spec || 'N/A'}</span>
                    </div>
                    
                    <div className="detail-row">
                        <span className="detail-label">Weekly Rent</span>
                        <span className="detail-value" style={{color: 'var(--accent)', fontWeight: '700'}}>
                            {(material.weeklyRent ?? material.price) ? `Rs. ${parseFloat(material.weeklyRent ?? material.price).toFixed(2)} / week` : 'N/A'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
