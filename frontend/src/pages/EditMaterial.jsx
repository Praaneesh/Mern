import { updateMaterial, getMaterial } from '../api'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export function EditMaterial() {
    const navigate = useNavigate()
    const { id } = useParams()

    const [name, setName] = useState("")
    const [spec, setSpec] = useState("")
    const [weeklyRent, setWeeklyRent] = useState("")

    useEffect(() => {
        async function loadMaterial() {
            const data = await getMaterial(id)
            if (data) {
                setName(data.name || "")
                setSpec(data.spec || "")
                // Support both old 'price' and new 'weeklyRent' fields during migration
                setWeeklyRent(data.weeklyRent ?? data.price ?? "")
            }
        }
        loadMaterial()
    }, [id])

    async function handleSubmit(e) {
        e.preventDefault()
        let submitobject = {
            name: name,
            spec: spec,
            weeklyRent: parseFloat(weeklyRent)
        }
        try {
            await updateMaterial(id, submitobject)
            navigate(`/viewmaterial/${id}`)
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to update material.";
            window.alert(errorMessage);
        }
    }

    return (
        <div className="page-container centered-page animate-in">
            <button className="nav-item" onClick={() => navigate(`/viewmaterial/${id}`)} style={{marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border)', background: 'white', padding: '8px 16px', borderRadius: '12px', width: 'fit-content', cursor: 'pointer'}}>
                ← Back
            </button>
            <form className="form-card" onSubmit={handleSubmit}>
                <h1 className="form-title">Edit Material</h1>
                
                <div className="form-group">
                    <label className="form-label">Name</label>
                    <input className="form-input" placeholder="Material Name..." value={name} onChange={(e) => setName(e.target.value)} required/>
                </div>

                <div className="form-group">
                    <label className="form-label">Specification</label>
                    <input className="form-input" placeholder="e.g. 500kg, Grade A..." value={spec} onChange={(e) => setSpec(e.target.value)} required/>
                </div>

                <div className="form-group">
                    <label className="form-label">Weekly Rent (Rs/week)</label>
                    <div style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
                        <span style={{position: 'absolute', left: '16px', color: 'var(--text-light)', fontWeight: '600'}}>Rs.</span>
                        <input type="number" step="0.01" min="0" className="form-input" style={{paddingLeft: '45px', width: '100%'}} placeholder="0.00" value={weeklyRent} onChange={(e) => setWeeklyRent(e.target.value)} required/>
                    </div>
                    <p style={{fontSize: '12px', color: 'var(--text-light)', marginTop: '6px'}}>Rate charged per item per week</p>
                </div>

                <button className="btn-primary" type="submit">💾 Save Changes</button>
            </form>
        </div>
    )
}
