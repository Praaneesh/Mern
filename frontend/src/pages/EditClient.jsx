import { updateClient, getClient } from '../api'
import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export function EditClient() {
    const navigate = useNavigate()
    const { id } = useParams()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [nickname, setNickname] = useState("")
    const [errors, setErrors] = useState({})
    
    const emailGroupRef = useRef(null)
    const phoneGroupRef = useRef(null)
    const formTopRef = useRef(null)

    useEffect(() => {
        async function loadClient() {
            const data = await getClient(id)
            if (data) {
                setName(data.name || "")
                setEmail(data.email || "")
                setPhone(data.phone || "")
                setAddress(data.address || "")
                setNickname(data.nickname || "")
            }
        }
        loadClient()
    }, [id])

    const scrollToRef = (ref) => {
        setTimeout(() => {
            if (ref && ref.current) {
                ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setErrors({})

        const emailLower = email.toLowerCase();
        if (!emailLower.endsWith("@gmail.com") && 
            !emailLower.endsWith("@yahoo.com") && 
            !emailLower.endsWith("@outlook.com") && 
            !emailLower.endsWith("@hotmail.com") && 
            !emailLower.endsWith("@microsoft.com")) {
            setErrors({ email: "Please provide a valid email." })
            scrollToRef(emailGroupRef)
            return
        }

        const phoneRegex = /^\d{10}$/
        if (!phoneRegex.test(phone.replace(/[\s-]/g, ''))) {
            setErrors({ phone: "Please provide a valid 10-digit phone number." })
            scrollToRef(phoneGroupRef)
            return
        }

        try {
            let submitobject = {
                name: name,
                email: email,
                phone: phone,
                address: address,
                nickname: nickname
            }
            await updateClient(id, submitobject)
            navigate(`/viewclient/${id}`)
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to update client. Please try again.";
            setErrors({ general: errorMessage })
            window.alert(errorMessage)
            scrollToRef(formTopRef)
        }
    }

    return (
        <div className="page-container centered-page animate-in">
            <button className="nav-item" onClick={() => navigate(`/viewclient/${id}`)} style={{marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border)', background: 'white', padding: '8px 16px', borderRadius: '12px', width: 'fit-content', cursor: 'pointer'}}>
                ← Back
            </button>
            <form className="form-card" onSubmit={handleSubmit} ref={formTopRef}>
                {errors.general && <div style={{color: '#ef4444', padding: '10px', marginBottom: '15px', background: '#fee2e2', borderRadius: '8px', fontSize: '14px', fontWeight: '500', textAlign: 'center'}}>{errors.general}</div>}
                <h1 className="form-title">Edit Client</h1>

                <div className="form-group">
                    <label className="form-label">Name</label>
                    <input className="form-input" placeholder="Full Name..." value={name} onChange={(e) => setName(e.target.value)} required/>
                </div>

                <div className="form-group" ref={emailGroupRef}>
                    {errors.email && <div style={{color: '#ef4444', padding: '8px', marginBottom: '8px', background: '#fee2e2', borderRadius: '6px', fontSize: '13px', fontWeight: '500'}}>{errors.email}</div>}
                    <label className="form-label">Email</label>
                    <input type="email" className="form-input" placeholder="Email Address..." value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>

                <div className="form-group" ref={phoneGroupRef}>
                    {errors.phone && <div style={{color: '#ef4444', padding: '8px', marginBottom: '8px', background: '#fee2e2', borderRadius: '6px', fontSize: '13px', fontWeight: '500'}}>{errors.phone}</div>}
                    <label className="form-label">Phone</label>
                    <input type="tel" className="form-input" placeholder="Phone Number..." value={phone} onChange={(e) => setPhone(e.target.value)} required/>
                </div>

                <div className="form-group">
                    <label className="form-label">Address</label>
                    <input className="form-input" placeholder="Home/Work Address..." value={address} onChange={(e) => setAddress(e.target.value)} required/>
                </div>

                <div className="form-group">
                    <label className="form-label">Nickname</label>
                    <input className="form-input" placeholder="Nickname..." value={nickname} onChange={(e) => setNickname(e.target.value)}/>
                </div>

                <button className="btn-primary" type="submit">💾 Save Changes</button>
            </form>
        </div>
    )
}
