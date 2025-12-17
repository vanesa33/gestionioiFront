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
          <td>{mostrarMonto(orden.total)}</td>

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 text-gray-700 rounded shadow-md w-full max-w-lg relative">
            <button
              onClick={cerrarModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl text-gray-700 font-bold mb-4">Detalles de la Orden</h2>
            <>
              <strong>N° Orden:</strong> {ordenSeleccionada.numorden}
            </>
            <>
              <strong>Fecha:</strong> {ordenSeleccionada.fecha}
            </>
            <>
              <strong>Cliente:</strong> {ordenSeleccionada.nombre}{" "}
              {ordenSeleccionada.apellido}
            </>
            <>
              <strong>Telefono:</strong> {ordenSeleccionada.telefono}
            </>
            <>
              <strong>Equipo:</strong> {ordenSeleccionada.equipo}
            </>
            <>
              <strong>Falla:</strong> {ordenSeleccionada.falla}
            </>
            <>
              <>
              <strong>Observaciones:</strong> {ordenSeleccionada.observa}
            </>
            <></>
              <strong>N° Serie:</strong> {ordenSeleccionada.nserie}
            </>
            
            
            <>
             <strong>Mano de Obra:</strong> {ordenSeleccionada.manoobra}
            </>
            <>
              <strong>Costo de Repuesto</strong> {ordenSeleccionada.repuesto}
            </>
              <>
            <strong>IVA:</strong> {ordenSeleccionada.iva}
            </>
            <>
            <strong>Total:</strong> {ordenSeleccionada.total}
            </>
            
          
            <>
              <strong>Garantía</strong> {ordenSeleccionada.presu}
            </>
          
          
            <>
              <strong>Creado por:</strong> {ordenSeleccionada.usuario_nombre}
            </>

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
                onClick={() => {
                  imprimirOrdenBuscarUno(ordenSeleccionada);
                }}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
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
