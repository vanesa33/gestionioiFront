import { useForm } from "react-hook-form";
import { useTasks } from "../context/useTasks";
import {  useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "/supabaseClient.js"
//import { jsPDF } from "jspdf";
import { imprimirIngreso } from "../imprimirIngreso.js";


function TasksFromPage() {
  const { iid } = useParams();
  const modoEdicion = Boolean(iid);

  const location = useLocation();
  const [formBloqueado, setFormBloqueado] = useState(modoEdicion);
  const client_id = location.state?.client_id ?? "";

  const navigate = useNavigate();
  const { register, handleSubmit, watch, setValue, reset } = useForm();

  const coloresPresu = {
    Sí: "#F9E79F", // Amarillo claro
    No: "#ABEBC6", // Verde claro
  };

  const { createIngreso, getIngreso } = useTasks();

  const [selectedFile, setSelectedFile] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [ingresos, setIngreso] = useState([]);

  const [imagenurl, setImageurl] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [isUploading, setIsUploading] = useState(false);

  const [ordenGenerada, setOrdenGenerada] = useState("");
  const [imagePreviewUrl, setImageUrlPreviewUrl] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  // ✅ Nos quedamos con UNO como fuente de verdad para imprimir/editar
  const [datosOrden, setDatosOrden] = useState(null);

  // (si querés seguir usando estos estados, no molestan)
  const [ultimoIngresoId, setUltimoIngresoId] = useState(null);
  const [UltimoIngreso, setUltimoIngreso] = useState(null);

  useEffect(() => {
    if (iid) {
      console.log("params.iid", iid);
      getIngreso(iid);
    }
  }, [iid, getIngreso]);

  useEffect(() => {
    const hoy = new Date().toISOString().split("T")[0];

    if (location.state?.clienteId) setValue("client_id", location.state.clienteId);

    if (modoEdicion && location.state?.imagenurl) {
      setImageUrlPreviewUrl(location.state.ingreso.imagenurl);
    }

    if (modoEdicion && location.state?.ingreso) {
      const ing = location.state.ingreso;

      setValue("client_id", ing.client_id);
      setValue("equipo", ing.equipo);
      setValue("nserie", ing.nserie);
      setValue("fecha", ing.fecha || hoy);
      setValue("falla", ing.falla);
      setValue("observa", ing.observa);
      setValue("costo", ing.costo);
      setValue("presu", ing.presu);
      setValue("tipo_orden", ing.tipo_orden);

      setOrdenGenerada(ing.numorden);

      // ✅ para imprimir también en edición
      setDatosOrden(ing);
      setUltimoIngresoId(ing);
    } else {
      setValue("fecha", hoy);
    }
  }, [location.state, setValue, modoEdicion]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    reset({
      client_id: client_id,
      fecha: new Date().toISOString().split("T")[0],
    });
  }, [client_id, reset]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      let imagenurlLocal = null;

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
          return;
        }

        const { data: publicData } = supabase.storage
          .from("ordenes-imagenes")
          .getPublicUrl(filePath);

        imagenurlLocal = publicData.publicUrl;
        setImageurl(imagenurlLocal);
        setImageUrlPreviewUrl(imagenurlLocal);
      }

      // 2️⃣ Crear ingreso con imagen o null
      const ingresoCompleto = {
        ...data,
        imagenurl: imagenurlLocal || null,
      };

      // ✅ SOLO UNA VEZ (antes lo estabas creando 2 veces)
     const ingresoCreado = await createIngreso(ingresoCompleto);

console.log("Respuesta del backend", ingresoCreado);

setUltimoIngresoId(ingresoCreado);

const { iid, numorden } = ingresoCreado;
      setOrdenGenerada(orden);
      setFormBloqueado(true);
      setMostrarModal(true);

      setUltimoIngreso((prev) => ({
        ...prev,
        imagenurl: imagenurlLocal || null,
      }));
    } catch (error) {
      console.log("Error al crear ingreso:", error);
      alert("Error al crear ingreso");
    } finally {
      setIsSubmitting(false);
    }
  };

  const editarOrden = () => {
    const id = ultimoIngresoId?.iid || datosOrden?.iid;
    if (id) {
      navigate(`/ingresos/${id}`, {
        state: { ingreso: datosOrden || ultimoIngresoId },
      });
    } else {
      console.warn("No hay un ingreso para editar");
    }
  };

  // ✅ imprimir robusto: soporta getIngreso que devuelve data o response
  const handleImprimir = async () => {
  try {
    if (!ultimoIngresoId?.iid) {
      alert("No hay orden para imprimir");
      return;
    }

    const res = await getIngreso(ultimoIngresoId.iid);
    imprimirIngreso(res.data);

  } catch (error) {
    console.error(error);
    alert("Error al obtener la orden para imprimir");
  }
};


  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="min-h-screen bg-red-700 flex flex-col items-center justify-start py-5 px-4 md:px-0"
      >
        <div className="text-gray-200 text-center py-2 font-bold text-3xl w-full max-w-4xl">
          Ingresar Orden
        </div>

        {/* ✅ debug (antes estaba suelto fuera del return y rompía build) */}
        {/* <div className="text-white">
          formBloqueado: {formBloqueado ? "true" : "false"}
        </div> */}

        <div className="w-full max-w-8xl bg-gray-200 p-4 md:p-6 rounded shadow">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 text-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="client_id"
                    className="text-xs font-semibold text-gray-700 mb-1"
                  >
                    Id Cliente
                  </label>
                  <input
                    id="client_id"
                    type="text"
                    className="p-2 rounded border bg-gray-300 text-gray-900"
                    disabled
                    {...register("client_id")}
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="numorden"
                    className="text-xs font-semibold text-gray-700 mb-1"
                  >
                    N° de Orden
                  </label>
                  <input
                    id="numorden"
                    type="text"
                    className="p-2 rounded border bg-gray-300 text-gray-900"
                    readOnly
                    disabled={formBloqueado}
                    value={ordenGenerada || "Se generará automáticamente"}
                  />
                </div>

                <input
                  type="text"
                  placeholder="Equipo"
                  className="p-2 rounded border"
                  disabled={formBloqueado}
                  {...register("equipo")}
                />

                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-700 mb-1">
                    Tipo de orden
                  </label>

                  <select
                    className="p-2 rounded border"
                    disabled={formBloqueado}
                    {...register("tipo_orden", { required: true })}
                  >
                    <option value="SERVICE">service</option>
                    <option value="REPARACION">reparacion</option>
                  </select>
                </div>

                <input
                  type="text"
                  placeholder="N° de Serie"
                  className="p-2 rounded border"
                  disabled={formBloqueado}
                  {...register("nserie")}
                />

                <input
                  type="date"
                  placeholder="Fecha"
                  className="p-2 rounded border"
                  disabled={formBloqueado}
                  {...register("fecha")}
                />

                <select
                  className="p-2 rounded border"
                  style={{
                    backgroundColor: coloresPresu[watch("presu")] || "white",
                    opacity: 1,
                    pointerEvents: formBloqueado ? "none" : "auto",
                  }}
                  {...register("presu")}
                >
                  <option value="">Garantía</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>

                <textarea
                  placeholder="Falla"
                  className="p-2 rounded border col-span-1 md:col-span-2"
                  disabled={formBloqueado}
                  {...register("falla")}
                ></textarea>

                <textarea
                  placeholder="Materiales"
                  className="p-2 rounded border col-span-1 md:col-span-2"
                  disabled={formBloqueado}
                  {...register("observa")}
                ></textarea>
              </div>
            </div>

            <div className="w-full md:w-auto flex justify-center md:justify-start">
              <div className="flex flex-col gap-4 mt-6 md:mt-0">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-red-600 hidden md:flex btn ${
                    isSubmitting ? "bg-gray-400 cursor-not-allowed" : ""
                  }`}
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
                  className="btn bg-blue-500 text-white px-4 py-2 rounded hover:bg-red-600 hidden md:flex"
                  onClick={handleImprimir}
                >
                  Imprimir
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-600 hidden md:flex"
                >
                  Inicio
                </button>

                <input
                  className="text-gray-700"
                  type="file"
                  accept="image/*"   // ✅ estaba mal escrito (accep)
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  disabled={isSubmitting}
                />

                {imagePreviewUrl && (
                  <div style={{ marginTop: "1rem" }}>
                    <strong className="text-gray-700">
                      Vista previa de imagen:
                    </strong>
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
            <button
              type="submit"
              className="bg-green-600 text-white py-2 rounded text-sm hover:bg-green-700"
            >
              Guardar
            </button>

            <button className="bg-red-500 text-white py-2 rounded text-sm hover:bg-red-600">
              Eliminar
            </button>
            <button className="bg-indigo-500 text-white py-2 rounded text-sm hover:bg-indigo-600 col-span-2">
              Inicio
            </button>
            <button className="bg-blue-950 text-white py-2 rounded text-sm hover:bg-blue-950 col-span-2">
              Cargar Imagen
            </button>
            <button className="bg-gray-800 text-white py-2 rounded text-sm hover:bg-gray-900">
              Salir
            </button>
          </div>
        </div>
      </form>

      {!modoEdicion && mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow text-center w-11/12 max-w-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Orden generada
            </h2>
            <p className="text-gray-700 mb-4">
              Número de orden:{" "}
              <span className="font-mono text-lg">{ordenGenerada}</span>
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleImprimir}
                className="px-4 py-2 btn bg-blue-500 text-white rounded"
              >
                Imprimir
              </button>

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
