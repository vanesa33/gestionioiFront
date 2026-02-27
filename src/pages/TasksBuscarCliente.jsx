import { useEffect, useState } from "react";
import { getTasksRequest } from "../api/tasks";
import { useNavigate } from "react-router-dom";

function BuscarClientes() {
  const [client, setClient] = useState([]);
  const [busqueda, setBusqueda] = useState({
    user_id: "",
    nombre: "",
    apellido: "",
    telefono: "",
    mail: "",
    calle: "",
    numero: "",
    localidad: "",
  });
  
  const navigate = useNavigate();
  const [paginaActual, setPaginaActual] = useState(1);
  const [filasPorPagina, setFilasPorPagina] = useState(9);

  const [clienteSeleccionado, setClienteSeleccionado] = useState(null); // ← NUEVO

  useEffect(() => {
    const getClients = async () => {
      try {
        const res = await getTasksRequest();
        setClient(res.data);
      } catch (error) {
        console.error("Error al obtener clientes", error);
      }
    };
    getClients();
  }, []);

  const resultadosFiltrados = client.filter((c) => (
     (busqueda.user_id === "" || (c.user_id != null ? c.user_id.toString().toLowerCase() : "").includes(busqueda.numero.toLowerCase())) &&
  (busqueda.nombre === "" || c.nombre?.toLowerCase().includes(busqueda.nombre.toLowerCase())) &&
  (busqueda.apellido === "" || c.apellido?.toLowerCase().includes(busqueda.apellido.toLowerCase())) &&
  (busqueda.telefono === "" || (c.telefono != null ? c.telefono.toString().toLowerCase() : "").includes(busqueda.telefono.toLowerCase())) &&
  (busqueda.mail === "" || c.mail?.toLowerCase().includes(busqueda.mail.toLowerCase())) &&
  (busqueda.calle === "" || c.calle?.toLowerCase().includes(busqueda.calle.toLowerCase())) &&
      (busqueda.numero === "" || (c.numero != null ? c.numero.toString().toLowerCase() : "").includes(busqueda.numero.toLowerCase())) &&
      (busqueda.localidad === "" || (c.localidad != null ? c.localidad.toString().toLowerCase() : "").includes(busqueda.localidad.toLowerCase())) 

  
));

  const totalPaginas = Math.ceil(resultadosFiltrados.length / filasPorPagina);
  const indiceInicio = (paginaActual - 1) * filasPorPagina;
  const indiceFin = indiceInicio + filasPorPagina;
  const clientesPaginados = resultadosFiltrados.slice(indiceInicio, indiceFin);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const handleFilasChange = (e) => {
    setFilasPorPagina(parseInt(e.target.value));
    setPaginaActual(1);
  };

  

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-xl font-bold text-center mb-4">Buscar Cliente</h1>

      {/* Filtros */}
      <div className="grid grid-cols-2 md:grid-cols-4  text-gray-600 gap-2 mb-4">
         <input
          type="text"
          placeholder="ID"
          value={busqueda.user_id}
          onChange={(e) => {
            setBusqueda({ ...busqueda, user_id: e.target.value });
            setPaginaActual(1);
          }}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Nombre"
          value={busqueda.nombre}
          onChange={(e) => {
            setBusqueda({ ...busqueda, nombre: e.target.value });
            setPaginaActual(1);
          }}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Apellido"
          value={busqueda.apellido}
          onChange={(e) => {
            setBusqueda({ ...busqueda, apellido: e.target.value });
            setPaginaActual(1);
          }}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Teléfono"
          value={busqueda.telefono}
          onChange={(e) => {
            setBusqueda({ ...busqueda, telefono: e.target.value });
            setPaginaActual(1);
          }}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Mail"
          value={busqueda.mail}
          onChange={(e) => {
            setBusqueda({ ...busqueda, mail: e.target.value });
            setPaginaActual(1);
          }}
          className="p-2 border rounded"
        />
      </div>

      {/* Tabla */}
      <table className="w-full table-auto border-collapse border border-gray-300 mb-4">
        <thead>
          <tr className="bg-red-900 text-left">
            <th className="border p-2">ID</th>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Apellido</th>
            <th className="border p-2">Teléfono</th>
            <th className="border p-2">Mail</th>
          </tr>
        </thead>
        <tbody>
          {clientesPaginados.map((c) => (
            <tr
              key={c.id}
              className="hover:bg-red-800 cursor-pointer"
              onClick={() => setClienteSeleccionado(c)} // ← Mostrar modal
            >
              <td className="border p-2">{c.id || "-"}</td>
              <td className="border p-2">{c.nombre || "-"}</td>
              <td className="border p-2">{c.apellido || "-"}</td>
              <td className="border p-2">{c.telefono || "-"}</td>
              <td className="border p-2">{c.mail || "-"}</td>
            </tr>
          ))}
          {clientesPaginados.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center p-4">
                No se encontraron resultados.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Selector de filas y paginación */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center text-gray-900 gap-2">
          <label htmlFor="filasPorPagina">Filas por página:</label>
          <select
            id="filasPorPagina"
            value={filasPorPagina}
            onChange={handleFilasChange}
            className="border rounded p-1"
          >
            <option value={5}>5</option>
            <option value={9}>9</option>
            <option value={15}>15</option>
          </select>
        </div>

        <div className="flex items-center gap-1 flex-wrap justify-center">
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((nro) => (
            <button
              key={nro}
              onClick={() => cambiarPagina(nro)}
              className={`px-3 py-1 border rounded ${
                paginaActual === nro ? "bg-red-600 text-white" : "bg-red-900 hover:bg-red-700"
              }`}
            >
              {nro}
            </button>
          ))}
        </div>
      </div>

      {/* Modal de cliente */}
      {clienteSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-400 text-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Detalles del Cliente</h2>
            <p><strong>ID:</strong> {clienteSeleccionado.id}</p>
            <p><strong>Nombre:</strong> {clienteSeleccionado.nombre}</p>
            <p><strong>Apellido:</strong> {clienteSeleccionado.apellido}</p>
            <p><strong>Teléfono:</strong> {clienteSeleccionado.telefono}</p>
            <p><strong>Mail:</strong> {clienteSeleccionado.mail}</p>
            <p><strong>Domicilio:</strong> {clienteSeleccionado.calle} {clienteSeleccionado.numero} {clienteSeleccionado.localidad}</p>

            <div className="flex gap-4 text-right mt-4">
              <button
                onClick={() => setClienteSeleccionado(null)}
                className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-700"
              >
                Cerrar
              </button>
              
              <button 
              onClick={() => navigate(`/ingresos/nuevo`, {state: { client_id: clienteSeleccionado.id }})}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                    Crear Orden
                </button>
                <button 
                 onClick={() => navigate(`/tasks/edit/${clienteSeleccionado.id}`, { state: { cliente: clienteSeleccionado } })}
                  className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                >
                  Editar
                 </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BuscarClientes;
