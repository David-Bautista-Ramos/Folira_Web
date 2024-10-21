import { useState, useEffect } from "react";
import ModalInactivarUsuario from "../gestionUsuario/ModalInactivarUsuario";
import Nav from "../../components/common/Nav";
import ModalActivarUsuario from "../gestionUsuario/ModalActivarUsuario";
import ModalCrearUsuario from "../gestionUsuario/ModalCrearUsuario";
import ModalActualizarUsuario from "../gestionUsuario/ModalActualizarUsuario";
import {
  BiEdit,
  BiLeftArrow,
  BiPlus,
  BiPowerOff,
  BiReset,
  BiRightArrow,
  BiTrash,
} from "react-icons/bi";
import banner_usuario from "../../assets/img/banners_gestion_usuario.png"; 
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
  const [visibleCount, setVisibleCount] = useState(10); // Estado para el select de cantidad de usuarios visibles
  const [searchTerm, setSearchTerm] = useState(""); // Estado para la búsqueda
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(1); // Número total de páginas

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

  // Filtrado por búsqueda
  useEffect(() => {
    if (searchTerm) {
      // Filtrar los usuarios que coincidan con el término de búsqueda
      const usuariosFiltrados = usuarios.filter(
        (usuario) =>
          usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          usuario.nombreCompleto
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setFilteredUsuarios(usuariosFiltrados);
    } else {
      // Si no hay búsqueda, mostramos todos los usuarios
      setFilteredUsuarios(usuarios);
    }
  }, [searchTerm, usuarios]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Actualiza el término de búsqueda
  };

  // actualizar el total de páginas cada vez que el número de usuarios filtrados o la cantidad visible cambien.
  useEffect(() => {
    const totalUsers = filteredUsuarios.length;
    setTotalPages(Math.ceil(totalUsers / visibleCount));
  }, [filteredUsuarios, visibleCount]);

  // Función para cambiar la página
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const startIndex = (currentPage - 1) * visibleCount;
  const endIndex = startIndex + visibleCount;
  const usuariosPaginados = filteredUsuarios.slice(startIndex, endIndex);

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
              src={banner_usuario}
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
                <option value={5}> 5 usuarios</option>
                <option value={10}> 10 usuarios</option>
                <option value={20}> 20 usuarios</option>
              </select>

              {/* Barra de búsqueda */}
              <input
                type="text"
                placeholder="Buscar usuario..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="p-2 border border-gray-400 rounded w-[340px]"
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

          {/* Cargando */}
          {isLoading ? (
            <GestionSkeleton />
          ) : (
            <div className="flex flex-wrap justify-center gap-6 p-6">
              {usuariosPaginados.map((usuario, index) => (
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
                          Nombre Usuario: {usuario.nombre}
                        </h2>
                      </div>
                      <div className="mb-1">
                        <p>Nombre : {usuario.nombreCompleto}</p>
                      </div>
                      <p>Estado: {obtenerEstadoTexto(usuario.estado)}</p>
                    </div>
                  </div>
                  <div className="flex justify-center gap-3">
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
              ))}
            </div>
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

          {/* Modal para Inactivar Usuario */}
          <ModalInactivarUsuario
            isOpen={isInactivarModalOpen}
            onClose={() => setIsInactivarModalOpen(false)}
            userId={selectedUserId} // Pasar el ID del usuario seleccionado
            obtenerUsuarios={obtenerUsuarios} // Para refrescar la lista de usuarios
          />

          {/* Modal para Activar Usuario */}
          <ModalActivarUsuario
            isOpen={isActivarModalOpen}
            onClose={() => setIsActivarModalOpen(false)}
            userId={selectedUserId} // Pasar el ID del usuario seleccionado
            obtenerUsuarios={obtenerUsuarios} // Para refrescar la lista de usuarios
          />
          <ModalEliminarUsuario
            isOpen={isEliminarModalOpen}
            onClose={() => setIsEliminarModalOpen(false)}
            userId={selectedUserId} // Pasar el ID del usuario seleccionado
            obtenerUsuarios={obtenerUsuarios} // Para refrescar la lista de usuarios
          />
          {/* Modal para Crear Usuario */}
          <ModalCrearUsuario
            isOpen={isCrearModalOpen}
            onClose={() => setIsCrearModalOpen(false)}
            obtenerUsuarios={obtenerUsuarios} // Para refrescar la lista de usuarios
          />

          {/* Modal para Actualizar Usuario */}
          <ModalActualizarUsuario
            isOpen={isActualizarModalOpen}
            onClose={() => {
              setIsActualizarModalOpen(false);
              obtenerUsuarios();
            }}
            userId={selectedUserId} // Pasar el ID del usuario seleccionado
            obtenerUsuarios={obtenerUsuarios} // Para refrescar la lista de usuarios
          />

          {/* Modal para filtrar usuarios */}
          <FiltrarUsuarioEstado
            isOpen={isFiltroModalOpen}
            onClose={() => setIsFiltroModalOpen(false)}
            onFilter={handleFilter}
            onRestore={handleRestore}
          />
        </main>
      </div>
    </div>
  );
}

export default GestionUsuario;
