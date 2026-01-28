import { useState } from "react";
import { useNavigate } from "react-router-dom";
//import { useAuth } from "../context/useAuth";
import { cambiarPasswordRequest } from "../api/users";

function CambiarPassword() {
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
 // const { user } = useAuth();

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (loading) return;
  setLoading(true);

  try {
    await cambiarPasswordRequest({ password });
    navigate("/login");
  } catch (err) {
    setError("Error al actualizar la contraseña", err);
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nueva contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Repetir contraseña
            </label>
            <input
              type="password"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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