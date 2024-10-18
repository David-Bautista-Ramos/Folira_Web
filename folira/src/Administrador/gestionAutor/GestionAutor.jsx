import { useState, useEffect } from "react";
import ModalInactivarAutor from "../gestionAutor/ModalInactivarAutor";
import Nav from "../../components/common/Nav";
import ModalActivarAutor from "../gestionAutor/ModalActivarAutor";
import ModalCrearAutor from "../gestionAutor/ModalCrearAutor";
import ModalActualizarAutor from "../gestionAutor/ModalActualizarAutor";
import ModalFiltroAutor from "../../components/common/ModalFiltrarAutor"; // Importa el nuevo modal de filtro
import { BiEdit, BiPlus, BiPowerOff, BiReset, BiTrash } from "react-icons/bi";
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
  
  // Nuevas variables de estado
  const [usuariosPorPagina, setUsuariosPorPagina] = useState(5); // Estado para el select
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el input de búsqueda

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

  const handleFilter = async (filter) => {
    console.log(`Filter selected: ${filter}`);
    setIsLoading(true);

    try {
      let response;

      if (filter === "Activo") {
        response = await fetch("/api/autror/getresenasact", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else if (filter === "Inactivo") {
        response = await fetch("/api/autror/getresenasdes", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else if (filter === "Restaurar") {
        setFilteredAutores(autores);
        setIsFiltroModalOpen(false);
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Error al filtrar los Autores");
      }

      const data = await response.json();

      if (data && Array.isArray(data)) {
        setFilteredAutores(data);
      } else {
        console.error("La respuesta no contiene un array de autores:", data);
      }
    } catch (error) {
      console.error("Error al filtrar", error);
    } finally {
      setIsLoading(false);
    }

    setIsFiltroModalOpen(false);
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
  const handleUserCountChange = (e) => {
    setUsuariosPorPagina(Number(e.target.value));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Aquí puedes implementar la lógica para filtrar los autores según el término de búsqueda.
    const filtered = autores.filter(autor =>
      autor.nombre.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredAutores(filtered);
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
          <div className="flex justify-between items-center mt-4 mx-6">
            <div className="flex items-center">
              <select
                value={usuariosPorPagina}
                onChange={handleUserCountChange}
                className="border border-gray-300 rounded px-2 py-1 mr-4"
              >
                <option value={5}>5 usuarios</option>
                <option value={10}>10 usuarios</option>
                <option value={15}>15 usuarios</option>
                <option value={20}>20 usuarios</option>
              </select>

              <input
                type="text"
                placeholder="Buscar autor..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="border border-gray-300 rounded px-2 py-1 mr-4"
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
            </div>
          </div>

          {/* Contenedor para las tarjetas */}
          <div className="flex flex-wrap justify-center gap-6 p-6">
            {isLoading ? (
              <GestionSkeleton /> // Muestra el componente de carga mientras se obtienen los datos
            ) : Array.isArray(filteredAutores) && filteredAutores.length > 0 ? (
              filteredAutores.map((autor, index) => (
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
          </div>

          {/* Modales */}
          <ModalInactivarAutor
            isOpen={isInactivarModalOpen}
            onClose={() => setIsInactivarModalOpen(false)}
            autorId={selectedAutoresId}
            onAutorInactivated={obtenerAutores} // Recargar autores
          />
          <ModalEliminarAutor
            isOpen={isEliminarModalOpen}
            onClose={() => setIsEliminarModalOpen(false)}
            autorId={selectedAutoresId}
            onAutorDeleted={obtenerAutores} // Recargar autores
          />
          <ModalActivarAutor
            isOpen={isActivarModalOpen}
            onClose={() => setIsActivarModalOpen(false)}
            autorId={selectedAutoresId}
            onAutorActivated={obtenerAutores} // Recargar autores
          />
          <ModalCrearAutor
            isOpen={isCrearModalOpen}
            onClose={() => setIsCrearModalOpen(false)}
            onAutorCreated={obtenerAutores} // Recargar autores
          />
          <ModalActualizarAutor
            isOpen={isActualizarModalOpen}
            onClose={() => setIsActualizarModalOpen(false)}
            autorId={selectedAutoresId}
            onAutorUpdated={obtenerAutores} // Recargar autores
          />
          <ModalFiltroAutor
            isOpen={isFiltroModalOpen}
            onClose={() => setIsFiltroModalOpen(false)}
            onFilterSelected={handleFilter} // Pasar la función de filtro
            onRestore={handleRestore} // Pasar la función para restaurar
          />
        </main>
      </div>
    </div>
  );
}

export default GestionAutor;
