import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 para redirigir al editar
import { getIngresosRequest } from "../api/ingresos";
import { deleteIngresoRequest } from "../api/ingresos"; // 👈 asegúrate de tener esta función en tu API

const ITEMS_PER_PAGE = 10;

function TasksPage() {
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedIngreso, setSelectedIngreso] = useState(null); // modal
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIngresos = async () => {
      try {
        const { data } = await getIngresosRequest();
        const sorted = [...data].sort(
          (a, b) => new Date(b.fecha) - new Date(a.fecha)
        );
        setIngresos(sorted);
      } catch (err) {
        console.error("Error cargando ingresos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchIngresos();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta orden?")) return;
    try {
      await deleteIngresoRequest(id);
      setIngresos((prev) => prev.filter((ing) => ing.iid !== id));
      setSelectedIngreso(null); // cerrar modal
    } catch (err) {
      console.error("Error eliminando ingreso:", err);
    }
  };

  if (loading) return <p className="text-center mt-6">Cargando…</p>;
  if (!Array.isArray(ingresos)) return <p>Error: datos inesperados</p>;
  if (ingresos.length === 0)
    return <h1 className="text-center mt-6">No hay ingresos</h1>;

  const totalPages = Math.ceil(ingresos.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const currentItems = ingresos.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <>
      <div className="min-h-screen bg-gray-200 flex flex-col items-center p-4">
        <h1 className="text-2xl text-gray-600 font-bold mb-4">Lista de mis Ordenes</h1>

        <div className="overflow-x-auto w-full max-w-9xl">
          <table className="table-auto w-full bg-gray-700 rounded-lg shadow">
            <thead className="bg-gray-900 sticky top-0">
              <tr className="text-sm font-semibold text-left">
                <th className="px-4 py-2">#Orden</th>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2">Cliente</th>
                <th className="px-4 py-2">Equipo</th>
                <th className="px-4 py-2">Falla</th>
                <th className="px-4 py-2 text-right">Costo</th>
              </tr>
            </thead>

            <tbody>
              {currentItems.map((ingreso, idx) => (
                <tr
                  key={`${ingreso.iid}-${idx}`}
                  className="border-b odd:bg-gray-600 hover:bg-sky-950 transition-colors cursor-pointer"
                  onClick={() => setSelectedIngreso(ingreso)}
                >
                  <td className="px-4 py-2 font-mono whitespace-nowrap">
                    {ingreso.numorden}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {new Date(ingreso.fecha).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    {ingreso.nombre} {ingreso.apellido}
                  </td>
                  <td className="px-4 py-2">{ingreso.equipo}</td>
                  <td className="px-4 py-2">{ingreso.falla}</td>
                  <td className="px-4 py-2 text-right">${ingreso.costo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="w-full max-w-9xl overflow-x-auto mt-4">
          <div className="flex gap-2 justify-center min-w-max">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 0}
              className="px-3 py-1 bg-gray-500 rounded disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`px-3 py-1 rounded ${
                  i === currentPage
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-500 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages - 1}
              className="px-3 py-1 bg-gray-500 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedIngreso && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center text-gray-600 font-bold justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl text-gray-600 font-bold mb-4">
              Orden #{selectedIngreso.numorden}
            </h2>
            <p><strong>Fecha:</strong> {new Date(selectedIngreso.fecha).toLocaleDateString()}</p>
            <p><strong>Cliente:</strong> {selectedIngreso.nombre} {selectedIngreso.apellido}</p>
            <p><strong>Equipo:</strong> {selectedIngreso.equipo}</p>
            <p><strong>Falla:</strong> {selectedIngreso.falla}</p>
            <p><strong>Costo Estimado:</strong> ${selectedIngreso.costo}</p>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => navigate(`/ingresos/${selectedIngreso.iid}`)} // 👈 editar
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Editar
              </button>

              <button
                onClick={() => handleDelete(selectedIngreso.iid)} // 👈 eliminar
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Eliminar
              </button>

              <button
                onClick={() => setSelectedIngreso(null)} // 👈 cerrar
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TasksPage;