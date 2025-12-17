import { useState, useEffect } from "react";
import { useTasks } from "../context/useTasks";
import { useNavigate } from "react-router-dom";
import { getTodosIngresosRequest } from "../api/ingresos";
import * as XLSX from "xlsx";
import { imprimirOrdenBuscarUno } from "../imprimirOrdenBuscarUno.js";
import { exportarIngresosExcel } from "../exportExcel";

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

  const mostrarMonto = (v) => (v > 0 ? v : "-");

  // Sacamos lista única de usuarios para el select
  const usuariosUnicos = Array.from(new Set(ingreso.map((i) => i.usuario_nombre)));

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
         onClick={() => exportarIngresosExcel (resultadosFiltrados)} 
       className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 shadow mb-3"
       >
    Descargar Excel
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
         
          <th className="p-3 text-center">Repuesto</th>
          <th className="p-3 text-center">Mano de Obra</th>
          <th className="p-3 text-center">IVA</th>
          <th className="p-3 text-center">Total</th>
          
          <th className="p-3 text-center">Garantia</th>
          <th className="p-3 text-center">Orden Cerrada</th>
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
    ordenesPaginadas.map((orden) => {
      //const esCerrada = orden.salida && orden.salida !== "";

      return (
        <tr
  key={orden.iid}
  className={`border-t text-center
    ${orden.salida
      ? "bg-gray-900 text-white cursor-not-allowed opacity-80"
      : "cursor-pointer text-gray-800 hover:bg-gray-100"
    }`}
  onClick={() => !orden.salida && abrirModal(orden)}
>
          <td className="p-2">{orden.numorden}</td>

          <td className="p-2">
            {orden.fecha
              ? new Date(orden.fecha).toISOString().split("T")[0]
              : ""}
          </td>
          
          

          <td className="p-2">{orden.nserie}</td>
          <td className="p-2">{orden.equipo}</td>
          <td className="p-2">{orden.falla}</td>
          
          <td>{mostrarMonto(orden.repuesto)}</td>
          <td>{mostrarMonto(orden.manoobra)}</td>
         

          {/* IVA: solo badge */}
          <td className="p-2">
            <span
              className={`px-2 py-1 rounded-lg font-semibold  ${
                orden.iva === "Sí"
                  ? "bg-green-300 text-green-800"
                  : orden.iva === "No"
                  ? "" : ""
              }`}
            >
              {orden.iva || ""}
            </span>
          </td>
           <td>{mostrarMonto(orden.total)}</td>

          {/* PRESU (garantía): solo badge */}
          <td className="p-2">
            <span
              className={`px-2 py-1 rounded-lg font-semibold ${
                orden.presu === "Sí"
                  ? "bg-green-300 text-green-800 "
                  
                  : ""
              }`}
            >
              {orden.presu}
            </span>
          </td>

          {/* SALIDA: si tiene → negro con letras blancas */}
         <td className="p-2">
  {orden.salida && (
    <span
      className="px-2 py-1 rounded-lg font-semibold text-xs flex items-center justify-center gap-1 bg-gray-950 text-white truncate"
      title="Orden cerrada"
    >
      <span>
        {new Date(orden.salida).toISOString().split("T")[0]}
      </span>
      <span className="text-yellow-400">🔒</span>
    </span>
  )}
</td>

          <td className="p-2">{orden.usuario_nombre}</td>
        </tr>
      );
    })
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
  <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl relative overflow-hidden">

      {/* HEADER */}
      <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-700">
            Orden Técnica #{ordenSeleccionada.numorden}
          </h2>
          <p className="text-sm text-gray-500">
            {ordenSeleccionada.fecha
              ? new Date(ordenSeleccionada.fecha).toISOString().split("T")[0]
              : ""}
          </p>
        </div>

        {ordenSeleccionada.salida && (
          <span className="px-3 py-1 text-sm rounded-full bg-gray-900 text-white flex items-center gap-1">
            🔒 Orden cerrada
          </span>
        )}

        <button
          onClick={cerrarModal}
          className="text-gray-400 hover:text-black text-2xl"
        >
          &times;
        </button>
      </div>

      {/* BODY */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 text-sm">

        {/* CLIENTE */}
        <div>
          <h3 className="font-semibold text-gray-600 mb-2">Cliente</h3>
          <p><b>Nombre:</b> {ordenSeleccionada.nombre} {ordenSeleccionada.apellido}</p>
          <p><b>Teléfono:</b> {ordenSeleccionada.telefono}</p>
        </div>

        {/* EQUIPO */}
        <div>
          <h3 className="font-semibold text-gray-600 mb-2">Equipo</h3>
          <p><b>Equipo:</b> {ordenSeleccionada.equipo}</p>
          <p><b>N° Serie:</b> {ordenSeleccionada.nserie}</p>
        </div>

        {/* FALLA */}
        <div className="md:col-span-2">
          <h3 className="font-semibold text-gray-600 mb-2">Falla / Observaciones</h3>
          <p className="bg-gray-100 rounded p-3">
            {ordenSeleccionada.falla || ordenSeleccionada.observa || "-"}
          </p>
        </div>

        {/* COSTOS */}
        <div>
          <h3 className="font-semibold text-gray-600 mb-2">Costos</h3>
          <p><b>Repuesto:</b> ${ordenSeleccionada.repuesto || "-"}</p>
          <p><b>Mano de obra:</b> ${ordenSeleccionada.manoobra || "-"}</p>
          <p><b>IVA:</b> {ordenSeleccionada.iva}</p>
        </div>

        {/* FACTURACIÓN */}
        <div>
          <h3 className="font-semibold text-gray-600 mb-2">Facturación</h3>
          <p className="text-lg font-bold text-gray-800">
            Total: ${ordenSeleccionada.total}
          </p>
          <p><b>Garantía</b> {ordenSeleccionada.presu}</p>
          
        </div>

        {/* FOOTER INFO */}
        <div className="md:col-span-2 text-xs text-gray-500 border-t pt-3">
          Creado por: <b>{ordenSeleccionada.usuario_nombre}</b>
          {ordenSeleccionada.salida && (
            <>
              {" · "}Salida:{" "}
              {new Date(ordenSeleccionada.salida).toISOString().split("T")[0]}
            </>
          )}
        </div>
      </div>

      {/* FOOTER BUTTONS */}
      <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">

        {!ordenSeleccionada.salida && (
          <button
            onClick={manejarEditar}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Editar
          </button>
        )}

        <button
          onClick={manejarEliminar}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Eliminar
        </button>

        <button
          onClick={() => imprimirIngreso(ordenSeleccionada)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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
