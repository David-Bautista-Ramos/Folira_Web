import { useState, useEffect } from "react";
import ModalInactivarAutor from "../gestionAutor/ModalInactivarAutor";
import Nav from "../../components/common/Nav";
import ModalActivarAutor from "../gestionAutor/ModalActivarAutor";
import ModalCrearAutor from "../gestionAutor/ModalCrearAutor";
import ModalActualizarAutor from "../gestionAutor/ModalActualizarAutor";
import ModalFiltroAutor from "../../components/common/ModalFiltrarAutor"; // Importa el nuevo modal de filtro
import {
  BiEdit,
  BiLeftArrow,
  BiPlus,
  BiPowerOff,
  BiReset,
  BiRightArrow,
  BiTrash,
} from "react-icons/bi";
import banner_autor from "../../assets/img/gestionAutor.jpeg";
import GestionSkeleton from "../../components/skeletons/GestionSkeleton";
import ModalEliminarAutor from "./ModalEliminarAutor";

function GestionAutor() {
  const [autores, setAutores] = useState([]);
  const [selectedAutoresId, setSelectedAutoresId] = useState(null);
  const [isInactivarModalOpen, setIsInactivarModalOpen] = useState(false);
  const [isEliminarModalOpen, setIsEliminarModalOpen] = useState(false);
  const [isActivarModalOpen, setIsActivarModalOpen] = useState(false);
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isActualizarModalOpen, setIsActualizarModalOpen] = useState(false);
  const [isFiltroModalOpen, setIsFiltroModalOpen] = useState(false);
  const [filteredAutores, setFilteredAutores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10); // Estado para el select de cantidad de usuarios visibles
  const [searchTerm, setSearchTerm] = useState(""); // Estado para la búsqueda
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(1); // Número total de páginas

  const obtenerAutores = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/autror/autores", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener los autores");
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setAutores(data);
        setFilteredAutores(data);
      } else {
        console.error("La respuesta de autores no es un array:", data);
      }
    } catch (error) {
      console.error("Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    obtenerAutores();
  }, []);

  // Filtrado por búsqueda
  // Filtrado por búsqueda
  useEffect(() => {
    if (searchTerm) {
      // Filtrar los autores que coincidan con el término de búsqueda
      const autoresFiltrados = autores.filter(
        (autor) =>
          autor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          autor.seudonimo.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAutores(autoresFiltrados);
    } else {
      // Si no hay búsqueda, mostramos todos los autores
      setFilteredAutores(autores);
    }
  }, [searchTerm, autores]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Actualiza el término de búsqueda
  };

  // actualizar el total de páginas cada vez que el número de usuarios filtrados o la cantidad visible cambien.
  useEffect(() => {
    const totalUsers = filteredAutores.length;
    setTotalPages(Math.ceil(totalUsers / visibleCount));
  }, [filteredAutores, visibleCount]);

  // Función para cambiar la página
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const startIndex = (currentPage - 1) * visibleCount;
  const endIndex = startIndex + visibleCount;
  const autoresPaginados = filteredAutores.slice(startIndex, endIndex);

  const handleFilter = async (filter) => {
    console.log(`Filter selected: ${filter}`);
    setIsLoading(true);
  
    try {
      let url;
      switch (filter) {
        case "Activo":
          url = "/api/autror/autoresact";
          break;
        case "Inactivo":
          url = "/api/autror/autoresdes";
          break;
        case "Restaurar":
          setFilteredAutores(autores);
          setIsFiltroModalOpen(false);
          setIsLoading(false);
          return;
        default:
          console.warn("Filtro no reconocido:", filter);
          setIsLoading(false);
          return;
      }
  
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) throw new Error("Error al filtrar los autores");
  
      const data = await response.json();
      if (Array.isArray(data)) {
        setFilteredAutores(data);
      } else {
        console.error("La respuesta no es un array:", data);
      }
    } catch (error) {
      console.error("Error al filtrar:", error);
    } finally {
      setIsLoading(false);
      setIsFiltroModalOpen(false);
    }
  };
  

  const handleRestore = () => {
    setFilteredAutores(autores);
    setIsFiltroModalOpen(false);
  };

  const handleOpenActivarModal = (autorId) => {
    setSelectedAutoresId(autorId);
    setIsActivarModalOpen(true);
  };
  const handleOpenDeleteModal = (autorId) => {
    setSelectedAutoresId(autorId);
    setIsEliminarModalOpen(true);
  };
  const handleOpenDesactiveModal = (autorId) => {
    setSelectedAutoresId(autorId);
    setIsInactivarModalOpen(true);
  };
  const handleOpenActualizarModal = (autorId) => {
    setSelectedAutoresId(autorId);
    setIsActualizarModalOpen(true);
  };

  const obtenerEstadoTexto = (estado) => {
    return estado ? "Activo" : "Inactivo";
  };

  // Nuevas funciones para manejar los cambios del select y el input
  const handleVisibleCountChange = (event) => {
    setVisibleCount(Number(event.target.value)); // Actualiza la cantidad visible
  };

  return (
    <div>
      <Nav />
      <div className="flex justify-center items-center mt-10">
        <main className="bg-white w-[100%] max-w-[1600px] mx-4 mt-20 rounded-t-2xl border border-gray-500 shadow-lg">
          <div>
            <img
              className="w-full h-[269px] rounded-t-2xl"
              src={banner_autor}
              alt="banner"
            />
          </div>

          {/* Contenedor para el select y el input de búsqueda */}
          <div className="flex justify-between items-center mt-4 mx-[70px]">
            {/* Contenedor para el select y la barra de búsqueda alineados a la izquierda */}
            <div className="flex gap-4">
              {/* Select para elegir cuántos usuarios ver */}
              <select
                value={visibleCount}
                onChange={handleVisibleCountChange}
                className="bg-white border border-gray-400 p-2 rounded"
              >
                <option value={5}> 5 autores</option>
                <option value={10}> 10 autores</option>
                <option value={20}> 20 autores</option>
              </select>

              {/* Barra de búsqueda */}
              <input
                type="text"
                placeholder="Buscar autor..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="p-2 border border-gray-400 rounded w-[340px]"
              />
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setIsFiltroModalOpen(true)}
                className="bg-primary text-white px-4 py-2 rounded mr-3 hover:bg-blue-950"
              >
                Estado
              </button>
              <button onClick={() => setIsCrearModalOpen(true)} title="Crear">
                <BiPlus className="text-xl" />
              </button>
              <button
                onClick={() => setIsFiltroModalOpen(true)}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-950"
              >
                Estado
              </button>
            </div>
          </div>

          {/* Contenedor para las tarjetas */}
          <div className="flex flex-wrap justify-center gap-6 p-6">
            {isLoading ? (
              <GestionSkeleton /> // Muestra el componente de carga mientras se obtienen los datos
            ) : Array.isArray(filteredAutores) && filteredAutores.length > 0 ? (
              autoresPaginados.map((autor, index) => (
                <div
                  key={index}
                  className="flex flex-col w-[45%] bg-white border border-primary p-4 rounded-md"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-24 h-24 bg-gray-300 rounded-full border border-primary overflow-hidden mr-4">
                      <img
                        className="object-cover w-full h-full"
                        src={autor.fotoAutor || "url_de_la_imagen_autor"}
                        alt="Autor"
                      />
                    </div>
                    <div className="relative">
                      <div className="mb-1">
                        <h2 className="font-semibold">
                          Nombre Autor: {autor.nombre}
                        </h2>
                      </div>
                      <div className="mb-1">
                        <p>Seudonímo: {autor.seudonimo}</p>
                      </div>
                      <p>Estado: {obtenerEstadoTexto(autor.estado)}</p>
                    </div>
                  </div>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => handleOpenActivarModal(autor._id)}
                      title="Activar"
                    >
                      <BiPowerOff className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleOpenDesactiveModal(autor._id)}
                      title="Inactivar"
                    >
                      <BiReset className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleOpenActualizarModal(autor._id)}
                      title="Actualizar"
                    >
                      <BiEdit className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(autor._id)}
                      title="Eliminar"
                    >
                      <BiTrash className="text-xl" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No hay autores disponibles.</p>
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
          </div>

          {/* Modales */}
          <ModalInactivarAutor
            isOpen={isInactivarModalOpen}
            onClose={() => setIsInactivarModalOpen(false)}
            autorId={selectedAutoresId}
            obtenerAutores={obtenerAutores} // Recargar autores
          />
          <ModalEliminarAutor
            isOpen={isEliminarModalOpen}
            onClose={() => setIsEliminarModalOpen(false)}
            autorId={selectedAutoresId}
            obtenerAutores={obtenerAutores} // Recargar autores
          />
          <ModalActivarAutor
            isOpen={isActivarModalOpen}
            onClose={() => setIsActivarModalOpen(false)}
            autorId={selectedAutoresId}
            obtenerAutores={obtenerAutores} // Recargar autores
          />
          <ModalCrearAutor
            isOpen={isCrearModalOpen}
            onClose={() => setIsCrearModalOpen(false)}
            obtenerAutores={obtenerAutores} // Recargar autores
          />
          <ModalActualizarAutor
            isOpen={isActualizarModalOpen}
            onClose={() => setIsActualizarModalOpen(false)}
            autorId={selectedAutoresId}
            obtenerAutores={obtenerAutores} // Recargar autores
          />
          <ModalFiltroAutor
            isOpen={isFiltroModalOpen}
            onClose={() => setIsFiltroModalOpen(false)}
            onFilter ={handleFilter} // Pasar la función de filtro
            onRestore={handleRestore} // Pasar la función para restaurar
          />
        </main>
      </div>
    </div>
  );
}

export default GestionAutor;
