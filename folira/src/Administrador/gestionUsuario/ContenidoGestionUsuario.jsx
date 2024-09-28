import activar_icon from '../static/icons/boton-activo.png';
import inactivar_icon from '../static/icons/boton-inactivo.png';
import crear_icon from '../static/icons/crear.png';
import actualizar_icon from '../static/icons/actualizar.png';
import foto_usua1 from '../static/img/dp4.jpeg';

function ContenidoGestionUsuario({ onInactivar, onActivar, onCrear, onActualizar }) {
  return (
    <div className="flex flex-wrap justify-between p-5">
      {[1, 2, 3, 4].map((_, index) => (
        <section key={index} className="bg-gray-200 rounded-lg shadow-md m-2 p-5 w-1/2">
          <div className="flex items-center">
            <img src={foto_usua1} alt="Usuario" className="rounded-full border border-gray-600 w-40 h-40 mr-5" />
            <div className="text-lg">
              <p><strong>Nombre:</strong> Alex Rodriguez</p>
              <p><strong>Nombre Usuario:</strong> Alex_🫶🏼</p>
            </div>
          </div>
          <div className="flex justify-center mt-2">
            <button className="bg-transparent border-none cursor-pointer mx-2" onClick={onActivar}>
              <img src={activar_icon} alt="Activar" className="w-10 h-10" />
            </button>
            <button className="bg-transparent border-none cursor-pointer mx-2" onClick={onInactivar}>
              <img src={inactivar_icon} alt="Inactivar" className="w-10 h-10" />
            </button>
            <button className="bg-transparent border-none cursor-pointer mx-2" onClick={onCrear}>
              <img src={crear_icon} alt="Crear" className="w-10 h-10" />
            </button>
            <button className="bg-transparent border-none cursor-pointer mx-2" onClick={onActualizar}>
              <img src={actualizar_icon} alt="Actualizar" className="w-10 h-10" />
            </button>
          </div>
        </section>
      ))}
    </div>
  );
}

export default ContenidoGestionUsuario;
