import { useEffect, useState } from "react";
import ModalInactivarLibro from "./ModalInactivarLibro";
import ModalActivarLibro from "./ModalActivarLibro";
import ModalCrearLibro from "./ModalCrearLibro";
import ModalActualizarLibro from "./ModalActualizarLibro";
import ModalGeneros from "./ModalGenerosLibros";
import ModalFiltroLibros from "../../components/common/ModalFiltroLibros"; // Import the new modal
import Nav from "../../components/common/Nav";
import {
  BiEdit,
  BiLeftArrow,
  BiPlus,
  BiPowerOff,
  BiReset,
  BiRightArrow,
  BiTrash,
} from "react-icons/bi";
import banner_libro from "../../assets/img/banner_gestion_libros.png"; 
import GestionSkeleton from "../../components/skeletons/GestionSkeleton";
import ModalEliminarLibro from "./ModalEliminarLibro";

function GestionLibro() {
  const [libro, setLibros] = useState([]); // Lista completa de libros
  const [selectedLibrosId, setSelectedLibrosId] = useState(null); // ID del libro seleccionado

  const [isInactivarModalOpen, setIsInactivarModalOpen] = useState(false);
  const [isActivarModalOpen, setIsActivarModalOpen] = useState(false);
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isActualizarModalOpen, setIsActualizarModalOpen] = useState(false);
  const [isEliminarModalOpen, setIsEliminarModalOpen] = useState(false);
  const [isGenerosModalOpen, setIsGenerosModalOpen] = useState(false);
  const [isFiltroModalOpen, setIsFiltroModalOpen] = useState(false); // Estado del modal de filtro
  const [filteredLibros, setFilteredLibros] = useState([]); // Libros filtrados
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10); // Estado para el select de cantidad de usuarios visibles
  const [searchTerm, setSearchTerm] = useState(""); // Estado para la búsqueda
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(1); // Número total de páginas

  // Método para obtener todos los libros
  const obtenerLibros = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/libro/getlibros", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener los libros");
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setLibros(data); // Almacena todos los libros
        setFilteredLibros(data); // Inicialmente muestra todos los libros
      } else {
        console.error("La respuesta no es un array:", data);
      }
    } catch (error) {
      console.error("Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    obtenerLibros();
  }, []);

  // Filtrado por búsqueda
  // Filtrado por búsqueda
  useEffect(() => {
    if (searchTerm) {
      // Filtrar los libros que coincidan con el término de búsqueda
      const librosFiltrados = libro.filter(
        (libro) =>
          libro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || // Suponiendo que quieres filtrar por título
          libro.autores.some((autor) =>
            autor.nombre.toLowerCase().includes(searchTerm.toLowerCase())
          ) // Filtra por autor
      );
      setFilteredLibros(librosFiltrados);
    } else {
      // Si no hay búsqueda, mostramos todos los libros
      setFilteredLibros(libro);
    }
  }, [searchTerm, libro]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Actualiza el término de búsqueda
  };

  // actualizar el total de páginas cada vez que el número de usuarios filtrados o la cantidad visible cambien.
  useEffect(() => {
    const totalUsers = filteredLibros.length;
    setTotalPages(Math.ceil(totalUsers / visibleCount));
  }, [filteredLibros, visibleCount]);

  // Función para cambiar la página
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const startIndex = (currentPage - 1) * visibleCount;
  const endIndex = startIndex + visibleCount;
  const librosPaginados = filteredLibros.slice(startIndex, endIndex);

  // Método para manejar el filtrado
  const handleFilter = async (filter) => {
    console.log(`Filter selected: ${filter}`);
    setIsLoading(true); // Inicia la carga al filtrar

    try {
      let response;

      if (filter === "Activo") {
        response = await fetch("/api/libro/getlibrosact", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else if (filter === "Inactivo") {
        response = await fetch("/api/libro/getlibrosdes", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else if (filter === "Restaurar") {
        setFilteredLibros(libro); // Restaurar la lista completa de usuarios
        setIsFiltroModalOpen(false); // Cerrar el modal
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Error al filtrar los libros");
      }

      const data = await response.json();

      if (data && Array.isArray(data.libros)) {
        setFilteredLibros(data.libros); // Asignar el array de usuarios filtrados
      } else {
        console.error("La respuesta no contiene un array de Libros:", data);
      }
    } catch (error) {
      console.error("Error al filtrar libros:", error);
    } finally {
      setIsLoading(false); // Finaliza la carga
    }

    setIsFiltroModalOpen(false); // Cerrar el modal después de aplicar el filtro
  };

  // Restaurar la lista completa de libros
  const handleRestore = () => {
    setFilteredLibros(libro);
    setIsFiltroModalOpen(false); // Cerrar el modal
  };

  // Función para abrir diferentes modales
  const handleOpenActivarModal = (libroId) => {
    setSelectedLibrosId(libroId);
    setIsActivarModalOpen(true);
  };
  const handleOpenDesactiveModal = (libroId) => {
    setSelectedLibrosId(libroId);
    setIsInactivarModalOpen(true);
  };
  const handleOpenActualizarModal = (libroId) => {
    setSelectedLibrosId(libroId);
    setIsActualizarModalOpen(true);
  };

  const handleOpenDeleteModal = (libroId) => {
    setSelectedLibrosId(libroId); // Guardar el ID del usuario seleccionado
    setIsEliminarModalOpen(true); // Abrir el modal
  };

  // Función para convertir estado booleano a texto
  const obtenerEstadoTexto = (estado) => (estado ? "Activo" : "Inactivo");

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
              className="w-full h-[350px] rounded-t-2xl border-b-2 border-primary"
              src={banner_libro}
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
                <option value={5}> 5 libros</option>
                <option value={10}> 10 libros</option>
                <option value={20}> 20 libros</option>
              </select>

              {/* Barra de búsqueda */}
              <input
                type="text"
                placeholder="Buscar libro..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="p-2 border border-gray-400 rounded w-[340px]"
              />
            </div>

            {/* Contenedor para el icono de "más" y el botón "Estado" alineados a la derecha */}
            <div className="flex items-center gap-4">
              <button onClick={() => setIsGenerosModalOpen(true)} className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-950">
                Ver Géneros
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

          <div className="flex flex-wrap justify-center gap-6 p-6">
            {isLoading ? (
              <GestionSkeleton /> // Muestra el skeleton mientras se cargan los datos
            ) : filteredLibros.length > 0 ? (
              librosPaginados.map((libro, index) => (
                <div
                  key={index}
                  className="flex flex-col w-[45%] bg-white border border-primary p-4 rounded-md"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-24 h-36 bg-gray-300 rounded border border-primary overflow-hidden mr-4">
                      <img
                        className="object-cover w-full h-full"
                        src={libro.portada || "url_de_la_imagen_libro"}
                        alt="Libro"
                      />
                    </div>
                    <div className="relative">
                      <h2 className="font-semibold">Título: {libro.titulo}</h2>
                      <p>ISBN: {libro.isbn}</p>
                      <p>Calificación: {libro.calificacion}</p>
                      <p>
                        Autor:{" "}
                        {libro.autores.map((autor) => autor.nombre).join(", ")}
                      </p>
                      <p>Estado: {obtenerEstadoTexto(libro.estado)}</p>
                    </div>
                  </div>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => handleOpenActivarModal(libro._id)}
                      title="Activar"
                    >
                      <BiPowerOff className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleOpenDesactiveModal(libro._id)}
                      title="Inactivar"
                    >
                      <BiReset className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleOpenActualizarModal(libro._id)}
                      title="Actualizar"
                    >
                      <BiEdit className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(libro._id)}
                      title="Eliminar"
                    >
                      <BiTrash className="text-xl" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No hay libros disponibles.</p>
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
          <ModalInactivarLibro
            isOpen={isInactivarModalOpen}
            onClose={() => setIsInactivarModalOpen(false)}
            libroId={selectedLibrosId}
            obetnerLibros={obtenerLibros}
          />
          <ModalActivarLibro
            isOpen={isActivarModalOpen}
            onClose={() => setIsActivarModalOpen(false)}
            libroId={selectedLibrosId}
            obetnerLibros={obtenerLibros}
          />
          <ModalCrearLibro
            isOpen={isCrearModalOpen}
            onClose={() => {
              setIsCrearModalOpen(false);
              obtenerLibros();
            }}
            obetnerLibros={obtenerLibros}
          />
          <ModalActualizarLibro
            isOpen={isActualizarModalOpen}
            onClose={() => {
              setIsActualizarModalOpen(false);
              obtenerLibros();
            }} // Cambia a setIsActualizarModalOpen
            libroId={selectedLibrosId}
            obtenerLibros={obtenerLibros}
          />
          <ModalEliminarLibro
            isOpen={isEliminarModalOpen}
            onClose={() => {
              setIsEliminarModalOpen(false);
              obtenerLibros();
            }} // Cambia a setIsActualizarModalOpen
            libroId={selectedLibrosId}
            obtenerLibros={obtenerLibros}
          />
          <ModalGeneros
            isOpen={isGenerosModalOpen}
            onClose={() => setIsGenerosModalOpen(false)}
          />
          <ModalFiltroLibros
            isOpen={isFiltroModalOpen}
            onClose={() => setIsFiltroModalOpen(false)}
            onFilter={handleFilter} // Pass the filter handler
            onRestore={handleRestore}
          />
        </main>
      </div>
    </div>
  );
}

export default GestionLibro;
