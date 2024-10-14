import { useEffect, useState } from "react";
import ModalInactivarComunidad from "./ModalInactivarComunidad";
import Nav from "../../components/common/Nav";

import banner_comunidad from "../../assets/img/gestionComunidad.jpeg";
import ModalActivarComunidad from "./ModalActivarComunidad";
import ModalCrearComunidad from "./ModalCrearComunidad";
import ModalEliminarComunidad from "./ModalEliminarComunidad";
import ModalActualizarComunidad from "./ModalActualizarComunidad";
import ModalFiltroComunidad from "../../components/common/ModalFiltrarComunidad"; // Importa el nuevo modal
import { BiEdit, BiPlus, BiPowerOff, BiReset, BiTrash } from "react-icons/bi";
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

  return (
    <div>
      <Nav />
      <div>
        <main className="bg-white w-[100%] max-w-[1600px] mx-4 mt-20 rounded-t-2xl border border-gray-500 shadow-lg">
          <div>
            <img
              className="w-full h-[269px] rounded-t-2xl"
              src={banner_comunidad}
              alt="banner"
            />
          </div>

          <div className="flex justify-end mt-4 mr-[70px]">
            <button onClick={() => setIsCrearModalOpen(true)} title="Crear">
              <BiPlus className="text-xl mr-3" />
            </button>
            <button
              onClick={() => setIsFiltroModalOpen(true)}
              className="bg-primary text-white px-4 py-2 rounded mr-3 hover:bg-blue-950"
            >
              Estado
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 p-6">
            {isLoading ? (
              <GestionSkeleton /> // Muestra el componente de carga mientras se obtienen los datos
            ) : Array.isArray(filteredComunidad) &&
              filteredComunidad.length > 0 ? (
              filteredComunidad.map((comunidad, index) => (
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
                      x
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
            obtenerAutores={obtenerComunidades}
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
