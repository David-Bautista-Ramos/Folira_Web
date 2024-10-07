
// import logo_nav from '../../static/img/folira-logo.png';
// import book_nav from '../../static/icons/book-nav.svg';
// import autor_nav from '../../static/icons/autor_nav.svg';
// import reseña_nav from '../../static/icons/reseñas_nav.svg';
// import comunidad_nav from '../../static/icons/comunidad-nav.svg';
// import denuncia_nav from '../../static/icons/denuncia-nav.svg';
// import lupa_nav from '../../static/icons/lupa-nav.svg';
// import noti_nav from '../../static/icons/noti-nav.svg';
// import perfil_nav from '../../static/icons/perfil-nav.svg';
import { Link } from "react-router-dom";

function Nav() {
  return (
    <nav className="w-full h-14 bg-white border-b border-gray-700 fixed top-0 left-0 z-50 px-7 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center">
          <Link to="/">
            <img className="w-10 cursor-pointer" src={"logo_nav"} alt="logo_nav" />
          </Link>
      </div>

      {/* Navigation options */}
      <div className="flex items-center space-x-12 ml-[15%]">
        <Link to="/gestionLibro">
          <img className="h-10 hover:bg-gray-100 p-2 rounded" src={"book_nav"} alt="book-nav" />
        </Link>
        <Link to="/gestionAutor">
          <img className="h-10 hover:bg-gray-100 p-2 rounded" src={"autor_nav"} alt="autor_nav" />
        </Link>
        <Link to="/gestionResenas">
          <img className="h-10 hover:bg-gray-100 p-2 rounded" src={"reseña_nav"} alt="reseña_nav" />
        </Link>
        <Link to="/gestionComunidad">
          <img className="h-10 hover:bg-gray-100 p-2 rounded" src={"comunidad_nav"} alt="comunidad_nav" />
        </Link>
        <Link to="/gestionDenuncia">
          <img className="h-10 hover:bg-gray-100 p-2 rounded" src={"denuncia_nav"} alt="denuncia_nav" />
        </Link>
      </div>

      {/* Search bar */}
      <div className="flex items-center bg-white border border-[#501b31] rounded-full pl-2 w-[250px]">
        <input
          type="search"
          className="w-full h-10 rounded-full focus:outline-none text-black text-sm placeholder-gray-500 px-2"
          placeholder="Buscar"
        />
        <img className="h-6 pl-2 cursor-pointer" src={"lupa_nav"} alt="lupa_nav" />
      </div>

      {/* Notification and profile icons */}
      <div className="flex items-center space-x-4">
        <img className="h-10 cursor-pointer p-2 rounded-full hover:bg-gray-100" src={"noti_nav"} alt="notificacion_nav" />
        <Link to="/profile">
          <img className="h-10 cursor-pointer p-2 rounded-full hover:bg-gray-100" src={"perfil_nav"} alt="perfil_nav" />
        </Link>
      </div>
    </nav>
  );
}

export default Nav;
