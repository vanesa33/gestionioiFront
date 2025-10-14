import { useForm } from "react-hook-form";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { deleteTasksRequest, upDateTasksRequest } from "../api/tasks"; // tu función API para PUT cliente
//import { upDateTask } from "../context/TasksProvider.jsx";
//import { useTasks } from "../context/useTasks.js";

function EditClientForm() {
  const { register, handleSubmit, reset } = useForm();
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  //const { upDateTask } = useTasks();
  
  // precargar datos del cliente que vino desde BuscarClientes
  useEffect(() => {
    if (state?.cliente) {
      reset(state.cliente);
    }
  }, [state, reset]);

  const onSubmit = async (task) => {
    try {
      await upDateTasksRequest(id, task); // PUT cliente
      navigate("/tasks/buscar"); // volver a lista de clientes
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
    }
  };

  const handleDelete = async () => {
      if(window.confirm("Seguro que deseas eliminar este cliente?")) {
          try {
              await deleteTasksRequest(id);
              alert("Cliente eliminado con éxito");
              navigate("/tasks/buscar");
          } catch (error) {
              console.error("Error al eliminar la cliente:", error);
              alert("Hubo un erro al eliminar el cliente");
          }
      }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl text-gray-700 mx-auto bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <h2 className="text-2xl font-bold col-span-2 mb-4 text-center">
        Editar Cliente
      </h2>

      {/* Nombre */}
      <div>
        <label className="block mb-1">Nombre</label>
        <input {...register("nombre")} className="w-full border p-2 rounded" />
      </div>

      {/* Apellido */}
      <div>
        <label className="block mb-1">Apellido</label>
        <input {...register("apellido")} className="w-full border p-2 rounded" />
      </div>

      {/* Teléfono */}
      <div>
        <label className="block mb-1">Teléfono</label>
        <input {...register("telefono")} className="w-full border p-2 rounded" />
      </div>

      {/* Mail */}
      <div>
        <label className="block mb-1">Mail</label>
        <input {...register("mail")} className="w-full border p-2 rounded" />
      </div>

      {/* Domicilio */}
      <div className="col-span-2">
        <label className="block mb-1">Domicilio</label>
        <input {...register("domicilio")} className="w-full border p-2 rounded" />
      </div>

      {/* Localidad */}
      <div>
        <label className="block mb-1">Localidad</label>
        <input {...register("localidad")} className="w-full border p-2 rounded" />
      </div>

      {/* Provincia */}
      <div>
        <label className="block mb-1">Provincia</label>
        <input {...register("provincia")} className="w-full border p-2 rounded" />
      </div>

      {/* Botones */}
      <div className="col-span-2 flex justify-between mt-4">
        <button
          type="button"
          onClick={() => navigate("/tasks/buscar")}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancelar
        </button>

         <button
             type="button"
             onClick={handleDelete}
             className="bg-red-500 text-white px-6 py-2 rounded shadow
             hover:bg-red-600">
                  Eliminar Cliente
            </button>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Guardar cambios
        </button>
      </div>
    </form>
  );
}

export default EditClientForm;