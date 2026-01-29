import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL
    : "http://localhost:4000",
  withCredentials: true,
});

// traer usuarios
export const getUsersRequest = () => api.get("/passuser");

// admin → reset password
export const resetPasswordRequest = (userId) => {
  if (!userId) throw new Error("User ID is required for resetting password");
  return api.put(`/passuser/${userId}/reset-password`);
};

// usuario logueado → cambiar su propia password
export const cambiarPasswordRequest = (data) =>
  api.put("/cambiar-password", data);
