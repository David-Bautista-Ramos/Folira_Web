import { useEffect, useState } from "react";
import { BiEdit, BiLeftArrow, BiPlus, BiPowerOff, BiReset, BiRightArrow, BiTrash } from "react-icons/bi"; 
import { Link } from "react-router-dom";
import Nav from "../../components/common/Nav";
import banner_resenas from "../../assets/img/banner_gestion_resenas.png";  
import ModalActivarReseña from "./ModalActivarReseña";
import ModalInactivarReseña from "./ModalInactivarReseña";
import ModalCrearReseña from "./ModalCrearReseña";
import ModalActualizarReseña from "./ModalActualizarReseña";
import ModalEliminarResena from "./ModalEliminarResena";
import FiltrarResenaEstado from "../../components/common/FiltrarResenaEstado";
import GestionSkeleton from "../../components/skeletons/GestionSkeleton";

function GestionResenas() {
    const [isActivarModalOpen, setIsActivarModalOpen] = useState(false);
    const [isInactivarModalOpen, setIsInactivarModalOpen] = useState(false);
    const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
    const [isActualizarModalOpen, setIsActualizarModalOpen] = useState(false);
    const [isEliminarModalOpen, setIsEliminarModalOpen] = useState(false);
    
    const [selectedResenaId, setSelectedResenaId] = useState(null);
    const [resenas, setResenas] = useState([]);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filteredResenas, setFilteredResenas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [visibleCount, setVisibleCount] = useState(10); // Estado para el select de cantidad de usuarios visibles
    const [searchTerm, setSearchTerm] = useState(""); // Estado para la búsqueda
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const [totalPages, setTotalPages] = useState(1); // Número total de páginas

    
    const obtenerResenas = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/resenas/getresenas", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
        
            if (!response.ok) {
                throw new Error("Error al obtener las reseñas");
            }
        
            const data = await response.json();
            console.log(data); // Imprimir la respuesta para depurar
    
            // Verificar si la respuesta es un array
            if (data && Array.isArray(data)) {
                setResenas(data);
                setFilteredResenas(data);
            } else {
                console.error("La respuesta no contiene un array de reseñas:", data);
            }
            
        } catch (error) {
            console.error("Error", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        obtenerResenas();
    }, []);

   // Filtrado por búsqueda de usuarios
useEffect(() => {
    if (searchTerm.trim()) {
      // Filtrar las reseñas por el nombre o nombre completo del usuario que hace la reseña
      const usuariosFiltrados = resenas.filter((resena) =>
        [resena.idUsuario?.nombre, resena.idUsuario?.nombreCompleto]
          .filter(Boolean) // Evita errores si algún campo es nulo
          .some((campo) => campo.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredResenas(usuariosFiltrados);
    } else {
      // Si no hay búsqueda, mostramos todas las reseñas
      setFilteredResenas(resenas);
    }
  }, [searchTerm, resenas]);
  

  // Función para cambiar el estado del término de búsqueda
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value); // Actualiza el término de búsqueda
    };

 // Actualizar el número total de páginas basado en la cantidad visible y los usuarios filtrados
    useEffect(() => {
        setTotalPages(Math.ceil(filteredResenas.length / visibleCount));
    }, [filteredResenas.length, visibleCount]);

  // Función para cambiar la página actual
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
        }
    };

  const startIndex = (currentPage - 1) * visibleCount;
  const endIndex = startIndex + visibleCount;
  const resenasPaginados = filteredResenas.slice(startIndex, endIndex);

    
    const handleFilter = async (filter) => {
        console.log(`Filter selected: ${filter}`);
        setIsLoading(true);
    
        try {
            let response;
    
            if (filter === "Activo") {
                response = await fetch("/api/resenas/getresenasact", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            } else if (filter === "Inactivo") {
                response = await fetch("/api/resenas/getresenasdes", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            } else if (filter === "Restaurar") {
                setFilteredResenas(resenas);
                setIsFilterModalOpen(false);
                setIsLoading(false);
                return;
            }
    
            if (!response.ok) {
                throw new Error("Error al filtrar las reseñas");
            }
    
            const data = await response.json();
    
            if (data && Array.isArray(data.resenas)) {
                setFilteredResenas(data.resenas);
            } else {
                console.error("La respuesta no contiene un array de reseñas:", data);
            }
        } catch (error) {
            console.error("Error al filtrar", error);
        } finally {
            setIsLoading(false);
        }
        setIsFilterModalOpen(false);
    };

    const [expandedPosts, setExpandedPosts] = useState({});

    const toggleExpandPost = (postId) => {
        setExpandedPosts((prev) => ({
            ...prev,
            [postId]: !prev[postId],
        }));
    };

    const isPostExpanded = (postId) => expandedPosts[postId] || false;

    const filteredPublicaciones = filteredResenas.length > 0 ? filteredResenas : resenas;

    const handleRestore = () => {
        setFilteredResenas(resenas);
        setIsFilterModalOpen(false);
    };
      
    const handleOpenActivarModal = (resenaId) => {
        setSelectedResenaId(resenaId);
        setIsActivarModalOpen(true);
    };
    
    const handleOpenDeleteModal = (resenaId) => {
        setSelectedResenaId(resenaId);
        setIsEliminarModalOpen(true);
    };
    
    const handleOpenDesactiveModal = (resenaId) => {
        setSelectedResenaId(resenaId);
        setIsInactivarModalOpen(true);
    };
    
    const handleOpenActualizarModal = (resenaId) => {
        setSelectedResenaId(resenaId);
        setIsActualizarModalOpen(true);
    };

    const obtenerEstadoTexto = (estado) => estado ? "Activo" : "Inactivo";

    const handleVisibleCountChange = (event) => {
        setVisibleCount(Number(event.target.value)); // Actualiza la cantidad visible
      };

    return (
        <div>
            <Nav />
            <div className="flex justify-center items-center mt-10">
                <main className="bg-white w-[100%] max-w-[1600px] mx-2 mt-20 rounded-t-2xl border border-gray-500 shadow-lg">
                    <div>
                        <img className="w-full h-[350px] rounded-t-2xl border-b-2 border-primary" 
                        src={banner_resenas} 
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
                            <option value={5}> 5 reseñas</option>
                            <option value={10}> 10 reseñas</option>
                            <option value={20}> 20 reseñas</option>
                        </select>

                        {/* Barra de búsqueda */}
                        <input
                            type="text"
                            placeholder="Buscar reseña..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="p-2 border border-gray-400 rounded w-[340px]"
                        />
                        </div>
                        
                        <button
                            onClick={() => setIsFilterModalOpen(true)}
                            className="bg-primary text-white px-4 py-2 rounded ml-[370px] hover:bg-blue-950"
                        >
                            Estado
                        </button>

                        <button onClick={() => setIsCrearModalOpen(true)} title="Crear">
                            <BiPlus className="text-xl mr-3" />
                        </button>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 p-6">
                        {isLoading ? (
                            <GestionSkeleton />
                        ) : filteredPublicaciones.length > 0 ? (
                            resenasPaginados.map((resena) => {
                                const isExpanded = isPostExpanded(resena._id);
                                const contenidoMostrado = isExpanded
                                    ? resena.contenido
                                    : `${resena.contenido.substring(0, 100)}...`;
                                const conteoPalabras = resena.contenido.split(" ").length;

                                return (
                                    <div
                                        key={resena._id}
                                        className="flex flex-col w-[45%] bg-white border border-gray-300 p-4 rounded-md shadow-lg"
                                    >
                                        <div className="flex items-center mb-4">
                                            <div className="w-24 h-24 bg-gray-300 rounded-full border border-primary overflow-hidden mr-4">
                                                <Link to={`/profile/${resena.idUsuario._id}`}>
                                                    <img
                                                        className="object-cover w-full h-full"
                                                        src={resena.idUsuario.fotoPerfil || "url_de_imagen_predeterminada"}
                                                        alt="Perfil"
                                                    />
                                                </Link>
                                            </div>
                                            <div>
                                                <h2 className="font-semibold">{resena.idUsuario.nombreCompleto}</h2>
                                                <p>Estado: {obtenerEstadoTexto(resena.estado)}</p>
                                            </div>
                                        </div>

                                        <div className="mb-2 text-gray-700">
                                            {contenidoMostrado}{" "}
                                            <span className="text-sm text-gray-500">({conteoPalabras} palabras)</span>
                                        </div>

                                        <button
                                            className="text-primary flex items-center mt-1"
                                            onClick={() => toggleExpandPost(resena._id)}
                                        >
                                            {isExpanded ? "Ocultar contenido" : "Ver más"}
                                        </button>

                                        <div className="flex justify-center gap-3">
                                            <button
                                                onClick={() => handleOpenActivarModal(resena._id)}
                                                title="Activar"
                                            >
                                                <BiPowerOff className="text-xl" />
                                            </button>
                                            <button
                                                onClick={() => handleOpenDesactiveModal(resena._id)}
                                                title="Inactivar"
                                            >
                                                <BiReset className="text-xl" />
                                            </button>
                                            <button
                                                onClick={() => handleOpenActualizarModal(resena._id)}
                                                title="Actualizar"
                                            >
                                                <BiEdit className="text-xl" />
                                            </button>
                                            <button
                                                onClick={() => handleOpenDeleteModal(resena._id)}
                                                title="Eliminar"
                                            >
                                                <BiTrash className="text-xl" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-center">No hay reseñas disponibles.</p>
                        )}

                        {/* Paginación */}
                        <div className="flex justify-between mb-3  items-center mt-4">
                            <button
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="px-2 py-2 bg-gray-300 ml-[450px] rounded hover:bg-gray-400 disabled:bg-gray-200"
                            >
                            <BiLeftArrow />
                            </button>

                            <span className="mx-2">
                            Página {currentPage} de {totalPages}
                            </span>

                            <button
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="px-2 py-2 bg-gray-300 mr-[450px] rounded hover:bg-gray-400 disabled:bg-gray-200"
                            >
                            <BiRightArrow />
                            </button>
                        </div>
                    </div>

                    {/* Modals */}
                    <ModalActivarReseña
                        isOpen={isActivarModalOpen}
                        onClose={() => setIsActivarModalOpen(false)}
                        resenaId={selectedResenaId}
                        obtenerResenas={obtenerResenas}
                        
                    />
                    <ModalInactivarReseña
                        isOpen={isInactivarModalOpen}
                        onClose={() => setIsInactivarModalOpen(false)}
                        resenaId={selectedResenaId}
                        obtenerResenas={obtenerResenas}
                    />
                    <ModalCrearReseña
                        isOpen={isCrearModalOpen}
                        onClose={() =>{ setIsCrearModalOpen(false),obtenerResenas()}}
                        obtenerResenas={obtenerResenas}
                    />
                    <ModalActualizarReseña
                        isOpen={isActualizarModalOpen}
                        onClose={() => setIsActualizarModalOpen(false)}
                        resenaId={selectedResenaId}
                        obtenerResenas={obtenerResenas}
                    />
                    <ModalEliminarResena
                        isOpen={isEliminarModalOpen}
                        onClose={() => setIsEliminarModalOpen(false)}
                        resenaId={selectedResenaId}
                        obtenerResenas={obtenerResenas}
                    />
                    <FiltrarResenaEstado
                        isOpen={isFilterModalOpen}
                        onClose={() => setIsFilterModalOpen(false)}
                        onFilter={handleFilter}
                        onRestore={handleRestore}
                    />
                </main>
            </div>
        </div>
    );
}

export default GestionResenas;
