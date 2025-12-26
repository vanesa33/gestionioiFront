import { useForm } from "react-hook-form";
import { useTasks } from "../context/useTasks";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { imprimirIngreso } from "../utils/imprimirIngreso";

export default function TasksFormPage() {
  const { createIngreso, updateIngreso } = useTasks();
  const navigate = useNavigate();
  const location = useLocation();
  const { iid } = useParams();

  const ingresoEdit = location.state?.ingreso || null;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm();

  // --------------------
  // ESTADOS
  // --------------------
  const [ingresoCreado, setIngresoCreado] = useState(null);
  const [ordenGenerada, setOrdenGenerada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [formBloqueado, setFormBloqueado] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrlPreview, setImageUrlPreview] = useState(null);

  const modoEdicion = Boolean(iid);

  // --------------------
  // CARGA DATOS EN EDICIÓN
  // --------------------
  useEffect(() => {
    if (ingresoEdit) {
      reset(ingresoEdit);
      setImageUrlPreview(ingresoEdit.imagenurl || null);
      setFormBloqueado(Boolean(ingresoEdit.salida)); // si está cerrada
    }
  }, [ingresoEdit, reset]);

  // --------------------
  // SUBMIT
  // --------------------
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      let imagenFinal = imageUrlPreview;

      // ---- SUBIR IMAGEN SI HAY ----
      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `orden_${Date.now()}.${fileExt}`;
        const filePath = `ingresos/${fileName}`;

        const { error } = await supabase.storage
          .from("ordenes-imagenes")
          .upload(filePath, selectedFile, { upsert: true });

        if (error) throw error;

        const { data: publicData } = supabase.storage
          .from("ordenes-imagenes")
          .getPublicUrl(filePath);

        imagenFinal = publicData.publicUrl;
        setImageUrlPreview(imagenFinal);
      }

      const ingresoCompleto = {
        ...data,
        imagenurl: imagenFinal
      };

      // ---- CREAR O EDITAR ----
      if (modoEdicion) {
        await updateIngreso(iid, ingresoCompleto);
        alert("Orden actualizada correctamente");
        navigate("/ingresos");
        return;
      }

      const res = await createIngreso(ingresoCompleto);

      // ---- GUARDAMOS LA ORDEN ----
      setIngresoCreado(res.data);
      setOrdenGenerada(res.data.numorden);
      setFormBloqueado(true);
      setMostrarModal(true);

    } catch (error) {
      console.error(error);
      alert("Error al guardar la orden");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --------------------
  // IMPRIMIR
  // --------------------
  const handleImprimir = () => {
    if (!ingresoCreado) {
      alert("No hay orden para imprimir");
      return;
    }
    imprimirIngreso(ingresoCreado);
  };

  // --------------------
  // RENDER
  // --------------------
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">
        {modoEdicion ? "Editar Orden" : "Nueva Orden"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

        <input
          {...register("equipo", { required: true })}
          placeholder="Equipo"
          disabled={formBloqueado}
          className="w-full border p-2"
        />

        <textarea
          {...register("falla")}
          placeholder="Falla"
          disabled={formBloqueado}
          className="w-full border p-2"
        />

        <input
          type="date"
          {...register("fecha")}
          disabled={formBloqueado}
          className="border p-2"
        />

        {/* IMAGEN */}
        <input
          type="file"
          disabled={formBloqueado}
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />

        {imageUrlPreview && (
          <img
            src={imageUrlPreview}
            alt="preview"
            className="w-32 border"
          />
        )}

        {!formBloqueado && (
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {modoEdicion ? "Actualizar" : "Guardar"}
          </button>
        )}

        {formBloqueado && (
          <button
            type="button"
            onClick={handleImprimir}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Imprimir
          </button>
        )}
      </form>

      {/* ---------------- MODAL ---------------- */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded space-y-4">
            <h2 className="text-lg font-bold">
              Orden generada Nº {ordenGenerada}
            </h2>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setMostrarModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cerrar
              </button>

              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                OK
              </button>

              <button
                onClick={handleImprimir}
                className="px-4 py-2 bg-blue-600 text-white rounded"
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



