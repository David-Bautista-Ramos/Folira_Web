import { useEffect, useState } from "react";
import ModalInactivarComunidad from "./ModalInactivarComunidad";
import Nav from "../../components/common/Nav";

import banner_comunidad from "../../assets/img/banner_gestion_comunidades.png"; 
import ModalActivarComunidad from "./ModalActivarComunidad";
import ModalCrearComunidad from "./ModalCrearComunidad";
import ModalEliminarComunidad from "./ModalEliminarComunidad";
import ModalActualizarComunidad from "./ModalActualizarComunidad";
import ModalFiltroComunidad from "../../components/common/ModalFiltrarComunidad"; // Importa el nuevo modal
import {
  BiEdit,
  BiLeftArrow,
  BiPlus,
  BiPowerOff,
  BiReset,
  BiRightArrow,
  BiTrash,
} from "react-icons/bi";
import GestionSkeleton from "../../components/skeletons/GestionSkeleton";

function GestionComunidad() {
  const [comunidad, setComunidad] = useState([]); // Corregido: useState en vez de useSatate
  const [selectedComunidadId, setSelectedComunidadId] = useState(null);

  const [isInactivarModalOpen, setIsInactivarModalOpen] = useState(false);
  const [isActivarModalOpen, setIsActivarModalOpen] = useState(false);
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isActualizarModalOpen, setIsActualizarModalOpen] = useState(false);
  const [isEliminarModalOpen, setIsEliminarModalOpen] = useState(false);

  const [isFiltroModalOpen, setIsFiltroModalOpen] = useState(false); // Nuevo estado para el modal de filtro
  const [filteredComunidad, setFilteredComunidad] = useState([]); // Nuevo estado para usuarios filtrados

  const [isLoading, setIsLoading] = useState(true); // Corregido: useState en vez de useSatate
  const [visibleCount, setVisibleCount] = useState(6); // Estado para el select de cantidad de usuarios visibles
  const [searchTerm, setSearchTerm] = useState(""); // Estado para la búsqueda
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(1); // Número total de páginas

  const obtenerComunidades = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/comunidad/comunidad", {
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
        setComunidad(data); // Asigna los autores obtenidos al estado
        setFilteredComunidad(data); // Inicializa los comunidades filtrados con el mismo valor
      } else {
        console.error("La respuesta de las comunidades no es un array:", data);
      }
    } catch (error) {
      console.error("Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    obtenerComunidades();
  }, []);

  // Filtrado por búsqueda
  useEffect(() => {
    if (searchTerm) {
      // Filtrar los usuarios que coincidan con el término de búsqueda
      const usuariosFiltrados = comunidad.filter((usuario) => {
        const nombre = usuario.nombre?.toLowerCase() || ""; // Maneja posibles undefined
        const nombreCompleto = usuario.nombreCompleto?.toLowerCase() || ""; // Maneja posibles undefined
        return (
          nombre.includes(searchTerm.toLowerCase()) ||
          nombreCompleto.includes(searchTerm.toLowerCase())
        );
      });
      setFilteredComunidad(usuariosFiltrados);
    } else {
      // Si no hay búsqueda, mostramos todos los usuarios
      setFilteredComunidad(comunidad);
    }
  }, [searchTerm, comunidad]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Actualiza el término de búsqueda
  };

  // actualizar el total de páginas cada vez que el número de usuarios filtrados o la cantidad visible cambien.
  useEffect(() => {
    const totalUsers = filteredComunidad.length;
    setTotalPages(Math.ceil(totalUsers / visibleCount));
  }, [filteredComunidad, visibleCount]);

  // Función para cambiar la página
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const startIndex = (currentPage - 1) * visibleCount;
  const endIndex = startIndex + visibleCount;
  const comunidadPaginados = filteredComunidad.slice(startIndex, endIndex);

  const handleFilter = async (filter) => {
    // Añadido async
    console.log(`Filter selected: ${filter}`);
    setIsLoading(true);

    try {
      let response;

      if (filter === "Activo") {
        // Obtener autores activos
        response = await fetch("/api/comunidad/comunidadact", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else if (filter === "Inactivo") {
        // Obtener autores inactivos
        response = await fetch("/api/comunidad/comunidaddes", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else if (filter === "Restaurar") {
        setFilteredComunidad(comunidad); // Restaurar la lista completa de autores
        setIsFiltroModalOpen(false); // Cerrar el modal
        setIsLoading(false); // Finaliza la carga
        return; // Salir de la función
      }

      if (!response.ok) {
        throw new Error("Error al filtrar los Autores");
      }

      const data = await response.json();

      if (data && Array.isArray(data)) {
        setFilteredComunidad(data); // Asignar el array de autores filtrados
      } else {
        console.error(
          "La respuesta no contiene un array de comunidades:",
          data
        );
      }
    } catch (error) {
      console.error("Error al filtrar", error);
    } finally {
      setIsLoading(false); // Asegúrate de finalizar la carga
    }
    setIsFiltroModalOpen(false); // Cerrar el modal
  };

  const handleRestore = () => {
    setFilteredComunidad(comunidad); // Restaurar todas las comunidades
    setIsFiltroModalOpen(false); // Cerrar el modal después de restaurar
  };

  const handleOpenActivarModal = (comunidadId) => {
    setSelectedComunidadId(comunidadId); // Guardar el ID del usuario seleccionado
    setIsActivarModalOpen(true); // Abrir el modal
  };
  const handleOpenDeleteModal = (comunidadId) => {
    setSelectedComunidadId(comunidadId); // Guardar el ID del usuario seleccionado
    setIsEliminarModalOpen(true); // Abrir el modal
  };
  const handleOpenDesactiveModal = (comunidadId) => {
    setSelectedComunidadId(comunidadId); // Guardar el ID del usuario seleccionado
    setIsInactivarModalOpen(true); // Abrir el modal
  };
  const handleOpenActualizarModal = (comunidadId) => {
    setSelectedComunidadId(comunidadId);
    setIsActualizarModalOpen(true);
  };

  // Función para convertir estado booleano a texto
  const obtenerEstadoTexto = (estado) => {
    return estado ? "Activo" : "Inactivo";
  };

  const handleVisibleCountChange = (event) => {
    setVisibleCount(Number(event.target.value)); // Actualiza la cantidad visible
  };

  return (
    <div>
      <Nav />
      <div>
        <main className="bg-white w-[100%] max-w-[1600px] mx-4 mt-20 rounded-t-2xl border border-gray-500 shadow-lg">
          <div>
            <img
              className="w-full h-[350px] rounded-t-2xl border-b-2 border-primary"
              src={banner_comunidad}
              alt="banner"
            />
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
                <option value={6}> 6 comunidades</option>
                <option value={12}> 12 comunidades</option>
                <option value={20}> 20 comunidades</option>
              </select>

              {/* Barra de búsqueda */}
              <input
                type="text"
                placeholder="Buscar comunidad..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="p-2 border border-gray-400 rounded w-[320px]"
              />
            </div>

            {/* Contenedor para el icono de "más" y el botón "Estado" alineados a la derecha */}
            <div className="flex items-center gap-4">
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

          <div className="flex flex-wrap justify-center gap-6 p-6">
            {isLoading ? (
              <GestionSkeleton /> // Muestra el componente de carga mientras se obtienen los datos
            ) : Array.isArray(filteredComunidad) &&
              filteredComunidad.length > 0 ? (
              comunidadPaginados.map((comunidad, index) => (
                <div
                  key={index}
                  className="flex flex-col w-[45%] bg-white border border-primary p-4 rounded-md"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-24 h-24 bg-gray-300 rounded-full border border-primary overflow-hidden mr-4">
                      <img
                        className="object-cover w-full h-full"
                        src={
                          comunidad.fotoComunidad || "url_de_la_imagen_usuario"
                        } // Usa la foto del usuario
                        alt="Usuario"
                      />
                    </div>
                    <div className="relative">
                      <div className="mb-1">
                        <h2 className="font-semibold">
                          Nombre: {comunidad.nombre}
                        </h2>
                      </div>
                      <p>Estado: {obtenerEstadoTexto(comunidad.estado)}</p>{" "}
                    </div>
                  </div>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => handleOpenActivarModal(comunidad._id)} // Usa la función para activar
                      title="Activar"
                    >
                      <BiPowerOff className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleOpenDesactiveModal(comunidad._id)} // Usa la función para inactivar
                      title="Inactivar"
                    >
                      <BiReset className="text-xl" />
                    </button>

                    <button
                      onClick={() => handleOpenActualizarModal(comunidad._id)} // Usa la función para actualizar
                      title="Actualizar"
                    >
                      <BiEdit className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(comunidad._id)} // Usa la función para eliminar
                      title="Eliminar"
                    >
                      <BiTrash className="text-xl" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No hay comunidades disponibles.</p> // Mensaje para cuando no hay datos
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

          <ModalInactivarComunidad
            isOpen={isInactivarModalOpen}
            onClose={() => setIsInactivarModalOpen(false)}
            comunidadId={selectedComunidadId}
            obtenerComunidades={obtenerComunidades}
          />
          <ModalActivarComunidad
            isOpen={isActivarModalOpen}
            onClose={() => setIsActivarModalOpen(false)}
            comunidadId={selectedComunidadId}
            obtenerComunidades={obtenerComunidades}
          />
          <ModalCrearComunidad
            isOpen={isCrearModalOpen}
            onClose={() => setIsCrearModalOpen(false)}
            comunidadId={selectedComunidadId}
            obtenerComunidades={obtenerComunidades}
          />

          <ModalEliminarComunidad
            isOpen={isEliminarModalOpen}
            onClose={() => setIsEliminarModalOpen(false)}
            comunidadId={selectedComunidadId} // Pasar el ID del usuario seleccionado
            obtenerComunidades={obtenerComunidades} // Para refrescar la lista de usuarios
          />

          {/* Modal para Actualizar Autor */}
          <ModalActualizarComunidad
            isOpen={isActualizarModalOpen}
            onClose={() => {
              setIsActualizarModalOpen(false);
              obtenerComunidades();
            }}
            comunidadId={selectedComunidadId}
            obtenerComunidades={obtenerComunidades}
          />

          <ModalFiltroComunidad
            isOpen={isFiltroModalOpen}
            onClose={() => setIsFiltroModalOpen(false)}
            onFilter={handleFilter} // Pasa el manejador de filtro
            onRestore={handleRestore} // Pasa la función de restaurar
          />
        </main>
      </div>
    </div>
  );
}

export default GestionComunidad;
