import { createRent, getClients, getMaterials } from '../api'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'

export function CreateRent() {
    const navigate = useNavigate()

    const [clients, setClients] = useState([])
    const [materials, setMaterials] = useState([])

    const [selectedClient, setSelectedClient] = useState(null)
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
    const [endDate, setEndDate] = useState('')
    const [rentMaterials, setRentMaterials] = useState([{ material: null, quantity: 1, rateInput: '' }])
    const [errors, setErrors] = useState({})

    const clientGroupRef = useRef(null)
    const materialsGroupRef = useRef(null)
    const formTopRef = useRef(null)

    const scrollToRef = (ref) => {
        setTimeout(() => {
            if (ref && ref.current) {
                ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
        }, 100)
    }

    useEffect(() => {
        async function loadData() {
            const clientsData = await getClients()
            if (clientsData) setClients(clientsData)
            const materialsData = await getMaterials()
            if (materialsData) setMaterials(materialsData)
        }
        loadData()
    }, [])

    const clientOptions = clients.map(c => ({
        value: c._id,
        label: `${c.name}${c.nickname ? ` (${c.nickname})` : ''}`,
        name: c.name,
        nickname: c.nickname || ''
    }))

    const materialOptions = materials.map(m => ({
        value: m._id,
        label: `${m.name} — ${m.spec} · Rs.${parseFloat(m.weeklyRent ?? m.price ?? 0).toFixed(2)}/wk`,
        weeklyRent: parseFloat(m.weeklyRent ?? m.price ?? 0),
        name: m.name
    }))

    const filterClient = (option, inputValue) => {
        const s = inputValue.toLowerCase()
        return option.data.name.toLowerCase().includes(s) || option.data.nickname.toLowerCase().includes(s)
    }

    const filterMaterial = (option, inputValue) => {
        return option.data.name.toLowerCase().includes(inputValue.toLowerCase())
    }

    // Exact decimal weeks — no rounding
    const getWeeks = () => {
        if (!startDate || !endDate) return null
        const diffMs = new Date(endDate) - new Date(startDate)
        if (diffMs <= 0) return null
        return diffMs / (7 * 24 * 60 * 60 * 1000)
    }

    const getRate = (rm) => parseFloat(rm.rateInput !== '' ? rm.rateInput : rm.material?.weeklyRent ?? 0) || 0

    const getLineTotal = (rm, weeks) => {
        if (!rm.material || !weeks) return 0
        return getRate(rm) * (parseFloat(rm.quantity) || 0) * weeks
    }

    const calculateTotal = () => {
        const weeks = getWeeks()
        if (!weeks) return 0
        return rentMaterials.reduce((sum, rm) => sum + getLineTotal(rm, weeks), 0)
    }

    const handleAddMaterial = () => setRentMaterials([...rentMaterials, { material: null, quantity: 1, rateInput: '' }])
    const handleRemoveMaterial = (i) => setRentMaterials(rentMaterials.filter((_, idx) => idx !== i))

    const handleMaterialChange = (opt, index) => {
        const updated = [...rentMaterials]
        updated[index].material = opt ? { ...opt } : null
        updated[index].rateInput = opt ? String(opt.weeklyRent) : ''
        setRentMaterials(updated)
    }

    const handleQuantityChange = (val, index) => {
        const updated = [...rentMaterials]
        updated[index].quantity = val
        setRentMaterials(updated)
    }

    const handleRateChange = (val, index) => {
        const updated = [...rentMaterials]
        updated[index].rateInput = val
        setRentMaterials(updated)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setErrors({})

        if (!selectedClient) {
            setErrors({ client: 'Please select a client.' })
            scrollToRef(clientGroupRef)
            return
        }
        if (!endDate) {
            setErrors({ dates: 'Please set an end date to calculate the rent.' })
            return
        }
        const weeks = getWeeks()
        if (!weeks || weeks <= 0) {
            setErrors({ dates: 'End date must be after start date.' })
            return
        }

        const validMaterials = rentMaterials.filter(rm => rm.material && parseFloat(rm.quantity) > 0)
        if (validMaterials.length === 0) {
            setErrors({ materials: 'Please select at least one material with a valid quantity.' })
            scrollToRef(materialsGroupRef)
            return
        }

        const formattedMaterials = validMaterials.map(rm => ({
            materialId: rm.material.value,
            materialName: rm.material.name,
            quantity: parseFloat(rm.quantity) || 0,
            weeklyRent: getRate(rm)
        }))

        try {
            await createRent({
                clientId: selectedClient.value,
                clientName: selectedClient.label,
                materials: formattedMaterials,
                totalCost: calculateTotal(),
                weeks,
                startDate,
                endDate
            })
            navigate('/rents')
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to create rent. Please try again.'
            setErrors({ general: msg })
            window.alert(msg)
            scrollToRef(formTopRef)
        }
    }

    const selectStyles = {
        control: (p, s) => ({
            ...p,
            padding: '4px',
            borderRadius: '14px',
            borderColor: s.isFocused ? 'var(--accent)' : 'transparent',
            boxShadow: s.isFocused ? '0 0 0 3px rgba(16,185,129,0.15)' : 'none',
            backgroundColor: s.isFocused ? 'var(--bg)' : 'var(--bg-subtle)',
            transition: 'all 0.2s ease',
            '&:hover': { borderColor: 'var(--accent)' }
        }),
        option: (p, s) => ({
            ...p,
            fontSize: '14px',
            backgroundColor: s.isSelected ? 'var(--accent)' : s.isFocused ? 'rgba(16,185,129,0.08)' : 'white',
            color: s.isSelected ? 'white' : 'var(--text-h)'
        })
    }

    const weeks = getWeeks()

    return (
        <div className="page-container centered-page animate-in">
            <div style={{ width: '100%', maxWidth: '680px' }}>
                <button
                    className="nav-item"
                    onClick={() => navigate('/rents')}
                    style={{ marginBottom: '24px', display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border)', background: 'white', padding: '8px 18px', borderRadius: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
                >
                    ← Back to Rents
                </button>

                <form className="form-card" onSubmit={handleSubmit} style={{ maxWidth: '100%' }} ref={formTopRef}>
                    {errors.general && (
                        <div style={{ color: '#ef4444', padding: '10px 14px', background: '#fee2e2', borderRadius: '10px', fontSize: '14px', fontWeight: '500' }}>
                            {errors.general}
                        </div>
                    )}
                    <h1 className="form-title" style={{ marginBottom: 0 }}>Create New Rent</h1>

                    {/* Client */}
                    <div className="form-group" ref={clientGroupRef}>
                        {errors.client && <div style={errStyle}>{errors.client}</div>}
                        <label className="form-label">Client</label>
                        <Select
                            options={clientOptions}
                            value={selectedClient}
                            onChange={setSelectedClient}
                            placeholder="Search for a client…"
                            styles={selectStyles}
                            isClearable
                            maxMenuHeight={200}
                            filterOption={filterClient}
                        />
                    </div>

                    {/* Dates */}
                    {errors.dates && <div style={errStyle}>{errors.dates}</div>}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group" style={{ gap: '6px' }}>
                            <label className="form-label">Start Date</label>
                            <input type="date" className="form-input" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                        </div>
                        <div className="form-group" style={{ gap: '6px' }}>
                            <label className="form-label">End Date</label>
                            <input type="date" className="form-input" value={endDate} min={startDate} onChange={e => setEndDate(e.target.value)} required />
                        </div>
                    </div>

                    {/* Duration pill */}
                    {weeks && weeks > 0 && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '50px', alignSelf: 'flex-start' }}>
                            <span>📅</span>
                            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent)' }}>
                                {weeks % 1 === 0 ? weeks : weeks.toFixed(2)} week{weeks !== 1 ? 's' : ''}
                            </span>
                        </div>
                    )}

                    {/* Materials */}
                    <div ref={materialsGroupRef}>
                        {errors.materials && <div style={{ ...errStyle, marginBottom: '12px' }}>{errors.materials}</div>}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                            <label className="form-label" style={{ margin: 0 }}>Materials</label>
                            <button type="button" onClick={handleAddMaterial} style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                                + Add
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {rentMaterials.map((rm, index) => (
                                <div key={index} style={{ background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {/* Material select + remove */}
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={subLabel}>Material</label>
                                            <Select
                                                options={materialOptions}
                                                value={rm.material}
                                                onChange={opt => handleMaterialChange(opt, index)}
                                                placeholder="Search…"
                                                styles={selectStyles}
                                                isClearable
                                                maxMenuHeight={180}
                                                filterOption={filterMaterial}
                                            />
                                        </div>
                                        {rentMaterials.length > 1 && (
                                            <button type="button" onClick={() => handleRemoveMaterial(index)} style={{ background: 'none', border: '1px solid #fca5a5', color: '#ef4444', borderRadius: '10px', padding: '8px 12px', cursor: 'pointer', fontSize: '16px', lineHeight: 1, flexShrink: 0 }}>
                                                ×
                                            </button>
                                        )}
                                    </div>

                                    {/* Qty | Rate | Line Total */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                                        <div>
                                            <label style={subLabel}>Qty</label>
                                            <input
                                                type="number" min="1" className="form-input"
                                                value={rm.quantity}
                                                onChange={e => handleQuantityChange(e.target.value, index)}
                                                style={compactInput}
                                            />
                                        </div>
                                        <div>
                                            <label style={subLabel}>Rate / week (Rs.)</label>
                                            <input
                                                type="number" step="0.01" min="0" className="form-input"
                                                value={rm.rateInput}
                                                placeholder={rm.material ? String(rm.material.weeklyRent) : '0.00'}
                                                onChange={e => handleRateChange(e.target.value, index)}
                                                disabled={!rm.material}
                                                style={{ ...compactInput, borderColor: rm.rateInput !== '' && rm.rateInput !== String(rm.material?.weeklyRent) ? 'var(--accent)' : 'transparent' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={subLabel}>Line Total</label>
                                            <div style={{ ...compactInput, background: '#ecfdf5', color: 'var(--accent)', fontWeight: '700', display: 'flex', alignItems: 'center', borderRadius: '14px', border: '2px solid transparent', fontSize: '14px' }}>
                                                {weeks && rm.material
                                                    ? `Rs. ${getLineTotal(rm, weeks).toFixed(2)}`
                                                    : <span style={{ color: '#94a3b8' }}>—</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total */}
                    <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(79,172,254,0.06) 100%)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '18px', padding: '20px 24px' }}>
                        {weeks ? (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-light)' }}>Total Rent</div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '3px' }}>
                                        {weeks % 1 === 0 ? weeks : weeks.toFixed(2)} wks × qty × rate
                                    </div>
                                </div>
                                <div style={{ fontSize: '26px', fontWeight: '800', background: 'var(--gradient-ocean)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    Rs. {calculateTotal().toFixed(2)}
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', color: 'var(--text-light)', fontSize: '13px', padding: '4px 0' }}>
                                📅 Select start &amp; end dates to auto-calculate
                            </div>
                        )}
                    </div>

                    <button className="btn-primary" type="submit" style={{ width: '100%', marginTop: '4px' }}>
                        💾 Save Rent
                    </button>
                </form>
            </div>
        </div>
    )
}

const errStyle = { color: '#ef4444', padding: '8px 12px', background: '#fee2e2', borderRadius: '8px', fontSize: '13px', fontWeight: '500' }
const subLabel = { display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }
const compactInput = { padding: '10px 12px', fontSize: '14px' }
