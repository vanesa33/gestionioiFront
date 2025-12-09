import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getIngresoRequest, upDateingresoRequest, deleteIngresoRequest } from "../api/ingresos";


function EditarOrden() {
  const { iid } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  const [numOrden, setNumOrden] = useState(iid);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res = await getIngresoRequest(iid);
        const data = res.data;

        reset({
          equipo: data.equipo ?? "",
          falla: data.falla ?? "",
          observa: data.observa ?? "",
          fecha: data.fecha ? data.fecha.split("T")[0] : "",
          nserie: data.nserie ?? "",
          costo: data.costo ?? "",
          repuesto: data.repuesto ?? "",
          manoobra: data.manoobra ?? "",
          total: data.total ?? "",
          iva: data.iva ?? "",
          presu: data.presu ?? "",
          salida: data.salida ? data.salida.split("T")[0] : "",
          imagenurl: data.imagenurl ?? "",
          client_id: data.client_id ?? ""
        });

        setNumOrden(data.numorden ?? iid);
      } catch (error) {
        console.error("Error al cargar los datos de la orden:", error);
      }
    };

    cargarDatos();
  }, [iid, reset]);

  const onSubmit = async (data) => {
    try {
          
      data.costo = data.costo ? Number(data.costo) : null;
      data.repuesto = data.repuesto ? Number(data.repuesto) : null;


      await upDateingresoRequest(iid, data);
      alert("Orden actualizada con éxito");
navigate(`/ingresos/todos`);
    } catch (error) {
      console.error("Error al actualizar la orden:", error);
      alert("Hubo un error al guardar los cambios");
    }
  };

const handleDelete = async () => {
    if(window.confirm("Seguro que deseas eliminar esta orden?")) {
        try {
            await deleteIngresoRequest(iid);
            alert("Orden eliminada con éxito");
            navigate("/tasks/Buscarorden");
        } catch (error) {
            console.error("Error al eliminar la orden:", error);
            alert("Hubo un erro al eliminar la orden");
        }
    }
};


  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
        Editar Orden Técnica #{numOrden}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-semibold text-gray-600">Equipo</label>
          <input
            type="text"
            {...register("equipo")}
            className="w-full border border-gray-300 p-2 rounded text-gray-600"
            placeholder="Ingrese el equipo"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-600">Falla</label>
          <input
            type="text"
            {...register("falla")}
            className="w-full border border-gray-300 p-2 rounded text-gray-600"
            placeholder="Ingrese la falla"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-600">Observaciones</label>
          <input
            type="text"
            {...register("observa")}
            className="w-full border border-gray-300 p-2 rounded text-gray-600"
            placeholder="Observaciones"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-600">Fecha</label>
          <input
            type="date"
            {...register("fecha")}
            className="w-full border border-gray-300 p-2 rounded text-gray-600"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-600">N° Serie</label>
          <input
            type="text"
            {...register("nserie")}
            className="w-full border border-gray-300 p-2 rounded text-gray-600"
            placeholder="Número de serie"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-600">Costo Estimado</label>
          <input
            type="number"
            {...register("costo")}
            className="w-full border border-gray-300 p-2 rounded text-gray-600"
            placeholder="Costo estimado"
          />
        </div>

         <div>
          <label className="block font-semibold text-gray-600">Costo de Repuesto</label>
          <input
            type="number"
            {...register("repuesto")}
            className="w-full border border-gray-300 p-2 rounded text-gray-600"
            placeholder="$"
          />
        </div>

         <div>
          <label className="block font-semibold text-gray-600">Mano de Obra</label>
          <input
            type="number"
            {...register("manoobra")}
            className="w-full border border-gray-300 p-2 rounded text-gray-600"
            placeholder="$"
          />
        </div>

         <div>
          <label className="block font-semibold text-gray-600">Total</label>
          <input
            type="number"
            {...register("total")}
            className="w-full border border-gray-300 p-2 rounded text-gray-600"
            placeholder="$"
          />
        </div>

         <div>
         <label className="block font-semibold text-gray-600">IVA</label>
           <select className="p-2 rounded border block font-semibold text-gray-600"  {...register("iva")}>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
        </div>

         <div>
          <label className="block font-semibold text-gray-600">Garantía</label>

          <select className="p-2 rounded border block font-semibold text-gray-600"  {...register("presu")}>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
                </div>
        </div>

         <div>
          <label className="block font-semibold text-gray-600">Fecha de Salida</label>
          <input
            type="date"
            {...register("salida")}
            className="w-full border border-gray-300 p-2 rounded text-gray-600"
            placeholder=""
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-600">Imagen URL</label>
          <input
            type="text"
            {...register("imagenurl")}
            className="w-full border border-gray-300 p-2 rounded text-gray-600"
            placeholder="URL de imagen (opcional)"
          />
        </div>

        <div className="text-gray-500 text-sm">
          ID del cliente asignado:{" "}
          <span className="font-bold text-gray-700">
            {/* Este valor ya estará en el form si lo envía el backend */}
            <input
              type="text"
              {...register("client_id")}
              className="border border-gray-300 p-1 rounded text-gray-600"
              readOnly
            />
          </span>
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
          >
            Guardar Cambios
          </button>

            <button
             type="button"
             onClick={handleDelete}
             className="bg-red-500 text-white px-6 py-2 rounded shadow
             hover:bg-red-600">
                  Eliminar Orden
            </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded shadow"
          >
            Cancelar
          </button>
        </div>
                        
      </form>
    </div>

  
  );
}

export default EditarOrden;
