import axios from 'axios'

const URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Helper to get token
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export async function getClients(){
    try {
        const response = await axios.get(`${URL}/clients`, getAuthHeaders())
        if(response.status === 200){
            return response.data
        }
    } catch (e) {
        console.error(e)
    }
}

export async function getClient(id){
    try {
        const response = await axios.get(`${URL}/clients/${id}`, getAuthHeaders())
        if(response.status === 200){
            return response.data
        }
    } catch (e) {
        console.error(e)
    }
}

export async function createClient(client){
    try {
        const response = await axios.post(`${URL}/clients`, client, getAuthHeaders())
        return response
    } catch (e) {
        console.error(e)
        throw e
    }
}

export async function updateClient(id, client){
    try {
        const response = await axios.put(`${URL}/clients/${id}`, client, getAuthHeaders())
        return response
    } catch (e) {
        console.error(e)
        throw e
    }
}

export async function deleteClient(id){
    try {
        const response = await axios.delete(`${URL}/clients/${id}`, getAuthHeaders())
        return response
    } catch (e) {
        console.error(e)
    }
}

export async function getMaterials(){
    try {
        const response = await axios.get(`${URL}/materials`, getAuthHeaders())
        if(response.status === 200){
            return response.data
        }
    } catch (e) {
        console.error(e)
    }
}

export async function getMaterial(id){
    try {
        const response = await axios.get(`${URL}/materials/${id}`, getAuthHeaders())
        if(response.status === 200){
            return response.data
        }
    } catch (e) {
        console.error(e)
    }
}

export async function createMaterial(material){
    try {
        const response = await axios.post(`${URL}/materials`, material, getAuthHeaders())
        return response
    } catch (e) {
        console.error(e)
        throw e
    }
}

export async function updateMaterial(id, material){
    try {
        const response = await axios.put(`${URL}/materials/${id}`, material, getAuthHeaders())
        return response
    } catch (e) {
        console.error(e)
        throw e
    }
}

export async function deleteMaterial(id){
    try {
        const response = await axios.delete(`${URL}/materials/${id}`, getAuthHeaders())
        return response
    } catch (e) {
        console.error(e)
    }
}

export async function verifyUser(credentials){
    try {
        const response = await axios.post(`${URL}/admin/login`, credentials)
        if(response.data.success){
            return response.data.token
        }
    } catch (e) {
        console.error(e)
    }
}

// --- RENTS ---

export async function getRents(){
    try {
        const response = await axios.get(`${URL}/rents`, getAuthHeaders())
        if(response.status === 200){
            return response.data
        }
    } catch (e) {
        console.error(e)
    }
}

export async function getRentsByClient(clientId){
    try {
        const response = await axios.get(`${URL}/rents/client/${clientId}`, getAuthHeaders())
        if(response.status === 200){
            return response.data
        }
    } catch (e) {
        console.error(e)
    }
}

export async function getRent(id){
    try {
        const response = await axios.get(`${URL}/rents/${id}`, getAuthHeaders())
        if(response.status === 200){
            return response.data
        }
    } catch (e) {
        console.error(e)
    }
}

export async function createRent(rent){
    try {
        const response = await axios.post(`${URL}/rents`, rent, getAuthHeaders())
        return response
    } catch (e) {
        console.error(e)
        throw e
    }
}

export async function updateRent(id, rent){
    try {
        const response = await axios.put(`${URL}/rents/${id}`, rent, getAuthHeaders())
        return response
    } catch (e) {
        console.error(e)
        throw e
    }
}

export async function deleteRent(id){
    try {
        const response = await axios.delete(`${URL}/rents/${id}`, getAuthHeaders())
        return response
    } catch (e) {
        console.error(e)
    }
}