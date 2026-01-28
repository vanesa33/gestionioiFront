import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPasswordRequest } from "../api/users.js";

function ResetPassword() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tempPassword, setTempPassword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reset = async () => {
      try {
        const res = await resetPasswordRequest(id);
        setTempPassword(res.data.tempPassword); 
      } catch (err) {
        alert("Error reseteando contraseña", err);
        navigate("/passuser");
      } finally {
        setLoading(false);
      }
    };

    reset();
  }, [id, navigate]);

  if (loading) return <p className="p-6">Reseteando contraseña...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-full max-w-md text-center">
        <h1 className="text-xl text-gray-800 font-bold mb-4">Contraseña temporal</h1>

        <div className="bg-gray-100 p-3 rounded text-lg text-gray-800 font-mono mb-4">
          {tempPassword}
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Entregá esta contraseña al usuario.
          Deberá cambiarla al iniciar sesión.
        </p>

        <button
          onClick={() => navigate("/passuser")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Volver a usuarios
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;