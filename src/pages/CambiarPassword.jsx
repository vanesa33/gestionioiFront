import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cambiarPasswordRequest } from "../api/users";

function CambiarPassword() {
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 👁️ NUEVO
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (password !== confirmar) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      await cambiarPasswordRequest({ password });
      navigate("/login");
    } catch (err) {
      setError("Error al actualizar la contraseña");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Cambiar contraseña
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Por seguridad debés actualizar tu contraseña
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* PASSWORD */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nueva contraseña
            </label>

            <input
              type={showPassword ? "text" : "password"} // 👁️
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-700 rounded-md px-3 py-2 pr-10 
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         tracking-widest font-semibold" // 👈 más visible
            />

            {/* 👁️ botón */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-9 text-gray-800 hover:text-black"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* CONFIRMAR */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Repetir contraseña
            </label>

            <input
              type={showConfirmar ? "text" : "password"} // 👁️
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              className="w-full border border-gray-700 rounded-md px-3 py-2 pr-10 
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         tracking-widest font-semibold"
            />

            <button
              type="button"
              onClick={() => setShowConfirmar(!showConfirmar)}
              className="absolute right-2 top-9 text-gray-800 hover:text-black"
            >
              {showConfirmar ? "🙈" : "👁️"}
            </button>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Guardar contraseña
          </button>
        </form>
      </div>
    </div>
  );
}

export default CambiarPassword;
