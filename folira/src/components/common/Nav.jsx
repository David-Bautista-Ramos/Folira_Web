import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { BiBell, BiComment, BiError, BiGroup, BiNews, BiUser } from "react-icons/bi";
import { GiFeather, GiOpenBook } from "react-icons/gi"; 
import Folira_general from "../../assets/img/Folira_general.svg";

function Nav() {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState("/gestionUsuario");
  const [tooltip, setTooltip] = useState({ visible: false, text: "" });

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  return (
    <nav className="w-full h-14 bg-white border-b border-primary fixed top-0 left-0 z-50 px-7 flex items-center">
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img className="w-20 h-40 cursor-pointer" src={Folira_general} alt="logo_nav" />
      </Link>

      {/* Opciones de navegación */}
      <div className="flex items-center justify-center space-x-12 flex-grow relative">
        <Link
          to="/gestionUsuario"
          className={`flex flex-col items-center ${activeLink === "/gestionUsuario" ? "border-b-2 border-blue-950" : ""}`}
          onMouseEnter={() => setTooltip({ visible: true, text: "Gestión de Usuarios" })}
          onMouseLeave={() => setTooltip({ visible: false, text: "" })}
        >
          <BiUser className="text-blue-950 w-6 h-6" />
          {tooltip.visible && tooltip.text === "Gestión de Usuarios" && (
            <div className="absolute bg-primary text-white p-2 rounded text-sm mt-10"> {/* Modificado mt-2 */}
              Gestión de Usuarios
            </div>
          )}
        </Link>

        <Link
          to="/gestionAutor"
          className={`flex flex-col items-center ${activeLink === "/gestionAutor" ? "border-b-2 border-blue-950" : ""}`}
          onMouseEnter={() => setTooltip({ visible: true, text: "Gestión de Autores" })}
          onMouseLeave={() => setTooltip({ visible: false, text: "" })}
        >
          <GiFeather className="text-blue-950 w-6 h-6" />
          {tooltip.visible && tooltip.text === "Gestión de Autores" && (
            <div className="absolute bg-primary text-white p-2 rounded text-sm mt-10"> {/* Modificado mt-2 */}
              Gestión de Autores
            </div>
          )}
        </Link>

        <Link
          to="/gestionLibro"
          className={`flex flex-col items-center ${activeLink === "/gestionLibro" ? "border-b-2 border-blue-950" : ""}`}
          onMouseEnter={() => setTooltip({ visible: true, text: "Gestión de Libros" })}
          onMouseLeave={() => setTooltip({ visible: false, text: "" })}
        >
          <GiOpenBook className="text-blue-950 w-6 h-6" />
          {tooltip.visible && tooltip.text === "Gestión de Libros" && (
            <div className="absolute bg-primary text-white p-2 rounded text-sm mt-10"> {/* Modificado mt-2 */}
              Gestión de Libros
            </div>
          )}
        </Link>

        <Link
          to="/gestionComunidad"
          className={`flex flex-col items-center ${activeLink === "/gestionComunidad" ? "border-b-2 border-blue-950" : ""}`}
          onMouseEnter={() => setTooltip({ visible: true, text: "Gestión de Comunidades" })}
          onMouseLeave={() => setTooltip({ visible: false, text: "" })}
        >
          <BiGroup className="text-blue-950 w-6 h-6" />
          {tooltip.visible && tooltip.text === "Gestión de Comunidades" && (
            <div className="absolute bg-primary text-white p-2 rounded text-sm mt-10"> {/* Modificado mt-2 */}
              Gestión de Comunidades
            </div>
          )}
        </Link>

        <Link
          to="/gestionDenuncia"
          className={`flex flex-col items-center ${activeLink === "/gestionDenuncia" ? "border-b-2 border-blue-950" : ""}`}
          onMouseEnter={() => setTooltip({ visible: true, text: "Gestión de Denuncias" })}
          onMouseLeave={() => setTooltip({ visible: false, text: "" })}
        >
          <BiError className="text-blue-950 w-6 h-6" />
          {tooltip.visible && tooltip.text === "Gestión de Denuncias" && (
            <div className="absolute bg-primary text-white p-2 rounded text-sm mt-10"> {/* Modificado mt-2 */}
              Gestión de Denuncias
            </div>
          )}
        </Link>

        <Link
          to="/gestionNotificacion"
          className={`flex flex-col items-center ${activeLink === "/gestionNotificacion" ? "border-b-2 border-blue-950" : ""}`}
          onMouseEnter={() => setTooltip({ visible: true, text: "Gestión de Notificaciones" })}
          onMouseLeave={() => setTooltip({ visible: false, text: "" })}
        >
          <BiBell className="text-blue-950 w-6 h-6" />
          {tooltip.visible && tooltip.text === "Gestión de Notificaciones" && (
            <div className="absolute bg-primary text-white p-2 rounded text-sm mt-10"> {/* Modificado mt-2 */}
              Gestión de Notificaciones
            </div>
          )}
        </Link>

        <Link
          to="/gestionResenas"
          className={`flex flex-col items-center ${activeLink === "/gestionResenas" ? "border-b-2 border-blue-950" : ""}`}
          onMouseEnter={() => setTooltip({ visible: true, text: "Gestión de Reseñas" })}
          onMouseLeave={() => setTooltip({ visible: false, text: "" })}
        >
          <BiComment className="text-blue-950 w-6 h-6" />
          {tooltip.visible && tooltip.text === "Gestión de Reseñas" && (
            <div className="absolute bg-primary text-white p-2 rounded text-sm mt-10"> {/* Modificado mt-2 */}
              Gestión de Reseñas
            </div>
          )}
        </Link>

        <Link
          to="/gestionPublicacion"
          className={`flex flex-col items-center ${activeLink === "/gestionPublicacion" ? "border-b-2 border-blue-950" : ""}`}
          onMouseEnter={() => setTooltip({ visible: true, text: "Gestión de Publicaciones" })}
          onMouseLeave={() => setTooltip({ visible: false, text: "" })}
        >
          <BiNews className="text-blue-950 w-6 h-6" />
          {tooltip.visible && tooltip.text === "Gestión de Publicaciones" && (
            <div className="absolute bg-primary text-white p-2 rounded text-sm mt-10"> {/* Modificado mt-2 */}
              Gestión de Publicaciones
            </div>
          )}
        </Link>
      </div>
    </nav>
  );
}

export default Nav;
