import { useState, useEffect } from "react";
import { useTasks } from "../context/useTasks";
import { useNavigate } from "react-router-dom";
import { getTodosIngresosRequest } from "../api/ingresos";
import { imprimirOrdenBuscarUno } from "../imprimirOrdenBuscarUno.js";
import * as XLSX from "xlsx";

function TasksBuscarOrden() {
  const { ingresos, deleteIngreso } = useTasks();
  console.log("Ingresos:", ingresos);

  const [ingreso, setIngreso] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroUsuario, setFiltroUsuario] = useState(""); // ⬅️ agregado

  const [paginaActual, setPaginaActual] = useState(1);
  const [filasPorPagina, setFilasPorPagina] = useState(9);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
   const [datosOrden, setDatosOrden] = useState(null)
  const navigate = useNavigate();

  useEffect(() => {
    const loadTodosIngresos = async () => {
      try {
        const res = await getTodosIngresosRequest();
        console.log("repuesta backend", res.data);
        setIngreso(res.data);
      } catch (error) {
        console.error("Error al obtener datos", error);
      }
    };
    loadTodosIngresos();
  }, []);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroUsuario, filasPorPagina]); // ⬅️ ahora también escucha filtroUsuario

  if (!Array.isArray(ingreso)) {
    return <div className="p-4">Cargando ingresos...</div>;
  }

  // Filtro general
  const textoBusqueda = busqueda.toLowerCase();

  const resultadosFiltrados = ingreso.filter((o) => {
    const fechaStr = o.fecha ? new Date(o.fecha).toISOString().split("T")[0] : "";
    const numordenStr = o.numorden ? String(o.numorden).toLowerCase() : "";
    const nombreStr = o.nombre ? String(o.nombre).toLowerCase() : "";
    const apellidoStr = o.apellido ? String(o.apellido).toLowerCase() : "";
    const telefonoStr = o.telefono ? String(o.telefono).toLowerCase() : "";
    const nserieStr = o.nserie ? String(o.nserie).toLowerCase() : "";
    const usuarioStr = o.usuario_nombre ? String(o.usuario_nombre).toLowerCase() : "";

    const coincideBusqueda =
      numordenStr.includes(textoBusqueda) ||
      fechaStr.includes(textoBusqueda) ||
      nombreStr.includes(textoBusqueda) ||
      apellidoStr.includes(textoBusqueda) ||
      telefonoStr.includes(textoBusqueda) ||
      nserieStr.includes(textoBusqueda) ||
      usuarioStr.includes(textoBusqueda);

    const coincideUsuario =
      filtroUsuario === "" || usuarioStr === filtroUsuario.toLowerCase();

    return coincideBusqueda && coincideUsuario;
  });

  // Paginación
  const totalPaginas = Math.max(1, Math.ceil(resultadosFiltrados.length / filasPorPagina));
  const paginaSegura = Math.min(paginaActual, totalPaginas);

  const ordenesPaginadas = resultadosFiltrados.slice(
    (paginaSegura - 1) * filasPorPagina,
    paginaSegura * filasPorPagina
  );

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const abrirModal = (orden) => {
    setOrdenSeleccionada(orden);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setOrdenSeleccionada(null);
  };

  const manejarEditar = () => {
    navigate(`/ingresos/${ordenSeleccionada.iid}`, {
      state: { ingreso: ordenSeleccionada },
    });
  };

  const manejarEliminar = async () => {
    if (confirm("¿Seguro que querés eliminar esta orden?")) {
      await deleteIngreso(ordenSeleccionada.iid);

      if (ordenesPaginadas.length === 1 && paginaActual > 1) {
        setPaginaActual(paginaActual - 1);
      }
      cerrarModal();
    }
  };

  // Sacamos lista única de usuarios para el select
  const usuariosUnicos = Array.from(new Set(ingreso.map((i) => i.usuario_nombre)));

  function exportToExcel() {
  const data = resultadosFiltrados.map((orden) => ({
    Orden: orden.numorden,
    Fecha: orden.fecha ? new Date(orden.fecha).toISOString().split("T")[0] : "",
    Cliente:`${orden.nombre} ${orden.apellido}`,
    Teléfono: orden.telefono,
    Serie: orden.nserie,
    Falla: orden.falla,
    Observaciones: orden.observa,
    "Costo Estimado": orden.costo,
    Repuesto: orden.repuesto,
    "Mano de Obra": orden.manoobra,
    Total: orden.total,
    IVA: orden.iva,
    Presupuesto: orden.presu,
    Salida: orden.salida,
    "Creado por": orden.usuario_nombre,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Órdenes");

  XLSX.writeFile(workbook, "ordenes_filtradas.xlsx");
}

  return (
    <div className="p-4 bg-gray-200 min-h-screen">
      <h1 className="text-2xl text-gray-600 font-bold mb-4">Buscar Orden Técnica</h1>

      {/* Primer filtro (general) */}
      <input
        type="text"
        placeholder="Buscar por número, fecha, cliente..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="p-2 border text-gray-700 rounded w-full mb-4"
      />

      {/* Segundo filtro (Creado por) */}
      <div className="flex items-center gap-5 mb-5" >
        <label className="mr-2 text-gray-700 font-semibold">Creado por:</label>
        <select
          value={filtroUsuario}
          onChange={(e) => setFiltroUsuario(e.target.value)}
          className="border text-gray-700 p-1 rounded"
        >
          <option value="">Todos</option>
          {usuariosUnicos.map((u, idx) => (
            <option key={idx} value={u}>
              {u}
            </option>
          ))}
        </select>

             
      <button
         onClick={exportToExcel}
       className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 shadow mb-3"
       >
  📥 Descargar Excel
      </button>

      </div>
      
      {/* Filas por página */}
      <div className="mb-4">
        <label className="mr-2 text-gray-700 font-semibold">Filas por página:</label>
        <select
          value={filasPorPagina}
          onChange={(e) => setFilasPorPagina(Number(e.target.value))}
          className="border text-gray-700 p-1 rounded"
        >
          <option value={5}>5</option>
          <option value={9}>9</option>
          <option value={15}>15</option>
        </select>
      </div>

      {/* Tabla */}
<div className="flex justify-center">
  <div className="w-full max-w-8xl"> {/* ⬅️ ancho máximo centrado */}
    <table className="min-w-full bg-gray-400 rounded-lg shadow">
      <thead>
        <tr className="bg-gray-800 text-white text-sm uppercase tracking-wide">
          <th className="p-3 text-center">Orden</th>
          <th className="p-3 text-center">Fecha</th>         
          <th className="p-3 text-center">Serie</th>
           <th className="p-3 text-center">Equipo</th>
          <th className="p-3 text-center">Falla</th>          
          <th className="p-3 text-center">Costo Estimado</th>
          <th className="p-3 text-center">Repuesto</th>
          <th className="p-3 text-center">Mano de Obra</th>
          <th className="p-3 text-center">Total</th>
          <th className="p-3 text-center">IVA</th>
          <th className="p-3 text-center">Presupuesto</th>
          <th className="p-3 text-center">Salida</th>
          <th className="p-3 text-center">Creado por</th>
        </tr>
      </thead>
      <tbody>
        {ordenesPaginadas.length === 0 ? (
          <tr>
            <td colSpan="15" className="p-4 text-center text-gray-500">
              No se encontraron resultados.
            </td>
          </tr>
        ) : (
          ordenesPaginadas.map((orden) => (
            <tr
              key={orden.iid}
              className="border-t hover:bg-gray-100 cursor-pointer text-gray-800 text-center"
              onClick={() => abrirModal(orden)}
            >
              <td className="p-2">{orden.numorden}</td>
              <td className="p-2">
                {orden.fecha ? new Date(orden.fecha).toISOString().split("T")[0] : ""}
              </td>             
              <td className="p-2">{orden.nserie}</td>
              <td className="p-2">{orden.equipo}</td>
              <td className="p-2">{orden.falla}</td>              
              <td className="p-2">{orden.costo}</td>
              <td className="p-2">{orden.repuesto}</td>
              <td className="p-2">{orden.manoobra}</td>
              <td className="p-2">{orden.total}</td>
              <td className="p-2">{orden.iva}</td>
              <td className="p-2">{orden.presu}</td>
              <td className="p-2">{orden.salida}</td>
              <td className="p-2">{orden.usuario_nombre}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</div>
      {/* Paginación */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="mt-4 overflow-x-auto">
          <div className="flex items-center gap-1 flex-wrap justify-center">
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((nro) => (
              <button
                key={nro}
                onClick={() => cambiarPagina(nro)}
                className={`px-3 py-1 border rounded ${
                  paginaActual === nro
                    ? "bg-gray-500 text-white"
                    : "bg-gray-900 hover:bg-gray-600"
                }`}
              >
                {nro}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalAbierto && ordenSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 text-gray-700 rounded shadow-md w-full max-w-lg relative">
            <button
              onClick={cerrarModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl text-gray-700 font-bold mb-4">Detalles de la Orden</h2>
            <p>
              <strong>N° Orden:</strong> {ordenSeleccionada.numorden}
            </p>
            <p>
              <strong>Fecha:</strong>  {ordenSeleccionada.fecha ? new Date(ordenSeleccionada.fecha).toISOString().split("T")[0] : ""}
            </p>
            <p>
              <strong>Cliente:</strong> {ordenSeleccionada.nombre}{" "}
              {ordenSeleccionada.apellido}
            </p>
            <p>
              <strong>Telefono:</strong> {ordenSeleccionada.telefono}
            </p>
            <p>
              <strong>Equipo:</strong> {ordenSeleccionada.equipo}
            </p>
            <p>
              <strong>Falla:</strong> {ordenSeleccionada.falla}
            </p>
            <p>
              <p>
              <strong>Observaciones:</strong> {ordenSeleccionada.observa}
            </p>
            <p></p>
              <strong>N° Serie:</strong> {ordenSeleccionada.nserie}
            </p>
            <p>
              <strong>Costo Estimado:</strong> {ordenSeleccionada.costo}
            </p>
            <p>
              <strong>Repuesto:</strong> {ordenSeleccionada.repuesto}
            </p>
            <p>
             <strong>Mano de Obra:</strong> {ordenSeleccionada.manoobra}
            </p>
            <p>
            <strong>Total:</strong> {ordenSeleccionada.total}
            </p>
            <p>
            <strong>IVA:</strong> {ordenSeleccionada.iva}
            </p>
            <p>
              <strong>Presupuesto:</strong> {ordenSeleccionada.presu}
            </p>
            <p>
              <strong>Salida:</strong> {ordenSeleccionada.salida}
            </p>
          
            <p>
              <strong>Creado por:</strong> {ordenSeleccionada.usuario_nombre}
            </p>

            <div className="flex justify-end mt-4 gap-3">
              <button
                onClick={manejarEditar}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Editar
              </button>
              <button
                onClick={manejarEliminar}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Eliminar
              </button>
             <button
                 onClick={() => imprimirOrdenBuscarUno(ordenSeleccionada)}
                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                 >
                  Imprimir
                </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TasksBuscarOrden;
