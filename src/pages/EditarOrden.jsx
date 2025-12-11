import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getIngresoRequest, upDateingresoRequest, deleteIngresoRequest } from "../api/ingresos";

function EditarOrden() {
  const { iid } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const [numOrden, setNumOrden] = useState(iid);

  // watch para estilos y cálculos
  const costo = watch("costo") || 0;
  const repuesto = watch("repuesto") || 0;
  const manoobra = watch("manoobra") || 0;
  const ivaWatch = watch("iva");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res = await getIngresoRequest(iid);
        const data = res.data;

        console.log("IVA desde la BD raw:", data.iva); // <- mira esto

        // Normalizamos IVA: si DB trae "Sí" -> "Sí", si trae "No" -> "No", si trae null/otro -> "No"
        const ivaNormalizado = data.iva === "Sí" ? "Sí" : "No";

        reset({
          equipo: data.equipo ?? "",
          falla: data.falla ?? "",
          observa: data.observa ?? "",
          fecha: data.fecha ? data.fecha.split("T")[0] : "",
          nserie: data.nserie ?? "",
          costo: data.costo ?? 0,
          repuesto: data.repuesto ?? 0,
          manoobra: data.manoobra ?? 0,
          total: data.total ?? 0,
          iva: ivaNormalizado,
          presu: data.presu ?? "No",
          salida: data.salida ? data.salida.split("T")[0] : "",
          imagenurl: data.imagenurl ?? "",
          client_id: data.client_id ?? ""
        });

        // calcula campos dependientes visuales
        const sumaBase = Number(data.costo || 0) + Number(data.repuesto || 0) + Number(data.manoobra || 0);
        const montoIva = ivaNormalizado === "Sí" ? sumaBase * 0.21 : 0;

        setValue("totalSinIva", sumaBase.toFixed(2));
        setValue("montoIva", montoIva.toFixed(2));
        setValue("total", (ivaNormalizado === "Sí" ? sumaBase * 1.21 : sumaBase).toFixed(2));

        setNumOrden(data.numorden ?? iid);
      } catch (error) {
        console.error("Error al cargar los datos de la orden:", error);
      }
    };

    cargarDatos();
  }, [iid, reset, setValue]);

  // recalcular cuando cambian costos/iva en el formulario
  useEffect(() => {
    const sumaBase = Number(costo || 0) + Number(repuesto || 0) + Number(manoobra || 0);
    const montoIva = ivaWatch === "Sí" ? sumaBase * 0.21 : 0;
    const totalFinal = ivaWatch === "Sí" ? sumaBase * 1.21 : sumaBase;

    setValue("totalSinIva", sumaBase.toFixed(2));
    setValue("montoIva", montoIva.toFixed(2));
    setValue("total", totalFinal.toFixed(2));
  }, [costo, repuesto, manoobra, ivaWatch, setValue]);

  const onSubmit = async (data) => {
    try {
      // logs para debug
      console.log("Antes de normalizar (DATA enviado):", data);

      // Asegurarse que los números sean números
      data.costo = data.costo ? Number(data.costo) : 0;
      data.repuesto = data.repuesto ? Number(data.repuesto) : 0;
      data.manoobra = data.manoobra ? Number(data.manoobra) : 0;
      data.montoIva = data.montoIva ? Number(data.montoIva) : 0;
      data.totalSinIva = data.totalSinIva ? Number(data.totalSinIva) : 0;
      data.total = data.total ? Number(data.total) : 0;

      // --- Normalizar IVA según lo que espere tu backend ---
      // Opción A: el backend espera texto "Sí"/"No" (DB columna text/varchar)
      data.iva = data.iva === "Sí" ? "Sí" : "No";

      // // Opción B: el backend espera boolean true/false (si tu columna es boolean)
      // data.iva = data.iva === "Sí";

      // // Opción C: el backend espera 1/0 (si tu columna es integer tinyint)
      // data.iva = data.iva === "Sí" ? 1 : 0;

      console.log("Antes del request - payload final:", data);

      const resp = await upDateingresoRequest(iid, data);
      console.log("RESPUESTA BACKEND:", resp && resp.data ? resp.data : resp);

      alert("Orden actualizada con éxito");
      navigate(`/ingresos/todos`);
    } catch (error) {
      console.error("Error al actualizar la orden:", error);
      alert("Hubo un error al guardar los cambios");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Seguro que deseas eliminar esta orden?")) {
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
        {/* ... otros inputs ... */}

        <div>
          <label className="block font-semibold text-gray-600">IVA</label>
          <select {...register("iva")} className="p-2 rounded border block font-semibold text-gray-600">
            <option value="Sí">Sí</option>
            <option value="No">No</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-gray-600">Total</label>
          <input
            type="number"
            step="any"
            min="0"
            max="999999999"
            {...register("total")}
            className={`w-full border border-gray-300 p-2 rounded ${ivaWatch === "Sí" ? "bg-yellow-200 font-bold text-gray-900" : "bg-gray-100 font-semibold text-gray-700"}`}
            readOnly
          />
        </div>

        {/* Campos ocultos para enviar valores calculados */}
        <input type="hidden" {...register("montoIva")} />
        <input type="hidden" {...register("totalSinIva")} />

        {/* Bloque visual de totales */}
        <div className="mt-4 p-3 border rounded bg-gray-50">
          <p className="font-semibold text-gray-700">
            Total sin IVA: <span className="font-bold">${watch("totalSinIva")}</span>
          </p>

          <p className={`font-semibold ${ivaWatch === "Sí" ? "text-yellow-600" : "text-gray-400"}`}>
            IVA 21%: <span className="font-bold">${watch("montoIva")}</span>
          </p>

          <p className={`text-lg mt-2 ${ivaWatch === "Sí" ? "text-green-700 font-bold" : "text-gray-700 font-semibold"}`}>
            Total Final: <span>${watch("total")}</span>
          </p>
        </div>

        {/* ... resto del form (garantía, fecha, imagen, client_id, botones) ... */}

        <div className="flex justify-between mt-6">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow">Guardar Cambios</button>
          <button type="button" onClick={handleDelete} className="bg-red-500 text-white px-6 py-2 rounded shadow hover:bg-red-600">Eliminar Orden</button>
          <button type="button" onClick={() => navigate(-1)} className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded shadow">Cancelar</button>
        </div>
      </form>
    </div>
  );
}

export default EditarOrden;
