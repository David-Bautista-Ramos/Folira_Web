import { useState, useEffect } from "react";
import ModalInactivarUsuario from "../gestionUsuario/ModalInactivarUsuario";
import Nav from "../../components/common/Nav";
import ModalActivarUsuario from "../gestionUsuario/ModalActivarUsuario";
import ModalCrearUsuario from "../gestionUsuario/ModalCrearUsuario";
import ModalActualizarUsuario from "../gestionUsuario/ModalActualizarUsuario";
import { BiEdit, BiPlus, BiPowerOff, BiReset, BiTrash } from "react-icons/bi";
import banner_usuario from "../../assets/img/gestionUsuario.jpeg";
import FiltrarUsuarioEstado from "../../components/common/FiltrarUsuarioEstado";
import GestionSkeleton from "../../components/skeletons/GestionSkeleton"; // Importar el skeleton
import ModalEliminarUsuario from "./ModalEliminarUsuario";

function GestionUsuario() {
  const [usuarios, setUsuarios] = useState([]); // Estado para todos los usuarios
  const [selectedUserId, setSelectedUserId] = useState(null); // ID del usuario seleccionado
  const [isInactivarModalOpen, setIsInactivarModalOpen] = useState(false);
  const [isActivarModalOpen, setIsActivarModalOpen] = useState(false);
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEliminarModalOpen, setIsEliminarModalOpen] = useState(false);
  const [isActualizarModalOpen, setIsActualizarModalOpen] = useState(false);
  const [isFiltroModalOpen, setIsFiltroModalOpen] = useState(false);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar la carga
  const [usuariosPorPagina, setUsuariosPorPagina] = useState(5); // Estado para la cantidad de usuarios a mostrar
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el texto de búsqueda

  // Función para obtener usuarios
  const obtenerUsuarios = async () => {
    setIsLoading(true); // Inicia la carga
    try {
      const response = await fetch("/api/users/allUsers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener los usuarios");
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setUsuarios(data); // Asigna los usuarios obtenidos al estado
        setFilteredUsuarios(data); // También asigna a usuarios filtrados
      } else {
        console.error("La respuesta de usuarios no es un array:", data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false); // Finaliza la carga
    }
  };

  useEffect(() => {
    obtenerUsuarios(); // Llama a la función cuando el componente se monta
  }, []);

  const handleFilter = async (filter) => {
    console.log(`Filter selected: ${filter}`);
    setIsLoading(true); // Inicia la carga al filtrar

    try {
      let response;

      if (filter === "Activo") {
        response = await fetch("/api/users/useract", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else if (filter === "Inactivo") {
        response = await fetch("/api/users/userdes", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else if (filter === "Restaurar") {
        setFilteredUsuarios(usuarios); // Restaurar la lista completa de usuarios
        setIsFiltroModalOpen(false); // Cerrar el modal
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Error al filtrar los usuarios");
      }

      const data = await response.json();

      if (data && Array.isArray(data.user)) {
        setFilteredUsuarios(data.user); // Asignar el array de usuarios filtrados
      } else {
        console.error("La respuesta no contiene un array de usuarios:", data);
      }
    } catch (error) {
      console.error("Error al filtrar usuarios:", error);
    } finally {
      setIsLoading(false); // Finaliza la carga
    }

    setIsFiltroModalOpen(false); // Cerrar el modal después de aplicar el filtro
  };

  const handleRestore = () => {
    setFilteredUsuarios(usuarios); // Restaurar todos los usuarios
    setIsFiltroModalOpen(false); // Cerrar el modal después de restaurar
  };

  const handleOpenDeleteModal = (userId) => {
    setSelectedUserId(userId); // Guardar el ID del usuario seleccionado
    setIsEliminarModalOpen(true); // Abrir el modal
  };

  const handleOpenActivarModal = (userId) => {
    setSelectedUserId(userId); // Guardar el ID del usuario seleccionado
    setIsActivarModalOpen(true); // Abrir el modal
  };

  const handleOpenDesactiveModal = (userId) => {
    setSelectedUserId(userId); // Guardar el ID del usuario seleccionado
    setIsInactivarModalOpen(true); // Abrir el modal
  };

  const handleOpenActualizarModal = (userId) => {
    setSelectedUserId(userId);
    setIsActualizarModalOpen(true);
  };

  const obtenerEstadoTexto = (estado) => {
    return estado ? "Activo" : "Inactivo";
  };

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value.toLowerCase(); // Obtener el texto de búsqueda en minúsculas
    setSearchTerm(searchTerm); // Actualizar el estado del texto de búsqueda

    // Filtrar usuarios en función del texto de búsqueda
    const filtered = usuarios.filter(usuario =>
      usuario.nombre.toLowerCase().includes(searchTerm) || 
      usuario.nombreCompleto.toLowerCase().includes(searchTerm)
    );

    setFilteredUsuarios(filtered); // Actualizar la lista de usuarios filtrados
  };

  const handleUserCountChange = (event) => {
    setUsuariosPorPagina(Number(event.target.value)); // Actualizar el número de usuarios por página
  };

  return (
    <div>
      <Nav />
      <div className="flex justify-center items-center mt-10">
        <main className="bg-white w-[100%] max-w-[1600px] mx-4 mt-20 rounded-t-2xl border border-gray-500 shadow-lg">
          <div>
            <img
              className="w-full h-[269px] rounded-t-2xl"
              src={banner_usuario}
              alt="banner"
            />
          </div>

          <div className="flex justify-between items-center mt-4 mx-6 ml-[68px]">
            <div className="flex items-center"> {/* Contenedor para el select y el input */}
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
                placeholder="Buscar usuario..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="border border-gray-300 rounded px-2 py-1 mr-4"
              />
            </div>

            <div className="flex items-center gap-3 mr-[45px]">
              <button
                onClick={() => setIsFiltroModalOpen(true)}
                className="bg-primary text-white px-4 py-2 rounded ml-[105px] hover:bg-blue-950"
              >
                Filtrar
              </button>

              <button onClick={() => setIsCrearModalOpen(true)} title="Crear">
                <BiPlus className="text-xl" />
              </button>
            </div>
            
          </div>

          {/* Cargando */}
          {isLoading ? (
            <GestionSkeleton />
          ) : (
            <div className="flex flex-wrap justify-center gap-6 p-6">
              {filteredUsuarios.slice(0, usuariosPorPagina).map((usuario, index) => ( // Mostrar solo el número de usuarios especificado
                <div
                  key={index}
                  className="flex flex-col w-[45%] bg-white border border-primary p-4 rounded-md"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-24 h-24 bg-gray-300 rounded-full border border-primary overflow-hidden mr-4">
                      <img
                        className="object-cover w-full h-full"
                        src={usuario.fotoPerfil || "url_de_la_imagen_usuario"}
                        alt="Usuario"
                      />
                    </div>
                    <div className="relative">
                      <div className="mb-1">
                        <h2 className="font-semibold">
                          Nombre: {usuario.nombre}
                        </h2>
                      </div>
                      <div className="mb-1">
                        <p>Nombre Usuario: {usuario.nombreCompleto}</p>
                      </div>
                      <p>Estado: {obtenerEstadoTexto(usuario.estado)}</p>
                    </div>
                  </div>

                  <div className="flex justify-center gap-3">
                    <div className="flex">
                    <button
                      onClick={() => handleOpenActivarModal(usuario._id)}
                      title="Activar"
                    >
                      <BiPowerOff className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleOpenDesactiveModal(usuario._id)}
                      title="Inactivar"
                    >
                      <BiReset className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleOpenActualizarModal(usuario._id)}
                      title="Actualizar"
                    >
                      <BiEdit className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(usuario._id)}
                      title="Eliminar"
                    >
                      <BiTrash className="text-xl" />
                    </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modal para inactivar usuario */}
      <ModalInactivarUsuario
        isOpen={isInactivarModalOpen}
        setIsOpen={setIsInactivarModalOpen}
        userId={selectedUserId}
        onUserInactivate={obtenerUsuarios} // Llama a obtenerUsuarios para actualizar la lista después de inactivar
      />

      {/* Modal para activar usuario */}
      <ModalActivarUsuario
        isOpen={isActivarModalOpen}
        setIsOpen={setIsActivarModalOpen}
        userId={selectedUserId}
        onUserActivate={obtenerUsuarios} // Llama a obtenerUsuarios para actualizar la lista después de activar
      />

      {/* Modal para crear usuario */}
      <ModalCrearUsuario
        isOpen={isCrearModalOpen}
        setIsOpen={setIsCrearModalOpen}
        onUserCreate={obtenerUsuarios} // Llama a obtenerUsuarios para actualizar la lista después de crear
      />

      {/* Modal para actualizar usuario */}
      <ModalActualizarUsuario
        isOpen={isActualizarModalOpen}
        setIsOpen={setIsActualizarModalOpen}
        userId={selectedUserId}
        onUserUpdate={obtenerUsuarios} // Llama a obtenerUsuarios para actualizar la lista después de actualizar
      />

      {/* Modal para eliminar usuario */}
      <ModalEliminarUsuario
        isOpen={isEliminarModalOpen}
        setIsOpen={setIsEliminarModalOpen}
        userId={selectedUserId}
        onUserDelete={obtenerUsuarios} // Llama a obtenerUsuarios para actualizar la lista después de eliminar
      />

      {/* Modal para filtrar usuarios */}
      <FiltrarUsuarioEstado
        isOpen={isFiltroModalOpen}
        setIsOpen={setIsFiltroModalOpen}
        onFilter={handleFilter}
        onRestore={handleRestore} // Para restaurar todos los usuarios
      />
    </div>
  );
}

export default GestionUsuario;
