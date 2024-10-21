import { useState, useEffect } from "react";
import { BiPowerOff, BiReset, BiPlus, BiEdit, BiTrash, BiLeftArrow, BiRightArrow } from "react-icons/bi";
import Nav from "../../components/common/Nav";
import ModalActivarNotificacion from "./ModalActivarNotificacion";
import ModalActualizarNotificacion from "./ModalActualizarNotificacion";
import ModalInactivarNotificacion from "./ModalInactivarNotificacion";
import banner_notificacion from "../../assets/img/banner_gestion_notificaciones.png"; 
import ModalFiltrarEstado from "../../components/common/FiltrarNotificacionEstado";
import { FaUser, FaHeart, FaAward, FaTriangleExclamation, FaRegMessage } from "react-icons/fa6";
import ModalEliminarNotificacion from "./ModalEliminarNotificacion";
import ModalFiltroEstado from "../../components/common/ModalListarDenuncia";
import ModalCrearNotificacion from '../gestionNotificaciones/ModalCrearNotificacion';
import ModalTipoNotificacion from "./ModalTipoNotificacion";

function GestionNotificacion() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [selectedNotificacionId, setSelectedNotificacionId] = useState([]);
  const [filteredNotificaciones, setFilteredNotificaciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isFilterModalOpenTipo, setIsFilterModalOpenTipo] = useState(false);
  const [isActivarModalOpen, setIsActivarModalOpen] = useState(false);
  const [isInactivarModalOpen, setIsInactivarModalOpen] = useState(false);
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isActualizarModalOpen, setIsActualizarModalOpen] = useState(false);
  const [isEliminarModalOpen, setIsEliminarModalOpen] = useState(false);
  const [selectedTipo, setSelectedTipo] = useState("");
  const [visibleCount, setVisibleCount] = useState(6); // Estado para el select de cantidad de usuarios visibles
  const [searchTerm, setSearchTerm] = useState(""); // Estado para la búsqueda
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(1); // Número total de páginas


  useEffect(() => {
    obtenerNotificaciones();
  }, []);

 /// Filtrado por búsqueda y tipo de notificación
  useEffect(() => {
    let denunciasFiltradas = notificaciones;

    // Si hay un término de búsqueda, filtrar las denuncias por el término de búsqueda
    if (searchTerm) {
      denunciasFiltradas = denunciasFiltradas.filter(
        (notificacion) =>
          notificacion.de?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          notificacion.de?.nombreCompleto?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Si hay un tipo de notificación seleccionado, aplicar el filtro por tipo
    if (selectedTipo) {
      denunciasFiltradas = denunciasFiltradas.filter(
        (notificacion) => notificacion.tipo.toLowerCase() === selectedTipo.toLowerCase()
      );
    }

    // Actualizamos las notificaciones filtradas
    setFilteredNotificaciones(denunciasFiltradas);
  }, [searchTerm, selectedTipo, notificaciones]);



  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Actualiza el término de búsqueda
  };

  // actualizar el total de páginas cada vez que el número de usuarios filtrados o la cantidad visible cambien.
  useEffect(() => {
    const totalnotificaciones = filteredNotificaciones.length;
    setTotalPages(Math.ceil(totalnotificaciones / visibleCount));
  }, [filteredNotificaciones, visibleCount]);

  const startIndex = (currentPage - 1) * visibleCount;
  const endIndex = startIndex + visibleCount;
  const notificacionesPaginados = filteredNotificaciones.slice(startIndex, endIndex);


   // Función para cambiar la página
   const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };


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

  // Manejar el filtro por tipo de notificación
  const handleFilterByTipo = (tipo) => {
    if (!tipo) {
      // Si no hay tipo seleccionado, mostrar todas las notificaciones
      setFilteredNotificaciones(notificaciones);
    } else {
      const filtered = notificaciones.filter((notificacion) => {
        return notificacion.tipo.toLowerCase() === tipo.toLowerCase();
      });
      setFilteredNotificaciones(filtered);
    }
    setSelectedTipo(tipo); // Actualiza el tipo seleccionado
    
    // Cerrar el modal después de seleccionar el tipo
    setIsFilterModalOpenTipo(false); 
  };
  

const handleVisibleCountChange = (event) => {
  setVisibleCount(Number(event.target.value)); // Actualiza la cantidad visible
};

  return (
    <div>
      <Nav />
      <div className="flex justify-center items-center mt-10">
        <main className="bg-white w-full max-w-[1600px] mx-2 mt-20 rounded-t-2xl border border-gray-500 shadow-lg">
          <div>
            <img className="w-full h-[350px] rounded-t-2xl border-b-2 border-primary" 
            src={banner_notificacion} 
            alt="banner" />
          </div>

          <div className="flex justify-between items-center mt-4 mx-[70px]">

            {/* Contenedor para el select y la barra de búsqueda alineados a la izquierda */}
            <div className="flex gap-4">
              {/* Select para elegir cuántos usuarios ver */}
              <select
                value={visibleCount}
                onChange={handleVisibleCountChange}
                className="bg-white border border-gray-400 p-2 rounded"
              >
                <option value={5}> 5 usuarios</option>
                <option value={15}> 15 usuarios</option>
                <option value={20}> 20 usuarios</option>
              </select>

              {/* Barra de búsqueda */}
              <input
                type="text"
                placeholder="Buscar notificaciones..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="p-2 border border-gray-400 rounded w-[340px]"
              />
            </div>

          <button
            onClick={() => setIsFilterModalOpenTipo(true)}
            className="bg-primary text-white px-4 py-2 rounded mr-3 hover:bg-blue-950"
          >
            Filtrar por Tipo
          </button>

          <button
              onClick={() => setIsFilterModalOpen(true)}
              className="bg-primary text-white px-4 py-2 rounded mr-3 hover:bg-blue-950"
            >
              Estado
            </button>

            <button onClick={() => setIsCrearModalOpen(true)} title="Crear">
              <BiPlus className="text-xl" />
            </button>
            
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center my-10">
              <p>Cargando notificaciones...</p>
            </div>
          ) : filteredNotificaciones.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-10 p-2">
              {notificacionesPaginados.map((notificacion) => (
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
          {/* Paginación */}
          <div className="flex justify-between mb-3  items-center mt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-2 py-2 bg-gray-300 ml-[430px] rounded hover:bg-gray-400 disabled:bg-gray-200"
              >
                <BiLeftArrow />
              </button>

              <span className="mx-2">
                Página {currentPage} de {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-2 py-2 bg-gray-300 mr-[430px] rounded hover:bg-gray-400 disabled:bg-gray-200"
              >
                <BiRightArrow />
              </button>
            </div>


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

            {/* Modal para filtrar por tipo */}
            <ModalTipoNotificacion
              isOpen={isFilterModalOpenTipo} // Controla si el modal está abierto
              onClose={() => setIsFilterModalOpenTipo(false)} // Cierra el modal cuando sea necesario
              onFilter={handleFilterByTipo} // Maneja el filtro y cierre del modal
            />


        </main>
      </div>
      {isFilterModalOpen && <ModalFiltrarEstado onClose={() => setIsFilterModalOpen(false)} onFilter={handleFilter} />}
    </div>
  );
}

export default GestionNotificacion;
