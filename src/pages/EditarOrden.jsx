import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getIngresoRequest, upDateingresoRequest, deleteIngresoRequest } from "../api/ingresos";
import { getTecnicosRequest } from "../api/users.js";

 

function EditarOrden() {
  const { iid } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, watch, setValue  } = useForm();
  const [numOrden, setNumOrden] = useState(iid);
  const [ordenCerrada, setOrdenCerrada] = useState(false);
  const [tipoOrden, setTipoOrden] = useState("");
   const [tecnicos, setTecnicos] = useState([]);

   
  useEffect(() => {
  const cargarTecnicos = async () => {
    try {
      const res = await getTecnicosRequest();
      setTecnicos(res.data.result || []);
      
    } catch (error) {
      console.error("Error cargando técnicos:", error);
      setTecnicos([]);
    }
  };

  cargarTecnicos();
}, [reset]);


  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res = await getIngresoRequest(iid);
        const data = res.data;
        console.log( data.tecnico_nombre);    

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
          client_id: data.client_id ?? "",
          usuario_nombre: data.usuario_nombre ?? "",
          tecnico_id: data.tecnico_id ?? "",
          tecnico_nombre: data.tecnico_nombre ?? ""
        });

        setTipoOrden(data.tipo_orden);

        setOrdenCerrada(!!data.salida);

        console.log("formulario despues del reset:", data);

        setNumOrden(data.numorden_visual || data.numorden);
      } catch (error) {
        console.error("Error al cargar los datos de la orden:", error);
      }
    };

    cargarDatos();
  }, [iid, reset]);

  

  // Escuchar valores
const costo = watch("costo") || 0;
const repuesto = watch("repuesto") || 0;
const manoobra = watch("manoobra") || 0;
const iva = watch("iva");
const garantia = watch("presu");
const esGarantia = garantia === "Sí";



// Recalcular automáticamente TOTAL
useEffect(() => {
  const sumaBase =
    Number(costo) +
    Number(repuesto) +
    Number(manoobra);

  let totalFinal = sumaBase;

  if (iva === "Sí") {
    totalFinal = sumaBase * 1.21; // suma el 21%
  }
 
  const montoIva = iva === "Sí" ? sumaBase * 0.21 : 0;

  setValue("montoIva", montoIva.toFixed(2));
  setValue("MontoSinIva", sumaBase.toFixed(2));
  setValue("total", totalFinal.toFixed(2));
}, [costo, repuesto, manoobra, iva, setValue]);

  const onSubmit = async (data) => {
   console.log("=== FORM ===");
  console.log(data);
  console.log("tecnico_id =", data.tecnico_id);
  try {
    // Convierte vacíos a null y texto a número donde corresponda
    const numFields = ["costo", "repuesto", "manoobra", "total"];
    numFields.forEach((f) => {
      if (data[f] === "" || data[f] === undefined) data[f] = null;
      else data[f] = Number(data[f]);
    });

    console.log("Datos procesados antes de enviar:", data);

    await upDateingresoRequest(iid, data);
    alert("Orden actualizada con éxito");
    navigate("/ingresos/todos");
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
    <div className="max-w-6xl mx-auto p-6  bg-gray-200 shadow-lg rounded-lg mt-10">
      <div className="text-center mb-6">
  <span
    className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2
      ${tipoOrden?.toUpperCase() === "SERVICE"
        ? "bg-blue-100 text-blue-800"
        : "bg-green-100 text-green-800"}
    `}
  >
    {tipoOrden?.toUpperCase() === "SERVICE" ? "🔧 SERVICE" : "🛠 REPARACIÓN"}
  </span>

  <h2 className="text-2xl font-bold text-gray-700 mt-2">
    Orden Técnica #{numOrden}
  </h2>
</div>

      {ordenCerrada && (
        <div className="p-2 mb-4 rounded bg-red-100 text-red-800 text-sm font-semibold">
          ⚠️ Esta orden está cerrada y no puede ser editada.
        </div>
      )}
          
      <div className="mb-6">
        <p className="text-gray-600">
          Edita los detalles de la orden técnica. Recuerda que una vez que se
          ingresa una fecha de salida, la orden se considera cerrada y no podrá
          ser modificada.
        </p>
      </div>
      <div className="border-t pt-4">
        <p className="text-sm text-gray-500">
          orden creada por: <b>{watch("usuario_nombre")}</b> {/* Este valor ya estará en el form si lo envía el backend */}
        </p>
        </div>
      <form onSubmit={handleSubmit(onSubmit)} 
      className={`grid grid-cols-1 md:grid-cols-2 gap-4
        ${ordenCerrada ? "pointer-events-none opacity-70" : ""}`}>
 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">

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
          <label className="block font-semibold text-gray-600">N° Serie</label>
          <input
            type="text"
            {...register("nserie")}
            className="w-full border border-gray-300 p-2 rounded text-gray-600"
            placeholder="Número de serie"
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
          <label className="block font-semibold text-gray-600">Fecha</label>
          <input
            type="date"
            {...register("fecha")}
            className="w-full border border-gray-300 p-2 rounded text-gray-600"
          />
        </div>



         </div>

        <div className="md:col-span-2">
          <label className="block font-semibold text-gray-600">Observaciones</label>
          <input
            type="text"
            {...register("observa")}
            className="w-full border border-gray-300 p-7 rounded text-gray-600"
            rows={8}
            placeholder="Observaciones"
          />
        </div>    

        

        
       <div className="flex items-center gap-4">
        
        <label className="block font-semibold text-gray-600">Garantía</label>
           
          <select className="p-2 rounded border block font-semibold text-gray-600"  {...register("presu")}>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>

        
           {esGarantia && (
          <div className="p-2 mb-2 rounded bg-blue-100 text-blue-800 text-sm font-semibold">
             🔧 Orden en garantía
            </div>
          )}
         </div>
         
         <div></div>

         <div className="bg-white rounded-xl shadow p-5">
        
 <div className="grid grid-cols-2 gap-4">

         <div>
          <label className="block font-semibold text-gray-600">Costo de Repuesto</label>
          <input
            type="number"
            {...register("repuesto")}
            className={`w-full border p-2 rounded text-gray-600
               ${esGarantia ? "" : ""}
              `}
            placeholder="$"
          />
        </div>

         <div>
          <label className="block font-semibold text-gray-600">Mano de Obra</label>
          <input
            type="number"
            {...register("manoobra")}
            className={`w-full border p-2 rounded text-gray-600
                   ${esGarantia ? ""  : ""}
                `}
            placeholder="$"
          />
        </div>                
          
        

        

        <div className="flex gap-4">
          <div className="flex-1">
            
          <label className="block font-semibold text-gray-600">IVA</label>
           <select className={`p-2 rounded border font-semibold
            ${esGarantia ? "bg-yellow-300 " : "text-gray-800"}
  `           }
  
                  {...register("iva")}>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                  </select>
        
                <input type="hidden" {...register("montoIva")} />
                <input type="hidden" {...register("totalSinIva")} />

          </div>

          </div>

          <div>
          <label className="block font-semibold text-gray-600">Total</label>
          <input
            type="number"
            {...register("total")}
           className={`w-full border border-gray-300 p-2 rounded 
            ´ ${iva === "Sí" ? "bg-yellow-300 font-bold text-gray-900" : "bg-gray-200 font-semibold text-gray-900"}
             `}
            readOnly
            placeholder="$"
          />
          </div>


        
        <div></div>
        <div>


 
        
        </div>

<div className="md:col-span-3">
        <div className="mt-4 p-3 border rounded bg-gray-50">
  <p className="font-semibold text-gray-700">
    Total sin IVA: <span className="font-bold">${watch("totalSinIva")}</span>
  </p>

  <p className={`font-semibold 
    ${iva === "Sí" ? "text-yellow-600" : "text-gray-400"}`}>
    IVA 21%: <span className="font-bold">${watch("montoIva")}</span>
  </p>

  <p className={`text-lg mt-2 
    ${iva === "Sí" ? "text-green-700 font-bold" : "text-gray-700 font-semibold"}`}>
    Total Final: <span>${watch("total")}</span>
  </p>
</div>
</div>
      </div>

</div>

       <div className="bg-white rounded-xl shadow p-5">
               
        <div className=" p-3 border rounded bg-gray-200  ">
          
          <p className="text-sm text-gray-500">Técnico asignado: <b>{
            
            tecnicos.find(t => t.ruid === Number(watch("tecnico_id")))?.username || "No asignado"
            
            }</b></p>
           </div>
              

          
        
  <select 
  {...register("tecnico_id")}
  className="border p-2 text-gray-600 rounded mb-3"
  >
   <option value="">Seleccionar Técnico</option>
   {Array.isArray(tecnicos) &&
  tecnicos.map((t) => (
    <option key={t.ruid} value={t.ruid}>
      {t.username}
    </option>
  ))
}  
  </select>
  
 

         <div>
          <label className="block font-semibold text-gray-600">Fecha de Salida / Cerrar Orden</label>
          <input
            type="date"
            {...register("salida")}
            className="w-full border border-gray-300 p-2 rounded text-gray-600"
            placeholder="fecha de salida"
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

        <div className="text-gray-500 text-sm mb-2">
        Tipo de orden:{" "}
         <span
        className={`font-bold
             ${tipoOrden === ""
          ? "text-blue-700"
           : "text-green-700"}
            `}
          >
         {tipoOrden}
          </span>
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

        </div>

        <div className="lg:col-span-2 flex justify-center gap-4 mt-4">
          <button
            type="submit"
            disabled={ordenCerrada}
            className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 
            ${ordenCerrada 
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"}
            `}
          >
            Guardar Cambios
          </button>

            <button
             type="button"
             onClick={handleDelete}
             disabled={ordenCerrada}
             className={`bg-red-500 text-white px-6 py-2 rounded shadow
              ${ordenCerrada 
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600"}
              `}
              >  
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

  
  
