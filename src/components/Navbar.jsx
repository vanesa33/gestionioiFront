import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useEffect, useRef, useState } from "react";

function Navbar(){
    const { isAuthenticated, logout, user} = useAuth();
    console.log(user)
    const[openMenu, setOpenMenu] = useState(false);
    const menuRef = useRef();

    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return(
        <nav className="bg-red-600 flex  justify-between py-5 px-10">
            <Link to='/'>
                <img
                 src="/logo-ioi.jpeg" alt="Logo"
                className="h-12 w-auto"
                />
            </Link>             
             <ul className="flex gap-x-4 items-center">
                {isAuthenticated ? (
                    <>
                    <li className="relative" ref={menuRef}>
                        <button
                className="flex items-center bg-red-800 px-4 py-2 rounded-sm"
                onClick={() => setOpenMenu(!openMenu)}
              >
                    Bienvenido {user.username}
                    <svg
                    className={`ml-2 w-4 h-4 transition-transform ${openMenu ? "rotate-180" : ""}`}
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    </button>
              {openMenu && (
                <ul className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg min-w-[150px] z-10">
                  <li>
                    <Link to="/tasks/new" className="block px-4 py-2 hover:bg-gray-300">
                      Ingresar Cliente
                    </Link>
                  </li>
                  <li>

                    <button>
                       <li>
                    <Link to="/tasks/buscar" className=" right-0 block px-4 py-2 hover:bg-gray-300 min-w-[150px] z-10">
                      Buscar Cliente
                    </Link>
                  </li>
                    </button>

                    <button>
                       <li>
                    <Link to="/tasks/Buscarorden" className="block px-4 py-2 hover:bg-gray-300 min-w-[150px] z-10">
                      Buscar Orden
                    </Link>
                  </li>
                    </button>

                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 hover:bg-red-400  z-10"
                    >
                      Salir
                    </button>

                    </li>
                </ul>
              )}
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to='/login'
                className="bg-red-800 px-4 py-2 rounded-sm"
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link to='/register'
                className="bg-red-800 px-4 py-2 rounded-sm"
              >
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
 export default Navbar
