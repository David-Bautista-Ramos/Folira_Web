import { useEffect, useState } from "react";
import { FaRegComment } from "react-icons/fa";
import { BiShow, BiEdit, BiPlus, BiPowerOff, BiReset } from "react-icons/bi";
import { Link } from "react-router-dom";
import Nav from "../../components/common/Nav";
import banner_publicaciones from "../../assets/img/gestionPublicaciones.jpeg"; 
import ComentariosModal from "./ComentarioPublicidad";
import ModalActivarPublicacion from "./ModalActivarPublicacion";
import ModalInactivarPublicacion from "./ModalInactivarPublicacion";
import ModalCrearPublicacion from "./ModalCrearPublicacion";
import ModalActualizarPublicacion from "./ModalActualizarPublicacion";
import ModalFiltroPublicaciones from "../../components/common/FiltroPublicacion";
import ModalEliminarPublicacion from "./ModalEliminarPublicacion";

import GestionSkeleton from "../../components/skeletons/GestionSkeleton";

function GestionLibro() {

    const [publicaciones, setPublicaciones] = useState([]); // Corregido: useState en vez de useSatate
    const [selectedPublicacionesId, setSelectedPublicacionesId] = useState(null);

    const [isComentariosModalOpen, setIsComentariosModalOpen] = useState(false);
    const [comentarios, setComentarios] = useState([]);
    const [expandedPost] = useState(null);
    // const [publicacionSeleccionada, setPublicacionSeleccionada] = useState(null);

    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filteredPublicacion, setFilteredPublicacion] = useState([]); // Estado para el filtro de estado

    const [isLoading, setIsLoading] = useState(true); // Corregido: useState en vez de useSatate


    // Estados para los modales
    const [isActivarModalOpen, setIsActivarModalOpen] = useState(false);
    const [isInactivarModalOpen, setIsInactivarModalOpen] = useState(false);
    const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
    const [isActualizarModalOpen, setIsActualizarModalOpen] = useState(false);
    const [isEliminarModalOpen, setIsEliminarModalOpen] = useState(false);


    const obtenerPublicaciones = async () => {
        setIsLoading(true);
        try {
          const response = await fetch("/api/posts/post", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
    
          if (!response.ok) {
            throw new Error("Error al obtener las publicaciones");
          }
    
          const data = await response.json();
    
          // Asegúrate de que data sea un array
          if (Array.isArray(data)) {
            setPublicaciones(data); // Asigna los autores obtenidos al estado
            setFilteredPublicacion(data); // También asigna a autores filtrados
          } else {
            console.error("La respuesta de las publicaciones no es un array:", data);
          }
        } catch (error) {
          console.error("Error", error);
        } finally {
          setIsLoading(false);
        }
      };

    useEffect(() => {
        obtenerPublicaciones();
      }, []);

      const handleFilter = async (filter) => {
        // Añadido async
        console.log(`Filter selected: ${filter}`);
        setIsLoading(true);
    
        try {
          let response;
    
          if (filter === "Activo") {
            // Obtener autores activos
            response = await fetch("/api/posts/actpost", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });
          } else if (filter === "Inactivo") {
            // Obtener autores inactivos
            response = await fetch("/api/posts/despost", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });
          } else if (filter === "Restaurar") {
            setFilteredPublicacion(publicaciones); // Restaurar la lista completa de autores
            setIsFilterModalOpen(false); // Cerrar el modal
            setIsLoading(false); // Finaliza la carga
            return; // Salir de la función
          }
    
          if (!response.ok) {
            throw new Error("Error al filtrar las publicaciones");
          }
    
          const data = await response.json();
    
          if (data && Array.isArray(data)) {
            setFilteredPublicacion(data); // Asignar el array de autores filtrados
          } else {
            console.error("La respuesta no contiene un array de autores:", data);
          }
        } catch (error) {
          console.error("Error al filtrar", error);
        } finally {
          setIsLoading(false); // Asegúrate de finalizar la carga
        }
    
        setIsFilterModalOpen(false); // Cerrar el modal después de aplicar el filtro
    
      };

    const handleShowComentarios = (libroComentarios) => {
        setComentarios(libroComentarios);
        setIsComentariosModalOpen(true);
    };

    const [expandedPosts, setExpandedPosts] = useState({});

    const toggleExpandPost = (postId) => {
        setExpandedPosts((prev) => ({
        ...prev,
        [postId]: !prev[postId],
        }));
    };

    const isPostExpanded = (postId) => expandedPosts[postId] || false;

      // Filtrar publicaciones por estado
    const filteredPublicaciones = publicaciones.filter((libro) =>
        filteredPublicacion === "Todos" || libro.estado === filteredPublicacion
    );

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


    return (
        <div>
            <Nav />
            <div className="flex justify-center items-center mt-10">
                <main className="bg-white w-[100%] max-w-[1600px] mx-2 mt-20 rounded-t-2xl border border-gray-500 shadow-lg">
                    <div>
                        <img className="w-full h-[269px] rounded-t-2xl" src={banner_publicaciones} alt="banner" />
                    </div>

                    <div className="flex justify-end mt-4 mr-[70px]">
                        <button
                        onClick={setIsFilterModalOpen}
                        className="bg-primary text-white px-4 py-2 rounded mr-3 hover:bg-blue-950"
                        >
                        Estado
                        </button>
                        <button onClick={() => setIsCrearModalOpen(true)} title="Crear">
                            <BiPlus className="text-xl" />
                        </button>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 p-6">
                        {isLoading ? (
                            <GestionSkeleton /> // Muestra el componente de carga mientras se obtienen los datos
                        ) : Array.isArray(filteredPublicaciones) && filteredPublicaciones.length > 0 ? (
                            filteredPublicaciones.map((publicacion, index) => {
                            const isExpanded = expandedPost === publicacion._id;
                            const contenidoMostrado = isExpanded
                                ? publicacion.contenido
                                : `${publicacion.contenido.substring(0, 100)}...`;
                            const wordCount = publicacion.contenido.split(" ").length;

                            return (
                                <div key={index} className="flex flex-col w-[320px] bg-white border border-gray-300 p-4 rounded-md shadow-lg">
                                <div className="flex items-center mb-4">
                                    <div className="w-16 h-16 bg-gray-300 rounded-full overflow-hidden mr-4">
                                    <Link to={`/profile/${publicacion.postOwner._id}`}>
                                        <img
                                        className="object-cover w-full h-full"
                                        src={publicacion.postOwner.fotoPerfil}
                                        alt="Profile"
                                        />
                                    </Link>
                                    </div>
                                    <div>
                                    <Link to={`/profile/${publicacion.postOwner._id}`} className="font-semibold text-lg">
                                        {publicacion.postOwner.nombreCompleto}
                                    </Link>
                                    <p>Estado: {obtenerEstadoTexto(publicacion.estado)}</p>{" "}

                                    <p className="text-gray-500 text-sm">Palabras: {wordCount}</p>
                                    </div>
                                </div>

                                {/* Contenido de la publicación */}
                                <p className="text-gray-700 mb-2 break-all">{contenidoMostrado}</p>
                                <button
                                    onClick={() => toggleExpandPost(publicacion._id)}
                                    className="text-blue-600 hover:underline flex items-center"
                                >
                                    <BiShow className="text-xl" />
                                    <span className="ml-1">{isExpanded ? "Ocultar" : "Ver más"}</span>
                                </button>

                                {/* Imagen de la publicación */}
                                {publicacion.fotoPublicacion && (
                                    <img
                                    src={publicacion.fotoPublicacion}
                                    className="h-[300px] object-contain rounded-lg border border-blue-950 mt-2"
                                    alt="Post"
                                    />
                                )}

                                {/* Acciones e íconos en la parte inferior */}
                                <div className="flex justify-between items-center mt-2">
                                    <div
                                    className="flex gap-1 items-center cursor-pointer text-gray-500 hover:text-blue-600"
                                    onClick={() => handleShowComentarios(publicacion.comentarios)}
                                    >
                                    <FaRegComment className="text-xl" />
                                    <span>{publicacion.comentarios.length} Comentarios</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                    <button onClick={() => handleOpenActivarModal(publicacion._id)} title="Activar">
                                        <BiReset  className="text-xl" />
                                    </button>
                                    <button onClick={() => handleOpenDesactiveModal(publicacion._id)} title="Inactivar">
                                        <BiPowerOff className="text-xl" />
                                    </button>
                                    <button onClick={() => handleOpenDeleteModal(publicacion._id)} title="Eliminar">
                                        <BiPlus className="text-xl" />
                                    </button>
                                    <button onClick={() => handleOpenActualizarModal(publicacion._id)} title="Actualizar">
                                        <BiEdit className="text-xl" />
                                    </button>
                                    </div>
                                </div>

                                {/* Modal de comentarios */}
                                {isExpanded && (
                                    <div className="mt-2">
                                    <ComentariosModal
                                        isOpen={isComentariosModalOpen && comentarios.length > 0}
                                        onClose={() => {
                                        setIsComentariosModalOpen(false);
                                        setComentarios([]);
                                        }}
                                        comentarios={comentarios}
                                    />
                                    </div>
                                )}
                                </div>
                            );
                            })
                        ) : (
                            <p>No hay publicaciones disponibles.</p> // Mensaje para cuando no hay datos
                        )}
                        </div>




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
                        publicacionId={obtenerPublicaciones}
                        obtenerAutores={obtenerPublicaciones}
                    />

                    <ModalFiltroPublicaciones
                        isOpen={isFilterModalOpen}
                        onClose={() => setIsFilterModalOpen(false)}
                        onFilter={handleFilter} // Pasa el manejador de filtro
                        onRestore={handleRestore} // Pasa la función de restaurar
                    />
                </main>
            </div>

            {/* Solo el modal de comentarios */}
            <ComentariosModal
                isOpen={isComentariosModalOpen}
                onClose={() => {
                    setIsComentariosModalOpen(false);
                    setComentarios([]);
                }}
                comentarios={comentarios}
            />
        </div>
    );
}

export default GestionLibro;
