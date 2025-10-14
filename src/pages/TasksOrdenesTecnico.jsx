import React, { useEffect, useState } from "react";
import { getTodosLosIngresosRequest } from "../api/ingresos";
import { getUsersRequest } from "../api/users";
import * as XLSX from "xlsx";

function TasksOrdenesTecnico() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  // Cargar usuarios al inicio
  useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await getUsersRequest();
      console.log("usuarios cargados:", res.data);


      // Verificamos si lo que viene es un array o no
      if (Array.isArray(res.data)) {
        setUsers(res.data); // ✅ si es array lo guardamos directo
      } else if (res.data.users) {
        setUsers(res.data.users); // ✅ si viene dentro de una propiedad "users"
      } else {
        setUsers([res.data]); // ✅ si es un solo objeto, lo convertimos en array
      }
    } catch (error) {
      console.error("❌ Error cargando usuarios:", error);
    }
  };
  fetchUsers();
}, []);

  // Cargar órdenes del usuario seleccionado
  useEffect(() => {
    const fetchOrders = async () => {
      if (!selectedUser) return;
      try {
        const res = await getTodosLosIngresosRequest(selectedUser);
        setOrders(res.data);
      } catch (error) {
        console.error("Error cargando órdenes:", error);
      }
    };
    fetchOrders();
  }, [selectedUser]);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(orders);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Órdenes");
    XLSX.writeFile(wb, "ordenes.xlsx");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Órdenes del técnico:</h2>

      {/* Selector de técnico */}
      <div className="mb-4">
        <label className="mr-2">Seleccionar técnico:</label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="border rounded p-2"
        >
          <option key="default" value="">-- Selecciona un técnico --</option>
          {users.map((user) => (
            <option key={`user-${user.id}`} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
      </div>

      {/* Botón Exportar */}
      <button
        onClick={exportToExcel}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
      >
        Descargar Excel
      </button>

      {/* Tabla */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th>N° Orden</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Equipo</th>
            <th>N° Serie</th>
            <th>Falla</th>
            <th>Observaciones</th>
            <th>Costo</th>
            <th>Creado por</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o, index) => (
            <tr key={index}>
              <td>{o.codigo}</td>
              <td>{o.fecha}</td>
              <td>{o.cliente}</td>
              <td>{o.equipo}</td>
              <td>{o.serie}</td>
              <td>{o.falla}</td>
              <td>{o.observaciones}</td>
              <td>{o.costo}</td>
              <td>{o.user_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TasksOrdenesTecnico;