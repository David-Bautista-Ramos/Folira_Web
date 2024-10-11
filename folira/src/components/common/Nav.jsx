import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { BiBell, BiComment, BiError, BiGroup, BiNews, BiUser } from "react-icons/bi";
import { GiFeather, GiOpenBook } from "react-icons/gi"; 
import Folira_general from "../../assets/img/Folira_general.svg"

function Nav() {
  const location = useLocation(); // Hook para obtener la ruta actual
  const [activeLink, setActiveLink] = useState("/gestionUsuario");

  useEffect(() => {
    // Actualiza el enlace activo basado en la ruta actual
    setActiveLink(location.pathname);
  }, [location]);

  return (
    <nav className="w-full h-14 bg-white border-b border-primary fixed top-0 left-0 z-50 px-7 flex items-center">
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img className="w-20 h-40 cursor-pointer" src={Folira_general} alt="logo_nav" />
      </Link>

      {/* Opciones de navegación */}
      <div className="flex items-center justify-center space-x-12 flex-grow">
        <Link
          to="/gestionUsuario"
          className={`flex flex-col items-center ${activeLink === "/gestionUsuario" ? "border-b-2 border-blue-950" : ""}`}
        >
          <BiUser className="text-blue-950 w-6 h-6" />
        </Link>

        <Link
          to="/gestionAutor"
          className={`flex flex-col items-center ${activeLink === "/gestionAutor" ? "border-b-2 border-blue-950" : ""}`}
        >
          <GiFeather className="text-blue-950 w-6 h-6" />
        </Link>

        <Link
          to="/gestionLibro"
          className={`flex flex-col items-center ${activeLink === "/gestionLibro" ? "border-b-2 border-blue-950" : ""}`}
        >
          <GiOpenBook className="text-blue-950 w-6 h-6" />
        </Link>

        <Link
          to="/gestionComunidad"
          className={`flex flex-col items-center ${activeLink === "/gestionComunidad" ? "border-b-2 border-blue-950" : ""}`}
        >
          <BiGroup className="text-blue-950 w-6 h-6" />
        </Link>

        <Link
          to="/gestionDenuncia"
          className={`flex flex-col items-center ${activeLink === "/gestionDenuncia" ? "border-b-2 border-blue-950" : ""}`}
        >
          <BiError className="text-blue-950 w-6 h-6" />
        </Link>

        <Link
          to="/gestionNotificacion"
          className={`flex flex-col items-center ${activeLink === "/gestionNotificacion" ? "border-b-2 border-blue-950" : ""}`}
        >
          <BiBell className="text-blue-950 w-6 h-6" />
        </Link>

        <Link
          to="/gestionResenas"
          className={`flex flex-col items-center ${activeLink === "/gestionResenas" ? "border-b-2 border-blue-950" : ""}`}
        >
          <BiComment className="text-blue-950 w-6 h-6" />
        </Link>

        <Link
          to="/gestionPublicacion"
          className={`flex flex-col items-center ${activeLink === "/gestionPublicacion" ? "border-b-2 border-blue-950" : ""}`}
        >
          <BiNews className="text-blue-950 w-6 h-6" />
        </Link>
      </div>
    </nav>
  );
}

export default Nav;
