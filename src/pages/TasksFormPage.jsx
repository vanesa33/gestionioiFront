import { useForm } from "react-hook-form";
import { useTasks } from "../context/useTasks";
import {  useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "/supabaseClient.js"
//import { jsPDF } from "jspdf";
import { imprimirIngreso } from "../imprimirIngreso.js";

function TasksFromPage() {

  const {iid} = useParams();
    const modoEdicion = Boolean(iid);

  const location = useLocation(); 
  //const ingresoDesdeLocation = location.state?.ingreso;
  const [formBloqueado, setFormBloqueado] = useState(modoEdicion);
  const client_id = location.state?.client_id ?? "";

  const navigate = useNavigate();
  const { register, handleSubmit, watch, setValue, reset} = useForm();
  const { createIngreso,  getIngreso } = useTasks();
  const [selectedFile, setSelectedFile] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [ingresos, setIngreso] = useState([]);
  
  const [imagenurl, setImageurl] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [ isUploading, setIsUploading] = useState(false);

 

  const [ordenGenerada, setOrdenGenerada] = useState("");
  //const [file, setFile] = useState(null);
  const [imagePreviewUrl, setImageUrlPreviewUrl] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
 const [ultimoIngresoId, setUltimoIngresoId] = useState(null);
 const [UltimoIngreso, setUltimoIngreso] = useState(null);
 const [datosOrden, setDatosOrden] = useState(null)

  

  useEffect(()=> {

    if(iid){
    console.log("params.iid", iid)
    getIngreso(iid);
    }
    
  },[iid, getIngreso])



  useEffect(() => {
    const hoy = new Date().toISOString().split("T")[0];

    if (location.state?.clienteId) setValue("client_id", location.state.clienteId);

    if (modoEdicion && location.state?.imagenurl) {
      setImageUrlPreviewUrl(location.state.ingreso.imagenurl);
    }

    if (modoEdicion) {
      const ing = location.state.ingreso;
      setValue("client_id", ing.client_id);
      setValue("equipo",    ing.equipo);
      setValue("nserie",    ing.nserie);
      setValue("fecha",     ing.fecha || hoy);
      setValue("falla",     ing.falla);
      setValue("observa",   ing.observa);
      setValue("costo",     ing.costo);
      setValue("presu",     ing.presu);
      setOrdenGenerada(ing.numorden);
    } else {
      setValue("fecha", hoy);
    }
  
  }, [location.state, setValue, modoEdicion]);

  
 const [isSubmitting, setIsSubmitting] = useState(false);

useEffect(() => {
  reset({
    client_id: client_id,
     fecha : new Date().toISOString().split("T")[0]
  });
}, [client_id, reset]);

/*const imprimirOrden = (orden) => {
   const doc = new jsPDF();

   doc.setFontSize(18);
   doc.text(`Orden Técnica N° ${orden.numorden}`, 10, 20);

   doc.setFontSize(12);
   doc.text(`Cliente ID: ${orden.client_id}`, 10, 30);
   doc.text(`Equipo: ${orden.equipo}`, 10, 40);
   doc.text(`Falla: ${orden.falla}`, 10, 50);
   doc.text(`fecha: ${orden.fecha}`, 10, 60);

   if (orden.imagenurl) {
    // Si la imagen está en formato URL
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = orden.imagenurl;
    img.onload = () => {
      doc.addImage(img, "JPEG", 10, 70, 50, 50);
      imprimirPDF(doc);
    };
  } else {
    imprimirPDF(doc);
  }
};*/
  
/*const imprimirPDF = (doc) => {
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);

  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = url;

  document.body.appendChild(iframe);
  iframe.onload = () => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  };
};*/

const onSubmit = async (data) => {
  try {
    setIsSubmitting(true); // 🚫 deshabilita el botón inmediatamente

    let imagenurl = null;

    // 1️⃣ Subir imagen si existe
    if (selectedFile) {
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `orden_${Date.now()}.${fileExt}`;
      const filePath = `ingresos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("ordenes-imagenes")
        .upload(filePath, selectedFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.error("Error al subir imagen:", uploadError);
        alert("Error al subir la imagen");
        setIsSubmitting(false); // volver a habilitar si falla
        return;
      }

      const { data: publicData } = supabase.storage
        .from("ordenes-imagenes")
        .getPublicUrl(filePath);

      imagenurl = publicData.publicUrl;
      setImageurl(imagenurl);
      setImageUrlPreviewUrl(imagenurl);
    }

    // 2️⃣ Crear ingreso con imagen o null
    const ingresoCompleto = {
      ...data,
      imagenurl: imagenurl || null
    };

    const res = await createIngreso(ingresoCompleto);
    console.log("Respuesta del backend", res.data);

    setDatosOrden(res.data);

    const { iid, numorden: orden } = res.data;
    console.log(iid)
    setOrdenGenerada(orden);
    setFormBloqueado(true);
    setMostrarModal(true);
    setUltimoIngresoId(res.data);
    setUltimoIngreso((prev) => ({
      ...prev,
      imagenurl: imagenurl || null
    }));

    /*navigate(/ingresos/${iid}, {
      state: { ingreso: res.data }
    });*/

  } catch (error) {
    console.log("Error al crear ingreso:", error);
    alert("Error al crear ingreso");
    setIsSubmitting(false); // volver a habilitar si falla
  }
};
const editarOrden = () => {
  if (ultimoIngresoId) {
    navigate(`/ingresos/${ultimoIngresoId.iid}`, {
      state: { ingresoId: ultimoIngresoId }
    });
  } else {
    console.warn("No hay un ingreso para editar");
  }
};
 



<div className="text-white">
 
  formBloqueado: {formBloqueado ? "true" : "false"}
</div>
  return (

    <>
   
      <form onSubmit={handleSubmit(onSubmit)} className="min-h-screen bg-red-700 flex flex-col items-center justify-start py-5 px-4 md:px-0">
        <div className="text-gray-200 text-center py-2 font-bold text-3xl w-full max-w-4xl">Ingresar Orden</div>

        <div className="w-full max-w-8xl bg-gray-200 p-4 md:p-6 rounded shadow">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 text-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="client_id" className="text-xs font-semibold text-gray-700 mb-1">Id Cliente</label>
                  <input
                    id="client_id"
                    type="text"
                    className="p-2 rounded border bg-gray-300 text-gray-900"
                    disabled
                    {...register("client_id")}
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="numorden" className="text-xs font-semibold text-gray-700 mb-1">N° de Orden</label>
                  <input
                    id="numorden"
                    type="text"
                    className="p-2 rounded border bg-gray-300 text-gray-900"
                    readOnly
                    disabled={formBloqueado}
                    value={ordenGenerada || "Se generará automáticamente"}
                  />
                </div>

                <input type="text" placeholder="Equipo" className="p-2 rounded border" disabled={formBloqueado} {...register("equipo")} />
                <input type="text" placeholder="N° de Serie" className="p-2 rounded border" disabled={formBloqueado} {...register("nserie")} />
                <input type="date" placeholder="Fecha" className="p-2 rounded border" disabled={formBloqueado} {...register("fecha")} />
                <input type="text" placeholder="Garantía" className="p-2 rounded border" disabled={formBloqueado} {...register("presu")} />
                <textarea placeholder="Falla" className="p-2 rounded border col-span-1 md:col-span-2" disabled={formBloqueado} {...register("falla")}></textarea>
                <textarea placeholder="Materiales" className="p-2 rounded border col-span-1 md:col-span-2" disabled={formBloqueado} {...register("observa")}></textarea>
                <input type="text" placeholder="Costo estimado $00,00" className="p-2 rounded border" disabled={formBloqueado} {...register("costo")} />
              </div>
            </div>

            <div className="w-full md:w-auto flex justify-center md:justify-start">
              <div className="flex flex-col gap-4 mt-6 md:mt-0">
                <button type="submit"
                disabled={isSubmitting}
                className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-red-600 hidden md:flex
                btn ${isSubmitting 
                ? "bg-gray-400 cursor-not-allowed text-white : ''"
                   : "bg-green-600 hover:bg-green-700 text-white"}`}
                >
                  {isSubmitting ? "Guardado..." : "Guardar"}
                  
                  </button>

                  <button
                     type="button"
                      onClick={editarOrden}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded hidden md:flex"
                    >
                         Editar
                  </button>  
        

              

               <button
                  type="button"
                   className="btn bg-blue-500 text-white px-4 py-2 rounded
                  hover:bg-red-600 hidden md:flex"
                   onClick={() => imprimirIngreso({
                      numorden: ordenGenerada,
                       fecha: watch("fecha"),
                       cliente: watch("clienteNombre"),
                       equipo: watch("equipo"),
                       falla: watch("falla"),
                       observa: watch("observa"),
                       nserie: watch("nserie"),
                       costo: watch("costo"),
                       imagenurl: imagenurl // o el estado donde guardes la imagen subida
                        })}
                         >
                          Imprimir
                           </button>

                <button type="button" onClick={() => navigate("/")} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-600 hidden md:flex">
                  Inicio
                  </button>

                  <input
                  className="text-gray-700"
                  type="file"
                  accep="image/*"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  disabled={isSubmitting}
                  />

                  {imagePreviewUrl && (
                    <div style={{ marginTop: "1rem"}}>
                      <strong className="text-gray-700">Vista previa de imagen:</strong>
                      <br />
                      <img 
                      src={imagePreviewUrl}
                      alt="Imagen Subida"
                      style={{
                        maxWidth: "100px",
                        maxHeight: "100px",
                        marginTop: "8px",
                        borderRadius: "8px",
                      }}
                      />
                      </div>
                  )}
                 
               
              </div>
            </div>
          </div>
        </div>
        {/* Barra de acciones para celulares */}
<div className="fixed bottom-0 left-0 right-0 bg-white border-t p-2 shadow-lg z-50 md:hidden">
  <div className="grid grid-cols-3 gap-2">
    <button type="submit" className="bg-green-600 text-white py-2 rounded text-sm hover:bg-green-700">Guardar</button>
    

    <button className="bg-red-500 text-white py-2 rounded text-sm hover:bg-red-600">Eliminar</button>
    <button className="bg-indigo-500 text-white py-2 rounded text-sm hover:bg-indigo-600 col-span-2">Inicio</button>
     <button className="bg-blue-950 text-white py-2 rounded text-sm hover:bg-blue-950 col-span-2">Cargar Imagen</button>
    <button className="bg-gray-800 text-white py-2 rounded text-sm hover:bg-gray-900">Salir</button>
  </div>
</div>
      </form>

      {!modoEdicion && mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow text-center w-11/12 max-w-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Orden generada</h2>
            <p className="text-gray-700 mb-4">
              Número de orden: <span className="font-mono text-lg">{ordenGenerada}</span>
            </p>
            <div className="flex justify-center gap-4">

              <button onClick={() => imprimirIngreso(datosOrden)}
                className="px-4 py-2 btn bg-blue-500 text-white rounded"
                >Imprimir</button>  

              <button
                onClick={() => setMostrarModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cerrar
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default TasksFromPage;


