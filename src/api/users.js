import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL
    : "http://localhost:4000",
  withCredentials: true,
});
console.log("API URL:", import.meta.env.VITE_API_URL);

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


export const deleteUserRequest = (userId) => {
  if (!userId) throw new Error("User ID is required for deletion");
  return api.delete(`/passuser/${userId}`);
}

export const updateUserRoleRequest = (userId, newRoleId) => {
  if (!userId) throw new Error("User ID is required for role update");
  if (!newRoleId) throw new Error("New Role ID is required for role update");
  return api.put(`/passuser/${userId}/role`, { role_id: newRoleId });
}
