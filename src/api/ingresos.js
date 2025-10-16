import axios from 'axios'

const api = axios.create({
     baseURL: import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api`
    : 'http://localhost:4000/api',
    withCredentials: true
})


export const getTodosIngresosRequest = async (ingreso) => api.get("/ingresos/todos/", ingreso); // todas

export const getTodosLosIngresosRequest = async (id) => api.get(`/ingresos/poruser/${id}`)

export const getIngresosRequest = () => api.get("/ingresos");
export const getIngresoRequest = (id) => api.get(`/ingresos/${id}`);

export const createIngresoRequest = async (ingreso) => api.post("/ingresos/", ingreso);

export const upDateingresoRequest = (id, ingreso) => api.put(`/ingresos/${id}`, ingreso);

export const deleteIngresoRequest = (id) => api.delete(`/ingresos/${id}`);

