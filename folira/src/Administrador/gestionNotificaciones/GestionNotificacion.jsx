import { useState, useEffect } from "react";
import { BiPowerOff, BiReset, BiPlus, BiEdit, BiTrash } from "react-icons/bi";
import Nav from "../../components/common/Nav";
import ModalActivarNotificacion from "./ModalActivarNotificacion";
import ModalActualizarNotificacion from "./ModalActualizarNotificacion";
import ModalInactivarNotificacion from "./ModalInactivarNotificacion";
import banner_notificacion from "../../assets/img/gestionNotificacion.jpeg";
import ModalFiltrarEstado from "../../components/common/FiltrarNotificacionEstado";
import { FaUser, FaHeart, FaAward, FaTriangleExclamation, FaRegMessage } from "react-icons/fa6";
import ModalEliminarNotificacion from "./ModalEliminarNotificacion";
import ModalFiltroEstado from "../../components/common/ModalListarDenuncia";
import ModalCrearNotificacion from '../gestionNotificaciones/ModalCrearNotificacion';

function GestionNotificacion() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [selectedNotificacionId, setSelectedNotificacionId] = useState([]);
  const [filteredNotificaciones, setFilteredNotificaciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isActivarModalOpen, setIsActivarModalOpen] = useState(false);
  const [isInactivarModalOpen, setIsInactivarModalOpen] = useState(false);
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isActualizarModalOpen, setIsActualizarModalOpen] = useState(false);
  const [isEliminarModalOpen, setIsEliminarModalOpen] = useState(false);


  useEffect(() => {
    obtenerNotificaciones();
  }, []);

  const obtenerNotificaciones = async () => {
    try {
      const response = await fetch("/api/notifications/notifi", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Error al obtener las notificaciones");
      const data = await response.json();
      setNotificaciones(data.notificaciones);
      setFilteredNotificaciones(data.notificaciones);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Manejo del filtrado
  // Manejo del filtrado
const handleFilter = async (filter) => {
  console.log(`Filtro seleccionado: ${filter}`);
  setIsLoading(true);

  try {
    let response;
    if (filter === "Activo") {
      response = await fetch("/api/notifications/notifinoleact", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
    } else if (filter === "Inactivo") {
      response = await fetch("/api/notifications/notifinoledes", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
    } else if (filter === "Restaurar") {
      setFilteredNotificaciones(notificaciones); // Restaurar a todas las notificaciones
      setIsFilterModalOpen(false);
      setIsLoading(false);
      return;
    }

    if (!response.ok) throw new Error("Error al filtrar notificaciones");

    const data = await response.json();

    // Verifica si hay notificacionesNoLeidas y usa su valor
    const notificacionesArray = data.notificacionesNoLeidas || [];

    if (Array.isArray(notificacionesArray)) {
      setFilteredNotificaciones(notificacionesArray); // Actualizar con las filtradas
    } else {
      console.error("La respuesta no es un array de notificaciones:", notificacionesArray);
    }
  } catch (error) {
    console.error("Error al filtrar notificaciones:", error);
  } finally {
    setIsLoading(false);
    setIsFilterModalOpen(false);
  }
};


  const getNotificationIcon = (tipo) => {
    switch (tipo) {
      case "seguidor":
        return <FaUser className="text-blue-600 text-2xl" />;
      case "like":
        return <FaHeart className="text-red-500 text-2xl" />;
      case "insignia":
        return <FaAward className="text-yellow-500 text-2xl" />;
      case "denuncia":
        return <FaTriangleExclamation className="text-gray-600 text-2xl" />;
      case "comentario":
        return <FaRegMessage className="text-green-500 text-2xl" />;
      default:
        return null;
    }
  };

  // Función para abrir diferentes modales
  const handleOpenActivarModal = (notificacionId) => {
    setSelectedNotificacionId(notificacionId); 
    setIsActivarModalOpen(true);
  };
  const handleOpenDesactiveModal = (notificacionId) =>{
    setSelectedNotificacionId(notificacionId);
    setIsInactivarModalOpen(true);
  };
  const handleOpenActualizarModal = (notificacionId) => {
    setSelectedNotificacionId(notificacionId); 
    setIsActualizarModalOpen(true);
  };

  const handleOpenDeleteModal = (notificacionId) => {
    setSelectedNotificacionId(notificacionId); // Guardar el ID del usuario seleccionado
    setIsEliminarModalOpen(true); // Abrir el modal
  }

  return (
    <div>
      <Nav />
      <div className="flex justify-center items-center mt-10">
        <main className="bg-white w-full max-w-[1600px] mx-2 mt-20 rounded-t-2xl border border-gray-500 shadow-lg">
          <div>
            <img className="w-full h-64 rounded-t-2xl" src={banner_notificacion} alt="banner" />
          </div>

          <div className="flex justify-end mt-4 mr-[70px]">
            <button onClick={() => setIsCrearModalOpen(true)} title="Crear">
              <BiPlus className="text-xl" />
            </button>
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="bg-primary text-white px-4 py-2 rounded mr-3 hover:bg-blue-950"
            >
              Estado
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center my-10">
              <p>Cargando notificaciones...</p>
            </div>
          ) : filteredNotificaciones.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-10 p-2">
              {filteredNotificaciones.map((notificacion) => (
                <div key={notificacion._id} className="bg-white shadow-lg rounded-lg w-[320px] p-2 mb-4 border border-gray-300 flex flex-col">
                  <div className="flex items-center gap-4 mb-2">
                    <div>{getNotificationIcon(notificacion.tipo)}</div>
                    <div className="flex flex-col">
                      <span className="font-bold">{notificacion.de.nombre} ha enviado una notificación</span>
                      <span className="font-bold">{notificacion.para.nombre} ha resibido la notificación</span>
                      <p className="text-gray-700 mb-2">
                        Tipo: {notificacion.tipo.charAt(0).toUpperCase() + notificacion.tipo.slice(1)}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600">Estado: {notificacion.leido ? "Leído" : "No leído"}</p>
                  <div className="mt-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleOpenActivarModal(notificacion._id)} title="Activar">
                        <BiPowerOff className="text-xl" />
                      </button>
                      <button onClick={() => handleOpenDesactiveModal(notificacion._id)} title="Inactivar">
                        <BiReset className="text-xl" />
                      </button>
                      <button onClick={() => handleOpenActualizarModal(notificacion._id)} title="Actualizar">
                        <BiEdit className="text-xl" />
                      </button>
                      <button
                      onClick={() => handleOpenDeleteModal(notificacion._id)}title="Eliminar"><BiTrash className="text-xl" />
                    </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center my-10">
              <p>No hay notificaciones para mostrar.</p>
            </div>
          )}
          {/* Modales */}
          <ModalInactivarNotificacion
              isOpen={isInactivarModalOpen}
              onClose={() => setIsInactivarModalOpen(false)}
              NotificacionId={selectedNotificacionId}
              obtenerNotificaciones={obtenerNotificaciones}
            />
            <ModalActivarNotificacion
              isOpen={isActivarModalOpen}
              onClose={() => setIsActivarModalOpen(false)}
              NotificacionId={selectedNotificacionId}
              obtenerNotificaciones={obtenerNotificaciones}
            />
            <ModalActualizarNotificacion
              isOpen={isActualizarModalOpen}
              onClose={() => { setIsActualizarModalOpen(false); obtenerNotificaciones(); }} // Cambia a setIsActualizarModalOpen
              NotificacionId={selectedNotificacionId}
              obtenerNotificaciones={obtenerNotificaciones}
            />
            <ModalCrearNotificacion
              isOpen={isCrearModalOpen}
              onClose={() => {setIsCrearModalOpen(false); obtenerNotificaciones () }}
              obtenerNotificaciones={obtenerNotificaciones}
            />
             <ModalEliminarNotificacion
                isOpen={isEliminarModalOpen}
                onClose={() => setIsEliminarModalOpen(false)}
                NotificacionId={selectedNotificacionId} // Pasar el ID del usuario seleccionado
                obtenerNotificaciones={obtenerNotificaciones} // Para refrescar la lista de usuarios
              />
            <ModalFiltroEstado
              isOpen={isFilterModalOpen}
              onClose={() => setIsFilterModalOpen(false)}
              onFilter={handleFilter} // Pass the filter handler
              onRestore = {handleFilter}
            />
        </main>
      </div>
      {isFilterModalOpen && <ModalFiltrarEstado onClose={() => setIsFilterModalOpen(false)} onFilter={handleFilter} />}
    </div>
  );
}

export default GestionNotificacion;
