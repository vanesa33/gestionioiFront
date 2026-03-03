import { useState, useEffect } from "react";
import { useTasks } from "../context/useTasks";
import { useNavigate } from "react-router-dom";
import { getTodosIngresosRequest } from "../api/ingresos";
import * as XLSX from "xlsx";
import { imprimirOrdenBuscarUno } from "../imprimirOrdenBuscarUno.js";
import { exportarIngresosExcel } from "../exportExcel";

const fechaNumero = (f) => {
  if (!f) return null;
  return new Date(f.split("T")[0]).getTime();
};

function TasksBuscarOrden() {
  const {  deleteIngreso } = useTasks();

  const [ingreso, setIngreso] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  
  const [filtroUsuario, setFiltroUsuario] = useState(""); // ⬅️ agregado

  const [filtroTipo, setFiltroTipo] = useState(""); // ⬅️ agregado


  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");


  const [filtroEstado, setFiltroEstado] = useState("TODAS"); // ⬅️ agregado
  // valores posibles: "TODAS", "ABIERTAS", "CERRADAS"

  const [paginaActual, setPaginaActual] = useState(1);
  const [filasPorPagina, setFilasPorPagina] = useState(9);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const navigate = useNavigate();

  const ordenCerrada = Boolean(ordenSeleccionada?.salida);


  // 📅 Formatear fecha a DD/MM/AAAA
const formatearFecha = (fecha) => {
  if (!fecha) return "";

  // Si viene del input type="date" → YYYY-MM-DD
  if (typeof fecha === "string" && fecha.length === 10) {
    const [anio, mes, dia] = fecha.split("-");
    return `${dia}/${mes}/${anio}`;
  }

  // Si viene del backend (ISO / timestamp)
  const d = new Date(fecha);

  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const anio = d.getFullYear();

  return `${dia}/${mes}/${anio}`;
};


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
  }, [busqueda, filtroUsuario, filtroTipo, filasPorPagina, fechaDesde, fechaHasta]); // ⬅️ ahora también escucha filtroUsuario

  if (!Array.isArray(ingreso)) {
    return <div className="p-4">Cargando ingresos...</div>;
  }

   // eslint-disable-next-line no-unused-vars
   const normalizarDate = (fecha) => {
    if (!fecha) return null;
    const d = new Date(fecha);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  // 📅 Formatear fecha correctamente (input + backend)

  // eslint-disable-next-line no-unused-vars
  const fechaNumber = (f) => {
  if (!f) return null;
  return new Date(f.split("T")[0]).getTime();
};

// eslint-disable-next-line no-unused-vars
const toDateOnly = (fecha) => {
  const d = new Date(fecha);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};



  // Filtro general
 // eslint-disable-next-line no-unused-vars
 const textoBusqueda = busqueda.toLowerCase().trim();

const resultadosFiltrados = ingreso.filter((o) => {
  const texto = busqueda.toLowerCase();

  const coincideEstado =
  filtroEstado === "TODAS" ||
  (filtroEstado === "CERRADAS" && o.salida) ||
  (filtroEstado === "ABIERTAS" && !o.salida);

  // 🔎 texto (igual que antes)
  const coincideTexto =
    o.nombre?.toLowerCase().includes(texto) ||
    o.apellido?.toLowerCase().includes(texto) ||
    String(o.telefono || "").includes(texto) ||
    String(o.nserie || "").includes(texto) ||
    o.usuario_nombre?.toLowerCase().includes(texto) ||
    o.presu?.toLowerCase().includes(texto);

  // 👤 usuario
  const coincideUsuario =
    !filtroUsuario || o.usuario_nombre === filtroUsuario;

  // 🔧 tipo
  const coincideTipo =
    !filtroTipo ||
    filtroTipo === "TODOS" ||
    o.tipo_orden === filtroTipo.toLowerCase();

  // 📅 FECHA (cerrada o no)
  let coincideFecha = true;

  if (fechaDesde || fechaHasta) {
    const fechaBase = o.salida || o.fecha; // 👈 CLAVE
    const fechaOrd = fechaNumero(fechaBase);

    if (!fechaOrd) return false;

    if (fechaDesde && fechaOrd < fechaNumero(fechaDesde)) return false;
    if (fechaHasta && fechaOrd > fechaNumero(fechaHasta)) return false;
  }

  return coincideTexto && coincideUsuario && coincideTipo && coincideFecha &&  coincideTexto &&
  coincideUsuario && coincideTipo && coincideEstado;
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

  const hoy = () => {
  const today = new Date().toISOString().split("T")[0];
  setFechaDesde(today);
  setFechaHasta(today);
};


const ultimos7Dias = () => {
  const hoy = new Date();
  const desde = new Date();
  desde.setDate(hoy.getDate() - 7);

  setFechaDesde(desde.toISOString().split("T")[0]);
  setFechaHasta(hoy.toISOString().split("T")[0]);
};


const esteMes = () => {
  const ahora = new Date();
  const desde = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
  const hasta = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0);

  setFechaDesde(desde.toISOString().split("T")[0]);
  setFechaHasta(hasta.toISOString().split("T")[0]);
};

  return (
    
    <div className="bg-gray-200 min-h-screen px-2 md:px-8 py-6">
      <div className="max-w-5xl mx-auto">
      <div>
      <h1 className="text-2xl text-gray-600 font-bold mb-4">Buscar Orden Técnica</h1>
       
      {/* Primer filtro (general) */}
      <input
        type="text"
        placeholder="Buscar por número, cliente, cerrada..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="p-2 border text-gray-700 rounded w-full mb-4"
      />
      </div>

    <div className="flex flex-wrap items-end gap-5 mb-5">

  {/* FECHA DESDE */}
  <div className="flex flex-col">
    <label className="text-gray-700 text-sm font-semibold">Desde</label>
    <input
      type="date"
      value={fechaDesde}
      onChange={(e) => setFechaDesde(e.target.value)}
      className="border p-2 rounded text-gray-700"
    />
  </div>

  {/* FECHA HASTA */}
  <div className="flex flex-col">
    <label className="text-gray-700 text-sm font-semibold">Hasta</label>
    <input
      type="date"
      value={fechaHasta}
      onChange={(e) => setFechaHasta(e.target.value)}
      className="border p-2 rounded text-gray-700"
    />
  </div>

  {/* PRESETS DE FECHA */}
<div className="flex gap-2">
  <button
    onClick={hoy}
    className="h-[42px] px-3 bg-gray-300 rounded hover:bg-gray-400"
  >
    🗓️ Hoy
  </button>

  <button
   onClick={ultimos7Dias}
    className="h-[42px] px-3 bg-gray-300 rounded hover:bg-gray-400"
  >
    ⏱️ 7 días
  </button>

  <button
   onClick={esteMes}
    className="h-[42px] px-3 bg-gray-300 rounded hover:bg-gray-400"
  >
    📆 Este mes
  </button>
</div>

  {/* LIMPIAR FECHAS */}
  {(fechaDesde || fechaHasta) && (
    <button
      onClick={() => {
        setFechaDesde("");
        setFechaHasta("");
      }}
      className="h-[42px] bg-gray-600 text-white px-3 rounded hover:bg-gray-700"
    >
      Limpiar
    </button>
  )}

  {/* TIPO ORDEN */}
  <div className="flex flex-col">
    <label className="text-gray-700 text-sm font-semibold">Tipo</label>
    <select
      value={filtroTipo}
      onChange={(e) => setFiltroTipo(e.target.value)}
      className="border p-2 rounded text-gray-700"
    >
      <option value="TODOS">Todas</option>
      <option value="REPARACION">Reparación</option>
      <option value="SERVICE">Service</option>
    </select>
  </div>

  {/* USUARIO */}
  <div className="flex flex-col">
    <label className="text-gray-700 text-sm font-semibold">Creado por</label>
    <select
      value={filtroUsuario}
      onChange={(e) => setFiltroUsuario(e.target.value)}
      className="border p-2 rounded text-gray-700"
    >
      <option value="">Todos</option>
      {usuariosUnicos.map((u, idx) => (
        <option key={idx} value={u}>
          {u}
        </option>
      ))}
    </select>
  </div>

  {/* EXPORTAR */}
  <button
    onClick={() => exportarIngresosExcel(resultadosFiltrados)}
    className="h-[42px] bg-green-600 text-white px-4 rounded hover:bg-green-700 shadow"
  >
    Descargar Excel
  </button>

   <div>
  <label className="block text-gray-700 text-sm font-semibold">
    Estado
  </label>

  <select
    value={filtroEstado}
    onChange={(e) => setFiltroEstado(e.target.value)}
    className="border p-2 rounded text-gray-700"
  >
    <option value="TODAS">Todas</option>
    <option value="CERRADAS">Cerradas</option>
    <option value="ABIERTAS">Abiertas</option>
  </select>
</div>

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
           <th className="p-3 text-center">Tipo</th>
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
     onClick={() => abrirModal(orden)}
>
          <td className="p-2">{orden.numorden_visual || orden.numorden}</td>

          
          
          <td className="p-2">
  <span
    className={`px-2 py-1 rounded text-xs font-bold
      ${orden.tipo_orden === "service"
        ? "bg-blue-100 text-blue-800"
        : "bg-green-100 text-green-800"}
    `}
  >
    {orden.tipo_orden.toLowerCase() === "service" ? "Service" : "reparacion"}
  </span>
</td>

<td className="p-2">
            {
               formatearFecha(orden.fecha)
              }
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
        {formatearFecha(orden.salida)}
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
            {formatearFecha(ordenSeleccionada.fecha)}
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
              {formatearFecha(ordenSeleccionada.salida)}
            </>
          )}
        </div>
      </div>

      {/* FOOTER BUTTONS */}
<div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
  {/* EDITAR */}
 <button
  onClick={!ordenCerrada ? manejarEditar : undefined}
  disabled={ordenCerrada}
  title={
    ordenCerrada
      ? "Orden cerrada. Contacte al administrador"
      : "Editar orden"
  }
  className={`px-4 py-2 rounded font-semibold
    ${
      ordenCerrada
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
    }
  `}
>
  Editar
</button>

  {/* ELIMINAR */}
  <button
    onClick={manejarEliminar}
    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
  >
    Eliminar
  </button>

  {/* IMPRIMIR */}
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
