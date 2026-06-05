import { getMaterials, deleteMaterial } from '../api'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function Materials() {
    const [materials, setMaterials] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        async function loadMaterials() {
            const data = await getMaterials()
            if (data) {
                setMaterials(data)
            } else {
                navigate("/")
            }
        }
        loadMaterials()
    }, [navigate])

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this material?")) {
            await deleteMaterial(id)
            setMaterials(materials.filter(m => m._id !== id))
        }
    }

    const filteredMaterials = materials.filter(material => {
        const searchLower = searchTerm.toLowerCase();
        return material.name?.toLowerCase().includes(searchLower);
    });

    return (
        <div className="page-container animate-in">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px'}}>
                <h1 className="form-title" style={{marginBottom: 0}}>Materials Dashboard</h1>
                <button className="btn-primary" onClick={() => navigate('/creatematerial')}>
                    + Add New Material
                </button>
            </div>
            <div style={{marginBottom: '32px'}}>
                <input 
                    type="text" 
                    placeholder="Search materials by name..." 
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
                {filteredMaterials.map((material) => {
                    return (
                        <div className="client-card" key={material._id}>
                            <div className="client-content">
                                <h3>{material.name}</h3>
                                <p style={{color: 'var(--text-light)', marginBottom: '8px'}}>{material.spec}</p>
                                <p style={{color: 'var(--accent)', fontWeight: '700', fontSize: '18px', marginBottom: '4px'}}>
                                    Rs. {parseFloat(material.weeklyRent ?? material.price ?? 0).toFixed(2)}
                                </p>
                                <p style={{color: 'var(--text-light)', fontSize: '12px', marginBottom: '16px'}}>per week / per item</p>
                                
                                <div style={{display: 'flex', gap: '10px'}}>
                                    <button className="btn-primary" style={{flex: 1, padding: '8px', fontSize: '14px'}} onClick={() => navigate(`/viewmaterial/${material._id}`)}>
                                        View Details
                                    </button>
                                    <button className="btn-danger" style={{flex: 1, padding: '8px', fontSize: '14px'}} onClick={() => handleDelete(material._id)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
                {filteredMaterials.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-state-icon">📦</div>
                        <div className="empty-state-text">
                            {materials.length === 0 ? "No materials found. Add a new material to get started." : "No materials match your search."}
                        </div>
                        {materials.length === 0 && (
                            <button className="btn-primary" onClick={() => navigate('/creatematerial')} style={{marginTop: '8px', padding: '10px 20px', fontSize: '14px'}}>
                                + Create First Material
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
