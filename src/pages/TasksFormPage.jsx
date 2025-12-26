import { useForm } from "react-hook-form";
import { useTasks } from "../context/useTasks";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "/supabaseClient";
import { imprimirIngreso } from "../imprimirIngreso";

function TasksFromPage() {
  const { iid } = useParams();
  const modoEdicion = Boolean(iid);

  const location = useLocation();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, setValue, reset } = useForm();
  const { createIngreso, getIngreso } = useTasks();

  const [formBloqueado, setFormBloqueado] = useState(modoEdicion);
  const [ordenGenerada, setOrdenGenerada] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [ultimoIngreso, setUltimoIngreso] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagenurl, setImagenurl] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const coloresPresu = {
    Sí: "#F9E79F",
    No: "#ABEBC6",
  };

  // -------------------------------
  // CARGA EN EDICIÓN
  // -------------------------------
  useEffect(() => {
    if (!modoEdicion || !location.state?.ingreso) return;

    const ing = location.state.ingreso;

    setValue("client_id", ing.client_id);
    setValue("equipo", ing.equipo);
    setValue("nserie", ing.nserie);
    setValue("fecha", ing.fecha);
    setValue("falla", ing.falla);
    setValue("observa", ing.observa);
    setValue("costo", ing.costo);
    setValue("presu", ing.presu);
    setValue("tipo_orden", ing.tipo_orden);

    setOrdenGenerada(ing.numorden);
    setImagenurl(ing.imagenurl);
    setImagePreviewUrl(ing.imagenurl);
    setUltimoIngreso(ing);
  }, [modoEdicion, location.state, setValue]);

  // -------------------------------
  // FECHA POR DEFECTO
  // -------------------------------
  useEffect(() => {
    reset({
      client_id: location.state?.client_id ?? "",
      fecha: new Date().toISOString().split("T")[0],
    });
  }, [location.state, reset]);

  // -------------------------------
  // SUBMIT
  // -------------------------------
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      let urlFinal = imagenurl;

      if (selectedFile) {
        const ext = selectedFile.name.split(".").pop();
        const fileName = `orden_${Date.now()}.${ext}`;

        const { error } = await supabase.storage
          .from("ordenes-imagenes")
          .upload(fileName, selectedFile, { upsert: true });

        if (error) throw error;

        const { data: pub } = supabase.storage
          .from("ordenes-imagenes")
          .getPublicUrl(fileName);

        urlFinal = pub.publicUrl;
        setImagenurl(urlFinal);
        setImagePreviewUrl(urlFinal);
      }

      // 👉 SE CREA UNA SOLA VEZ
      const res = await createIngreso({
        ...data,
        imagenurl: urlFinal,
      });

      setUltimoIngreso(res.data);
      setOrdenGenerada(res.data.numorden);
      setFormBloqueado(true);
      setMostrarModal(true);
    } catch (err) {
      console.error(err);
      alert("Error al crear ingreso");
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------
  // IMPRIMIR
  // -------------------------------
  const handleImprimir = async () => {
    if (!ultimoIngreso?.iid) {
      alert("No hay orden para imprimir");
      return;
    }

    const res = await getIngreso(ultimoIngreso.iid);
    imprimirIngreso(res.data);
  };

  // -------------------------------
  // EDITAR
  // -------------------------------
  const editarOrden = () => {
    if (!ultimoIngreso?.iid) return;

    navigate(`/ingresos/${ultimoIngreso.iid}`, {
      state: { ingreso: ultimoIngreso },
    });
  };

  return (
    <>
      {/* ⬇️ TODO TU FORMULARIO SIGUE IGUAL ⬇️ */}
      {/* NO TOQUÉ EL JSX DE DISEÑO */}

      {/* (tu JSX completo va acá tal cual lo tenías) */}
    </>
  );
}

export default TasksFromPage;


