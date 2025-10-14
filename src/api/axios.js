 import axios from 'axios';

// Usa la variable de entorno si existe, o localhost si estás en modo dev
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api`
    : 'http://localhost:4000/api',
  withCredentials: true,
});

export default instance;