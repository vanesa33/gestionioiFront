import { useEffect, useState } from "react";
import { getUsersRequest } from "../api/users.js";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

function UserList() {
  const [users, setUsers] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role_id !== 1) {
      navigate("/");
      return;
    }

    const loadUsers = async () => {
      const res = await getUsersRequest();
      console.log("url real:", res.config.url);
      console.log("respuesta correcta", res.data);

      setUsers(Array.isArray(res.data.users) ? res.data.users : []);
    };

    loadUsers();
  }, [user, navigate]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Usuarios</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Rol</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(users) && users.length > 0 ? (
  users.map((u) => (
    <tr key={u.ruid}>
      <td className="border p-2">{u.username}</td>
      <td className="border p-2">{u.email}</td>
      <td className="border p-2">{u.role_id}</td>
      <td className="border p-2">
        <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
          onClick={() => navigate(`/passuser/${u.ruid}/reset-password`)}>
          Editar
        </button>
        <button className="bg-red-500 text-white px-2 py-1 rounded">
          Eliminar
        </button>
      </td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan="4" className="text-center p-4">
      No hay usuarios para mostrar
    </td>
  </tr>
)}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;
