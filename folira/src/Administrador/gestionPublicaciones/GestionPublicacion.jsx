import { useEffect, useState } from "react";
import { FaRegComment } from "react-icons/fa";
import { BiShow, BiPlus , BiEdit, BiPowerOff, BiReset, BiTrash } from "react-icons/bi";
import { Link } from "react-router-dom";
import Nav from "../../components/common/Nav";
import banner_publicaciones from "../../assets/img/banner_gestion_publicaciones.png"; 
import GestionSkeleton from "../../components/skeletons/GestionSkeleton";
import ComentariosModal from "./ComentarioPublicidad";
import ModalActivarPublicacion from "./ModalActivarPublicacion";
import ModalInactivarPublicacion from "./ModalInactivarPublicacion";
import ModalCrearPublicacion from "./ModalCrearPublicacion";
import ModalActualizarPublicacion from "./ModalActualizarPublicacion";
import ModalFiltroPublicaciones from "../../components/common/FiltroPublicacion";
import ModalEliminarPublicacion from "./ModalEliminarPublicacion";

function GestionPublicaciones() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [selectedPublicacionesId, setSelectedPublicacionesId] = useState(null);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filteredPublicacion, setFilteredPublicacion] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isComentariosModalOpen, setIsComentariosModalOpen] = useState(false);

  
    // Estados para los modales
    const [isActivarModalOpen, setIsActivarModalOpen] = useState(false);
    const [isInactivarModalOpen, setIsInactivarModalOpen] = useState(false);
    const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
    const [isActualizarModalOpen, setIsActualizarModalOpen] = useState(false);
    const [isEliminarModalOpen, setIsEliminarModalOpen] = useState(false);
  

  // Obtener publicaciones de la API
  const obtenerPublicaciones = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/posts/all");
      if (!response.ok) throw new Error("Error al obtener las publicaciones");

      const data = await response.json();
      setPublicaciones(Array.isArray(data) ? data : []);
      setFilteredPublicacion(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    obtenerPublicaciones();
  }, []);

  // Método para manejar el filtrado
  const handleFilter = async (filter) => {
    console.log(`Filter selected: ${filter}`);
    setIsLoading(true); // Inicia la carga al filtrar

    try {
      let response;
  
      if (filter === "Activo") {
        response = await fetch('/api/posts/getactpost', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else if (filter === "Inactivo") {
        response = await fetch('/api/posts/getdespost', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else if (filter === "Restaurar") {
        setFilteredPublicacion(publicaciones); // Restaurar la lista completa de usuarios
        setIsFilterModalOpen(false); // Cerrar el modal
        setIsLoading(false); 
        return;
      }
  
      if (!response.ok) {
        throw new Error('Error al filtrar las publicaciones');
      }
  
      const data = await response.json();
      
      if (data && Array.isArray(data.publicaciones)) {
        setFilteredPublicacion(data.publicaciones); // Asignar el array de usuarios filtrados
      } else {
        console.error('La respuesta no contiene un array de las publicaciones:', data);
      }
    } catch (error) {
      console.error('Error al filtrar publicaciones:', error);
    } finally {
      setIsLoading(false); // Finaliza la carga
    }
  
    setIsFilterModalOpen(false); // Cerrar el modal después de aplicar el filtro
  };

  const toggleExpandPost = (postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const abrirComentarios = (publicacion) => {
    if (publicacion.comentarios && publicacion.comentarios.length > 0) {
      setSelectedPublicacionesId(publicacion._id); // Cambiado para almacenar solo el ID
      setIsComentariosModalOpen(true);
    } else {
      console.warn("No hay comentarios para esta publicación");
    }
  };


    const handleRestore = () => {
        setFilteredPublicacion(publicaciones); // Restaurar todos los autores
        setIsFilterModalOpen(false); // Cerrar el modal después de restaurar
      };
      
      const handleOpenActivarModal = (publicacionId) => {
        setSelectedPublicacionesId(publicacionId); // Guardar el ID del usuario seleccionado
        setIsActivarModalOpen(true); // Abrir el modal
      };
      const handleOpenDeleteModal = (publicacionId) => {
        setSelectedPublicacionesId(publicacionId); // Guardar el ID del usuario seleccionado
        setIsEliminarModalOpen(true); // Abrir el modal
      };
      const handleOpenDesactiveModal = (publicacionId) => {
        setSelectedPublicacionesId(publicacionId); // Guardar el ID del usuario seleccionado
        setIsInactivarModalOpen(true); // Abrir el modal
      };
      const handleOpenActualizarModal = (publicacionId) => {
        setSelectedPublicacionesId(publicacionId);
        setIsActualizarModalOpen(true);
      };
    
      // Función para convertir estado booleano a texto
      const obtenerEstadoTexto = (estado) => {
        return estado ? "Activo" : "Inactivo";
      };

        // Determinar el tipo de publicación
  const obtenerTipoPublicacion = (idComunidad) => {
    return idComunidad ? "Comunidad" : "General";
  }
  return (
    <div>
      <Nav />
      <div className="flex justify-center items-center mt-10">
        <main className="bg-white w-full max-w-6xl mx-2 mt-20 rounded-t-2xl border shadow-lg">
          <img
            className="w-full h-[350px] rounded-t-2xl border-b-2 border-primary"
            src={banner_publicaciones}
            alt="banner"
          />
          <div className="flex justify-end mt-4 mr-16">
            <button onClick={() =>setIsCrearModalOpen(true)} title="Crear">
              <BiPlus className="text-xl" />
            </button>
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-900"
            >
              Estado
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 p-6">
            {isLoading ? (
              <GestionSkeleton />
            ) : filteredPublicacion.length === 0 ? ( 
              <p className="text-center text-gray-500 text-xl mt-10">No hay publicaciones</p> 
            ) : (
              filteredPublicacion.map((publicacion) => {
                const isExpanded = expandedPosts[publicacion._id] || false;
                const contenidoMostrado = isExpanded
                  ? publicacion.contenido
                  : `${publicacion.contenido.substring(0, 100)}...`;

                  const tipoPublicacion = obtenerTipoPublicacion(publicacion.idComunidad);

                return (
                  <div
                    key={publicacion._id}
                    className="flex flex-col w-80 bg-white border p-4 rounded-md shadow-lg"
                  >
                    <div className="flex items-center mb-4">
                      <Link to={`/profile/${publicacion.user._id}`}>
                        <img
                          className="w-16 h-16 rounded-full"
                          src={publicacion.user.fotoPerfil}
                          alt="Profile"
                        />
                      </Link>
                      <div className="ml-4">
                        <Link
                          to={`/profile/${publicacion.user._id}`}
                          className="font-semibold text-lg"
                        >
                          {publicacion.user.nombreCompleto}
                        </Link>
                        <p>Estado: {obtenerEstadoTexto(publicacion.estado)}</p>
                        <p>Tipo de publicación: {tipoPublicacion}</p> {/* Mostrar tipo de publicación */}

                      </div>
                    </div>

                    <p
                      className="text-gray-700 mb-2 break-words overflow-hidden"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: isExpanded ? "none" : "4",
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {contenidoMostrado}
                    </p>
                    {publicacion.fotoPublicacion && (
                      <img
                        src={publicacion.fotoPublicacion}
                        className="w-full h-40 object-cover mt-2 rounded-md"
                        alt="Publicación"
                      />
                    )}
                    <button
                      onClick={() => toggleExpandPost(publicacion._id)}
                      className="text-blue-600 hover:underline flex items-center mt-2"
                    >
                      <BiShow className="text-xl" />
                      <span className="ml-1">
                        {isExpanded ? "Ocultar" : "Ver más"}
                      </span>
                    </button>

                    <div className="flex items-center justify-between mt-4">
                     <button
                        onClick={() => abrirComentarios(publicacion)}
                        className="text-gray-600 hover:text-black flex items-center"
                      >
                        <FaRegComment className="text-xl" />
                        <span className="ml-1">
                          {publicacion.comentarios.length} Comentarios
                        </span>
                      </button>
                    </div>
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleOpenActivarModal(publicacion._id)}
                        title="Activar"
                      >
                        <BiPowerOff className="text-xl" />
                      </button>
                      <button
                        onClick={() => handleOpenDesactiveModal(publicacion._id)}
                        title="Inactivar"
                      >
                        <BiReset className="text-xl" />
                      </button>
                      <button
                        onClick={() => handleOpenActualizarModal(publicacion._id)}
                        title="Actualizar"
                      >
                        <BiEdit className="text-xl" />
                      </button>
                      <button
                        onClick={() => handleOpenDeleteModal(publicacion._id)}
                        title="Eliminar"
                      >
                        <BiTrash className="text-xl" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

           {/* Modales para activar, inactivar, crear y actualizar publicaciones */}
                     {/* Modales para activar, inactivar, crear y actualizar publicaciones */}
          <ModalActivarPublicacion 
            isOpen={isActivarModalOpen} 
            onClose={() => setIsActivarModalOpen(false)}
            publicacionId={selectedPublicacionesId}
            obtenerPublicaciones={obtenerPublicaciones}
          />
          <ModalInactivarPublicacion 
            isOpen={isInactivarModalOpen} 
            onClose={() => setIsInactivarModalOpen(false)} 
            publicacionId={selectedPublicacionesId}
            obtenerPublicaciones={obtenerPublicaciones}
          />
          <ModalEliminarPublicacion 
            isOpen={isEliminarModalOpen}
            onClose={() => setIsEliminarModalOpen(false)}
            publicacionId={selectedPublicacionesId}
            obtenerPublicaciones={obtenerPublicaciones}
          />
          <ModalCrearPublicacion 
            isOpen={isCrearModalOpen}
            onClose={() => {
              setIsCrearModalOpen(false);
              obtenerPublicaciones();
            }}
            obtenerPublicaciones={obtenerPublicaciones}
          />
          <ModalActualizarPublicacion
            isOpen={isActualizarModalOpen}
            onClose={() => {
              setIsActualizarModalOpen(false);
              obtenerPublicaciones();
            }}
            publicacionId={selectedPublicacionesId} // Pass the correct publicacionId
            obtenerPublicaciones={obtenerPublicaciones}
          />
          <ModalFiltroPublicaciones
            isOpen={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
            onFilter={handleFilter}
            onRestore={handleRestore}
          />
        </main>
      </div>

      {/* Conditionally render ComentariosModal */}
      {selectedPublicacionesId && (
        <ComentariosModal
          isOpen={isComentariosModalOpen}
          onClose={() => setIsComentariosModalOpen(false)}
          comentarios={publicaciones.find(pub => pub._id === selectedPublicacionesId)?.comentarios || []} // Use find to get the comments for the selected publication
          publicacionId={selectedPublicacionesId}
          obtenerPublicaciones={obtenerPublicaciones}
        />
      )}
    </div>
  );
}

export default GestionPublicaciones;
