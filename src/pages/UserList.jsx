import { useEffect, useState } from "react";
import { getUsersRequest, deleteUserRequest, updateUserRoleRequest } from "../api/users.js";
import { useAuth } from "../context/useAuth.js";
import { useNavigate } from "react-router-dom";

function UserList() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState("ALL");

  const usersPerPage = 5;

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role_id !== 1) {
      navigate("/");
      return;
    }

    loadUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadUsers = async () => {
    const res = await getUsersRequest();
    setUsers(res.data.users || []);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Seguro que querés eliminar este usuario?");
    if (!confirmDelete) return;

    await deleteUserRequest(id);
    loadUsers();
  };

  const handleRoleChange = async (id, newRole, currentRole) => {
    if (newRole === currentRole) return;

    const confirmChange = window.confirm(
      "¿Seguro que querés cambiar el rol de este usuario?"
    );

    if (!confirmChange){
      loadUsers(); // Volver al rol anterior en el select si el usuario cancela el cambio   
      return;
    }

try {

    await updateUserRoleRequest(id, newRole);
    loadUsers();
  } catch (error) {
    console.error("Error updating user role:", error);
    loadUsers(); // Volver a cargar usuarios en caso de error
  }
};


  // Roles distintos para filtro
  const distinctRoles = [...new Set(users.map(u => u.role_name))];

  // Filtrado
  const filteredUsers =
    selectedRole === "ALL"
      ? users
      : users.filter(u => u.role_name === selectedRole);

  // Paginación
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const getRoleBadge = (role) => {
    const base = "px-2 py-1 rounded text-white font-semibold";

    switch (role) {
      case "ADMIN":
        return `${base} bg-red-600`;
      case "FACTURACION":
        return `${base} bg-blue-600`;
      case "TECNICO":
        return `${base} bg-green-600`;
      default:
        return `${base} bg-gray-500`;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Usuarios</h1>

      {/* FILTRO */}
      <div className="mb-4">
        <select
          className="border p-2 rounded text-gray-800"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="ALL">Todos los roles</option>
          {distinctRoles.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>

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
          {currentUsers.length > 0 ? (
            currentUsers.map((u) => (
              <tr key={u.ruid}>
                <td className="border p-2">{u.username}</td>
                <td className="border p-2">{u.email}</td>

                <td className="border p-2 text-center">
                  <span className={getRoleBadge(u.role_name)}>
                    {u.role_name}
                  </span>

                  <select
                    className="ml-2 border rounded p-1 text-sm text-gray-800 text-center"
                    value={u.role_id}
                    onChange={(e) =>
                      handleRoleChange(u.ruid, Number(e.target.value),
                        u.role_id)
                    }
                  >
                    <option value={1}>ADMIN</option>
                    <option value={2}>FACTURACION</option>
                    <option value={3}>TECNICO</option>
                  </select>
                </td>

                <td className="border p-2 text-center">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() =>
                      navigate(`/passuser/${u.ruid}/reset-password`)
                    }
                  >
                    Resetear Password
                  </button>

                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(u.ruid)}
                  >
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

      {/* PAGINACIÓN */}
      <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-gray-800 text-white"
                : "bg-gray-600"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserList;
