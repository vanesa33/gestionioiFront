import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function BuscarClienteOrden() {
  const { register, handleSubmit} = useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [cliente, setCliente] = useState(null);
  const [formHabilitado, setFormHabilitado] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    // Simulación de búsqueda cliente (acá llamarías a tu API real)
    const fakeCliente = {
      id: data.client_id,
      nombre: "Juan Pérez",
      telefono: "123456789",
      email: "juan@mail.com",
    };

    setCliente(fakeCliente);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setFormHabilitado(true); // habilita el resto del formulario
  };

  return (
    <div className="flex justify-center items-center min-h-screen text-gray-800 bg-gray-100 p-6">
      <div className="w-full max-w-3xl bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Crear Orden Técnica
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Buscar Cliente */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ingrese ID Cliente"
              {...register("client_id", { required: true })}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={formHabilitado} // una vez confirmado, no se vuelve a editar
            />
            {!formHabilitado && (
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
              >
                Buscar
              </button>
            )}
          </div>

          {/* Campos del formulario de orden */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <input
              type="text"
              placeholder="Equipo"
              {...register("equipo")}
              disabled={!formHabilitado}
              className="p-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Número de Serie"
              {...register("nserie")}
              disabled={!formHabilitado}
              className="p-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Falla"
              {...register("falla")}
              disabled={!formHabilitado}
              className="p-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Observaciones"
              {...register("observa")}
              disabled={!formHabilitado}
              className="p-2 border border-gray-300 rounded-lg"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Costo"
              {...register("costo")}
              disabled={!formHabilitado}
              className="p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {formHabilitado && (
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-6 w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Guardar Orden
            </button>
          )}
        </form>
      </div>

      {/* Modal de cliente */}
      {modalOpen && cliente && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Datos del Cliente
            </h2>
            <p>
              <strong>ID:</strong> {cliente.id}
            </p>
            <p>
              <strong>Nombre:</strong> {cliente.nombre}
            </p>
            <p>
              <strong>Teléfono:</strong> {cliente.telefono}
            </p>
            <p>
              <strong>Email:</strong> {cliente.email}
            </p>

            <button
              onClick={cerrarModal}
              className="mt-6 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BuscarClienteOrden;