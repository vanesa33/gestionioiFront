import axios from './axios';

////table Client ///

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL
    : "http://localhost:4000",
  withCredentials: true,
})


export const getTasksRequest = async () => api.get("/tasks");
export const getTaskRequest = async (id) => api.get(`/tasks/${id}`);

export const createTasksRequest = async (task) => api.post("/tasks/", task);

export const upDateTasksRequest = async (id, task) => api.put(`/tasks/${id}`, task);
export const deleteTasksRequest = async (id) => api.delete(`/tasks/${id}`);



