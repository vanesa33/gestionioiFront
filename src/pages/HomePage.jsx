import { Link } from "react-router-dom";
import imgInClient from "../assets/imgInClient.jpeg";
import imgBusClient from "../assets/imgBusClient.jpeg";
import imgInOrden from "../assets/imgInOrden.jpeg";
import imgBusOrden from "../assets/imgBusOrden.jpeg";
import manualUsuario from "../Manual_Usuario_ioi.pdf";

function HomePage() {
  const buttons = [
    { img: imgInClient, text: "Ingresar Cliente", to: "/tasks/:id" },
    { img: imgBusClient, text: "Buscar Cliente", to: "/tasks/buscar" },
    { img: imgInOrden, text: "Ver Mi Lista de Órdenes", to: "/taskmy" },
    { img: imgBusOrden, text: "Buscar Todas las Órdenes", to: "/ingresos/todos" },
  ];

  const navItems = [
    { label: "Inicio", to: "/" },
    { label: "Nueva Orden", to: "/ingresos/nuevo" },
    { label: "Buscar", to: "/ingresos/buscar" },
  ];

  return (
    <div className="h-screen bg-[#e34232] text-white flex flex-col">

      <a
  onClick={() => manualUsuario(manualUsuario)}
  href="/src/Manual_Usuario_ioi.pdf"
  download
  className="text-gray-700 hover:text-white"
>
  📘 Descargar Manual Usuario
</a>
     
      {/* 🔹 Contenido principal */}
      <main className="flex-1 grid grid-cols-2 sm:grid-cols-2 gap-3 p-4 place-items-center overflow-y-auto">
        {buttons.map((btn, idx) => (
          <Link
            key={idx}
            to={btn.to}
            className="flex flex-col items-center justify-center bg-[#ef4d3c] hover:bg-[#f25b4a] rounded-2xl p-4 sm:p-5 shadow-lg transition-all duration-200 w-full max-w-[240px] h-[180px]"
          >
            <img
              src={btn.img}
              alt={btn.text}
              className="w-20 h-20 sm:w-24 sm:h-24 mb-2 object-cover rounded-md"
            />
            <span className="text-sm sm:text-base text-center font-semibold">{btn.text}</span>
          </Link>
        ))}
      </main>

      {/* 🔹 Barra inferior (solo mobile) */}
      <nav className="h-14 bg-red-700 text-white flex justify-around items-center sm:hidden">
        {navItems.map((item, idx) => (
          <Link
            key={idx}
            to={item.to}
            className="flex flex-col items-center text-xs hover:text-yellow-300 transition"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default HomePage;
