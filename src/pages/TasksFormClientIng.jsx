import { useForm } from "react-hook-form";
import { useTasks } from "../context/useTasks";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { upDateTasksRequest } from "../api/tasks";

function TasksFromClientIng() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const { createTask } = useTasks();

  const [showModal, setShowModal] = useState(false);
  const [clienteId, setClientId] = useState(null);
  const [formBloqueado, setFormBloqueado] = useState(false);
  const [fueActualizacion, setFueActualizacion] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (clienteId) {
        // Si ya existe → actualizar
        await upDateTasksRequest(clienteId, data);
        setFueActualizacion(true);
        console.log("Cliente actualizado");
      } else {
        // Si no existe → crear
        const id = await createTask(data);
        setClientId(id);
        setFueActualizacion(false);
      }

      setShowModal(true);
      setFormBloqueado(true);
    } catch (error) {
      console.error("Error al guardar/actualizar:", error);
    }
  });

  const handleOk = () => {
    if (clienteId) {
      navigate("/ingresos/nuevo", { state: { client_id: clienteId } });
    } else {
      console.warn("No hay clienteId disponible para redirigir");
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-gray-100 text-black text-center py-2 font-bold text-xl">
          Ingresar Nuevo Cliente
        </div>

        <div className="bg-gray-100 flex items-center justify-center p-4 md:p-10 overflow-auto">
          <div className="w-full max-w-6xl bg-gray-200 p-6 rounded shadow overflow-hidden">
            {/* Sección: Datos de Cliente */}
            <div className="bg-white p-6 rounded-xl shadow mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Datos de Cliente
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                <input
                  type="text"
                  placeholder="Nombre"
                  className="p-2 rounded border w-full text-gray-900"
                  {...register("nombre")}
                  disabled={formBloqueado}
                />
                <input
                  type="text"
                  placeholder="Apellido"
                  className="p-2 rounded border w-full text-gray-900"
                  {...register("apellido")}
                  disabled={formBloqueado}
                />
                <input
                  type="text"
                  placeholder="Teléfono"
                  className="p-2 rounded border w-full text-gray-900"
                  {...register("telefono")}
                  disabled={formBloqueado}
                />
                <input
                  type="email"
                  placeholder="Mail"
                  className="p-2 rounded border w-full text-gray-900"
                  {...register("mail")}
                  disabled={formBloqueado}
                />
              </div>
            </div>

            {/* Línea decorativa con texto */}
            <div className="flex items-center my-8">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500 font-medium w-full">
                Domicilio del Cliente
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Sección: Domicilio */}
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                <input
                  type="text"
                  placeholder="Calle"
                  className="p-2 rounded border w-full text-gray-900"
                  {...register("calle")}
                  disabled={formBloqueado}
                />
                <input
                  type="text"
                  placeholder="N°"
                  className="p-2 rounded border w-full text-gray-900"
                  {...register("numero")}
                  disabled={formBloqueado}
                />
                <input
                  type="text"
                  placeholder="Piso"
                  className="p-2 rounded border w-full text-gray-900"
                  {...register("piso")}
                  disabled={formBloqueado}
                />
                <input
                  type="text"
                  placeholder="Dto"
                  className="p-2 rounded border w-full text-gray-900"
                  {...register("dto")}
                  disabled={formBloqueado}
                />
                <input
                  type="text"
                  placeholder="Provincia"
                  className="p-2 rounded border w-full text-gray-900"
                  {...register("provincia")}
                  disabled={formBloqueado}
                />
                <input
                  type="text"
                  placeholder="Localidad"
                  className="p-2 rounded border w-full text-gray-900"
                  {...register("localidad")}
                  disabled={formBloqueado}
                />
                <input
                  type="text"
                  placeholder="Cod pos"
                  className="p-2 rounded border w-full text-gray-900"
                  {...register("codpost")}
                  disabled={formBloqueado}
                />
              </div>
            </div>
          </div>

          {/* Botones desktop */}
          <div className="grid grid-col-2 my-19">
            <div className="flex flex-col gap-7 m-2 mt-6 md:mt-0">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-red-600 text-center"
              >
                {clienteId ? "Actualizar" : "Guardar"}
              </button>

              {clienteId && (
                <>
                  <button
                    type="button"
                    onClick={() => setFormBloqueado(false)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-red-600 text-center"
                  >
                    Editar
                  </button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded w-full hover:bg-red-600 hidden md:flex">
                    Eliminar
                  </button>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-red-600 hidden md:flex">
                    Imprimir
                  </button>
                </>
              )}

              <button className="bg-indigo-500 text-white px-4 py-2 rounded w-full hover:bg-indigo-600 hidden md:flex">
                <li>
                  <Link to="/">Inicio</Link>
                </li>
              </button>
              <button className="bg-gray-900 text-white px-4 py-2 w-full rounded hidden md:flex">
                Salir
              </button>
            </div>
          </div>
        </div>

        {/* Barra de acciones para celulares */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-2 shadow-lg z-50 md:hidden">
          <div className="grid grid-cols-3 gap-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-red-600 text-center"
            >
              {clienteId ? "Actualizar" : "Guardar"}
            </button>

            {clienteId && (
              <>
                <button
                  type="button"
                  onClick={() => setFormBloqueado(false)}
                  className="bg-yellow-500 text-white py-2 rounded text-sm hover:bg-yellow-600"
                >
                  Editar
                </button>
                <button className="bg-red-500 text-white py-2 rounded text-sm hover:bg-red-600">
                  Eliminar
                </button>
              </>
            )}

            <button className="bg-indigo-500 text-white py-2 rounded text-sm hover:bg-indigo-600 col-span-2">
              <Link to="/">Inicio</Link>
            </button>
            <button className="bg-gray-800 text-white py-2 rounded text-sm hover:bg-gray-900">
              Salir
            </button>
          </div>
        </div>
      </form>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-sm w-full border border-gray-300 animate-scaleIn mx-4">
            <div
              className={`text-5xl mb-2 ${
                fueActualizacion ? "text-yellow-500" : "text-green-600"
              } animate-bounce`}
            >
              {fueActualizacion ? "✏️" : "✅"}
            </div>

            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              {fueActualizacion ? "Cliente actualizado" : "¡Cliente guardado!"}
            </h2>
            <p className="text-gray-800 mb-4">
              El ID del cliente es:{" "}
              <strong>{clienteId ?? "No disponible"}</strong>
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleOk}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                OK
              </button>
              <button
                onClick={handleClose}
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

export default TasksFromClientIng;