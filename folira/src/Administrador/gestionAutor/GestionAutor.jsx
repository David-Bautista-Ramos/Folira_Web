import { useState, useEffect } from "react";
import ModalInactivarAutor from "../gestionAutor/ModalInactivarAutor";
import Nav from "../../components/common/Nav";
import ModalActivarAutor from "../gestionAutor/ModalActivarAutor";
import ModalCrearAutor from "../gestionAutor/ModalCrearAutor";
import ModalActualizarAutor from "../gestionAutor/ModalActualizarAutor";
import ModalFiltroAutor from "../../components/common/ModalFiltrarAutor"; // Importa el nuevo modal de filtro
<<<<<<< HEAD
import { BiEdit, BiPlus, BiPowerOff, BiReset, BiTrash } from "react-icons/bi";
import banner_autor from "../../assets/img/gestionAutor.jpeg";
import GestionSkeleton from "../../components/skeletons/GestionSkeleton";
import ModalEliminarAutor from "./ModalEliminarAutor";
=======
import { BiEdit, BiPlus, BiPowerOff, BiReset } from "react-icons/bi";
import banner_autor from "../../assets/img/gestionAutor.jpeg"; 
import GestionSkeleton from '../../components/skeletons/GestionSkeleton';
>>>>>>> 39127464ec78322b7c404b7c9ef29be3227fe98a

function GestionAutor() {
  const [autores, setAutores] = useState([]); // Corregido: useState en vez de useSatate
  const [selectedAutoresId, setSelectedAutoresId] = useState(null);
<<<<<<< HEAD

=======
>>>>>>> 39127464ec78322b7c404b7c9ef29be3227fe98a
  const [isInactivarModalOpen, setIsInactivarModalOpen] = useState(false);
  const [isEliminarModalOpen, setIsEliminarModalOpen] = useState(false);
  const [isActivarModalOpen, setIsActivarModalOpen] = useState(false);
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isActualizarModalOpen, setIsActualizarModalOpen] = useState(false);
  const [isFiltroModalOpen, setIsFiltroModalOpen] = useState(false); // Nuevo estado para el modal de filtro
  const [filteredAutores, setFilteredAutores] = useState([]); // Inicializado correctamente
<<<<<<< HEAD
  
=======
>>>>>>> 39127464ec78322b7c404b7c9ef29be3227fe98a
  const [isLoading, setIsLoading] = useState(true); // Corregido: useState en vez de useSatate

  const obtenerAutores = async () => {
    setIsLoading(true);
    try {
<<<<<<< HEAD
      const response = await fetch("/api/autror/autores", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener los autores");
=======
      const response = await fetch('/api/autror/autores', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener los autores');
>>>>>>> 39127464ec78322b7c404b7c9ef29be3227fe98a
      }

      const data = await response.json();

      // Asegúrate de que data sea un array
      if (Array.isArray(data)) {
        setAutores(data); // Asigna los autores obtenidos al estado
        setFilteredAutores(data); // También asigna a autores filtrados
      } else {
<<<<<<< HEAD
        console.error("La respuesta de autores no es un array:", data);
      }
    } catch (error) {
      console.error("Error", error);
=======
        console.error('La respuesta de autores no es un array:', data);
      }
    } catch (error) {
      console.error('Error', error);
>>>>>>> 39127464ec78322b7c404b7c9ef29be3227fe98a
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    obtenerAutores();
  }, []);

<<<<<<< HEAD
  const handleFilter = async (filter) => {
    // Añadido async
=======
  const handleFilter = async (filter) => { // Añadido async
>>>>>>> 39127464ec78322b7c404b7c9ef29be3227fe98a
    console.log(`Filter selected: ${filter}`);
    setIsLoading(true);

    try {
      let response;

      if (filter === "Activo") {
        // Obtener autores activos
<<<<<<< HEAD
        response = await fetch("/api/autror/autoresact", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
=======
        response = await fetch('/api/autror/autoresact', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
>>>>>>> 39127464ec78322b7c404b7c9ef29be3227fe98a
          },
        });
      } else if (filter === "Inactivo") {
        // Obtener autores inactivos
<<<<<<< HEAD
        response = await fetch("/api/autror/autoresdes", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
=======
        response = await fetch('/api/autror/autoresdes', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
>>>>>>> 39127464ec78322b7c404b7c9ef29be3227fe98a
          },
        });
      } else if (filter === "Restaurar") {
        setFilteredAutores(autores); // Restaurar la lista completa de autores
        setIsFiltroModalOpen(false); // Cerrar el modal
        setIsLoading(false); // Finaliza la carga
        return; // Salir de la función
      }

      if (!response.ok) {
<<<<<<< HEAD
        throw new Error("Error al filtrar los Autores");
=======
        throw new Error('Error al filtrar los Autores');
>>>>>>> 39127464ec78322b7c404b7c9ef29be3227fe98a
      }

      const data = await response.json();

      if (data && Array.isArray(data)) {
        setFilteredAutores(data); // Asignar el array de autores filtrados
      } else {
<<<<<<< HEAD
        console.error("La respuesta no contiene un array de autores:", data);
      }
=======
        console.error('La respuesta no contiene un array de autores:', data);
      }

>>>>>>> 39127464ec78322b7c404b7c9ef29be3227fe98a
    } catch (error) {
      console.error("Error al filtrar", error);
    } finally {
      setIsLoading(false); // Asegúrate de finalizar la carga
    }
  };

  const handleRestore = () => {
    setFilteredAutores(autores); // Restaurar todos los autores
    setIsFiltroModalOpen(false); // Cerrar el modal después de restaurar
  };
<<<<<<< HEAD
  
=======
>>>>>>> 39127464ec78322b7c404b7c9ef29be3227fe98a
  const handleOpenActivarModal = (autorId) => {
    setSelectedAutoresId(autorId); // Guardar el ID del usuario seleccionado
    setIsActivarModalOpen(true); // Abrir el modal
  };
<<<<<<< HEAD
  const handleOpenDeleteModal = (autorId) => {
    setSelectedAutoresId(autorId); // Guardar el ID del usuario seleccionado
    setIsEliminarModalOpen(true); // Abrir el modal
  };
=======
>>>>>>> 39127464ec78322b7c404b7c9ef29be3227fe98a
  const handleOpenDesactiveModal = (autorId) => {
    setSelectedAutoresId(autorId); // Guardar el ID del usuario seleccionado
    setIsInactivarModalOpen(true); // Abrir el modal
  };
  const handleOpenActualizarModal = (autorId) => {
    setSelectedAutoresId(autorId);
<<<<<<< HEAD
    setIsActualizarModalOpen(true);
  };

  // Función para convertir estado booleano a texto
  const obtenerEstadoTexto = (estado) => {
    return estado ? "Activo" : "Inactivo";
  };
=======
    setIsActualizarModalOpen(true); 
  };

    // Función para convertir estado booleano a texto
    const obtenerEstadoTexto = (estado) => {
      return estado ? "Activo" : "Inactivo";
    };
>>>>>>> 39127464ec78322b7c404b7c9ef29be3227fe98a

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

          <div className="flex justify-end mt-4 mr-[70px]">
            <button
              onClick={() => setIsFiltroModalOpen(true)}
              className="bg-primary text-white px-4 py-2 rounded mr-3 hover:bg-blue-950"
            >
              Estado
            </button>
            <button onClick={() => setIsCrearModalOpen(true)} title="Crear">
<<<<<<< HEAD
              <BiPlus className="text-xl" />
=======
                    <BiPlus className="text-xl" />
>>>>>>> 39127464ec78322b7c404b7c9ef29be3227fe98a
            </button>
          </div>

          {/* Contenedor para las tarjetas */}
          <div className="flex flex-wrap justify-center gap-6 p-6">
<<<<<<< HEAD
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
                        src={autor.fotoAutor || "url_de_la_imagen_autor"} // Cambiado a autor
                        alt="Autor"
                      />
                    </div>
                    <div className="relative">
                      <div className="mb-1">
                        <h2 className="font-semibold">
                          Nombre Autor: {autor.nombre}
                        </h2>{" "}
                        {/* Cambiado a autor */}
                      </div>
                      <div className="mb-1">
                        <p>Seudonímo: {autor.seudonimo}</p>
                      </div>
                      <p>Estado: {obtenerEstadoTexto(autor.estado)}</p>{" "}
                      {/* Cambiado a autor */}
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
              <p>No hay autores disponibles.</p> // Mensaje para cuando no hay datos
            )}
          </div>

=======
              {isLoading ? (
                <GestionSkeleton /> // Muestra el componente de carga mientras se obtienen los datos
              ) : (
                Array.isArray(filteredAutores) && filteredAutores.length > 0 ? (
                  filteredAutores.map((autor, index) => (
                    <div key={index} className="flex flex-col w-[45%] bg-white border border-primary p-4 rounded-md">
                      <div className="flex items-center mb-4">
                        <div className="w-24 h-24 bg-gray-300 rounded-full border border-primary overflow-hidden mr-4">
                          <img
                            className="object-cover w-full h-full"
                            src={autor.fotoAutor || "url_de_la_imagen_autor"} // Cambiado a autor
                            alt="Autor"
                          />
                        </div>
                        <div className="relative">
                          <div className="mb-1">
                            <h2 className="font-semibold">Nombre Autor: {autor.nombre}</h2> {/* Cambiado a autor */}
                          </div>
                          <div className="mb-1">
                                  <p>Seudonímo: {autor.seudonimo}</p>
                          </div>
                          <p>Estado: {obtenerEstadoTexto(autor.estado)}</p> {/* Cambiado a autor */}
                        </div>
                      </div>
                      <div className="flex justify-center gap-3">
                        <button onClick={() => handleOpenActivarModal(autor._id)} title="Activar">
                          <BiPowerOff className="text-xl" />
                        </button>
                        <button onClick={() => handleOpenDesactiveModal(autor._id)} title="Inactivar">
                          <BiReset className="text-xl" />
                        </button>
                        <button onClick={() => handleOpenActualizarModal(autor._id)} title="Actualizar">
                          <BiEdit className="text-xl" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No hay autores disponibles.</p> // Mensaje para cuando no hay datos
                )
              )}
            </div>


>>>>>>> 39127464ec78322b7c404b7c9ef29be3227fe98a
          {/* Modal para Inactivar Autor */}
          <ModalInactivarAutor
            isOpen={isInactivarModalOpen}
            onClose={() => setIsInactivarModalOpen(false)}
            autorId={selectedAutoresId}
            obtenerAutores={obtenerAutores}
<<<<<<< HEAD
          />
          <ModalEliminarAutor
            isOpen={isEliminarModalOpen}
            onClose={() => setIsEliminarModalOpen(false)}
            autorId={selectedAutoresId} // Pasar el ID del usuario seleccionado
            obtenerAutores={obtenerAutores} // Para refrescar la lista de usuarios
=======
>>>>>>> 39127464ec78322b7c404b7c9ef29be3227fe98a
          />

          {/* Modal para Activar Autor */}
          <ModalActivarAutor
            isOpen={isActivarModalOpen}
            onClose={() => setIsActivarModalOpen(false)}
            autorId={selectedAutoresId}
            obtenerAutores={obtenerAutores}
          />

          {/* Modal para Crear Autor */}
          <ModalCrearAutor
            isOpen={isCrearModalOpen}
<<<<<<< HEAD
            onClose={() => {
              setIsCrearModalOpen(false);
              obtenerAutores();
            }}
=======
            onClose={() => {setIsCrearModalOpen(false); obtenerAutores() }}
>>>>>>> 39127464ec78322b7c404b7c9ef29be3227fe98a
            obtenerAutores={obtenerAutores}
          />

          {/* Modal para Actualizar Autor */}
          <ModalActualizarAutor
            isOpen={isActualizarModalOpen}
<<<<<<< HEAD
            onClose={() => {
              setIsActualizarModalOpen(false);
              obtenerAutores();
            }}
=======
            onClose={() => {setIsActualizarModalOpen(false); obtenerAutores()}}
>>>>>>> 39127464ec78322b7c404b7c9ef29be3227fe98a
            autorId={selectedAutoresId}
            obtenerAutores={obtenerAutores}
          />

          {/* Modal para Filtrar Autor */}
          <ModalFiltroAutor
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

export default GestionAutor;
