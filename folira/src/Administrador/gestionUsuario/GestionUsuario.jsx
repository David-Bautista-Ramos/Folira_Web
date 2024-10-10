import { useState, useEffect } from "react";
import ModalInactivarUsuario from "../gestionUsuario/ModalInactivarUsuario";
import Nav from "../../components/common/Nav";
import ModalActivarUsuario from "../gestionUsuario/ModalActivarUsuario";
import ModalCrearUsuario from "../gestionUsuario/ModalCrearUsuario";
import ModalActualizarUsuario from "../gestionUsuario/ModalActualizarUsuario";
import { BiEdit, BiPlus, BiPowerOff, BiReset, BiTrash } from "react-icons/bi";
<<<<<<< HEAD
import banner_usuario from "../../assets/img/gestionUsuario.jpeg";
=======
import banner_usuario from "../../assets/img/gestionUsuario.jpeg"; 
>>>>>>> 39127464ec78322b7c404b7c9ef29be3227fe98a
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
<<<<<<< HEAD
  const [isFiltroModalOpen, setIsFiltroModalOpen] = useState(false);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
=======
  const [isFiltroModalOpen, setIsFiltroModalOpen] = useState(false); 
  const [filteredUsuarios, setFilteredUsuarios] = useState([]); 
>>>>>>> 39127464ec78322b7c404b7c9ef29be3227fe98a
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar la carga

  // Función para obtener usuarios
  const obtenerUsuarios = async () => {
    setIsLoading(true); // Inicia la carga
    try {
<<<<<<< HEAD
      const response = await fetch("/api/users/allUsers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener los usuarios");
      }

=======
      const response = await fetch('/api/users/allUsers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios');
      }
  
>>>>>>> 39127464ec78322b7c404b7c9ef29be3227fe98a
      const data = await response.json();
      if (Array.isArray(data)) {
        setUsuarios(data); // Asigna los usuarios obtenidos al estado
        setFilteredUsuarios(data); // También asigna a usuarios filtrados
      } else {
<<<<<<< HEAD
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
=======
        console.error('La respuesta de usuarios no es un array:', data);
      }
    } catch (error) {
      console.error('Error:', error);
>>>>>>> 39127464ec78322b7c404b7c9ef29be3227fe98a
    } finally {
      setIsLoading(false); // Finaliza la carga
    }
  };

<<<<<<< HEAD
=======
  useEffect(() => {
    obtenerUsuarios(); // Llama a la función cuando el componente se monta
  }, []);

  const handleFilter = async (filter) => {
    console.log(`Filter selected: ${filter}`);
    setIsLoading(true); // Inicia la carga al filtrar

    try {
      let response;
  
      if (filter === "Activo") {
        response = await fetch('/api/users/useract', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else if (filter === "Inactivo") {
        response = await fetch('/api/users/userdes', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else if (filter === "Restaurar") {
        setFilteredUsuarios(usuarios); // Restaurar la lista completa de usuarios
        setIsFiltroModalOpen(false); // Cerrar el modal
        setIsLoading(false); 
        return;
      }
  
      if (!response.ok) {
        throw new Error('Error al filtrar los usuarios');
      }
  
      const data = await response.json();
      
      if (data && Array.isArray(data.user)) {
        setFilteredUsuarios(data.user); // Asignar el array de usuarios filtrados
      } else {
        console.error('La respuesta no contiene un array de usuarios:', data);
      }
    } catch (error) {
      console.error('Error al filtrar usuarios:', error);
    } finally {
      setIsLoading(false); // Finaliza la carga
    }
  
>>>>>>> 39127464ec78322b7c404b7c9ef29be3227fe98a
    setIsFiltroModalOpen(false); // Cerrar el modal después de aplicar el filtro
  };

  const handleRestore = () => {
    setFilteredUsuarios(usuarios); // Restaurar todos los usuarios
    setIsFiltroModalOpen(false); // Cerrar el modal después de restaurar
  };

  const handleOpenDeleteModal = (userId) => {
    setSelectedUserId(userId); // Guardar el ID del usuario seleccionado
    setIsEliminarModalOpen(true); // Abrir el modal
<<<<<<< HEAD
  };
=======
  }
>>>>>>> 39127464ec78322b7c404b7c9ef29be3227fe98a

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
<<<<<<< HEAD
    setIsActualizarModalOpen(true);
=======
    setIsActualizarModalOpen(true); 
>>>>>>> 39127464ec78322b7c404b7c9ef29be3227fe98a
  };

  const obtenerEstadoTexto = (estado) => {
    return estado ? "Activo" : "Inactivo";
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

          <div className="flex justify-end mt-4 mr-[70px]">
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

          {/* Cargando */}
          {isLoading ? (
            <GestionSkeleton />
          ) : (
            <div className="flex flex-wrap justify-center gap-6 p-6">
              {filteredUsuarios.map((usuario, index) => (
<<<<<<< HEAD
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
=======
                <div key={index} className="flex flex-col w-[45%] bg-white border border-primary p-4 rounded-md">
                  <div className="flex items-center mb-4">
                    <div className="w-24 h-24 bg-gray-300 rounded-full border border-primary overflow-hidden mr-4">
                    <img
                          className="object-cover w-full h-full"
                          src={usuario.fotoPerfil || "url_de_la_imagen_usuario"}
                          alt="Usuario"
                        />
>>>>>>> 39127464ec78322b7c404b7c9ef29be3227fe98a
                    </div>
                    <div className="relative">
                      <div className="mb-1">
                        <h2 className="font-semibold">
                          Nombre: {usuario.nombre}
                        </h2>
                      </div>
                      <div className="mb-1">
<<<<<<< HEAD
                        <p>Nombre Usuario: {usuario.nombreCompleto}</p>
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
=======
                        <p>
                          Nombre Usuario: {usuario.nombreCompleto}
                        </p>
                      </div>
                      <p>Estado:  {obtenerEstadoTexto(usuario.estado)}</p>
                    </div>
                  </div>
                  <div className="flex justify-center gap-3">
                    <button onClick={() => handleOpenActivarModal(usuario._id)} title="Activar">
                      <BiPowerOff className="text-xl" />
                    </button>
                    <button onClick={() => handleOpenDesactiveModal(usuario._id)} title="Inactivar">
                      <BiReset className="text-xl" />
                    </button>
                    <button onClick={() => handleOpenActualizarModal(usuario._id)} title="Actualizar">
                      <BiEdit className="text-xl" />
                    </button>
                    <button onClick={()=> handleOpenDeleteModal(usuario._id)} title="Eliminar">
                    <BiTrash className="text-xl" />
                  </button>
>>>>>>> 39127464ec78322b7c404b7c9ef29be3227fe98a
                  </div>
                </div>
              ))}
            </div>
          )}

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
<<<<<<< HEAD
            onClose={() => {
              setIsActualizarModalOpen(false);
              obtenerUsuarios();
            }}
=======
            onClose={() => {setIsActualizarModalOpen(false);obtenerUsuarios()}}
>>>>>>> 39127464ec78322b7c404b7c9ef29be3227fe98a
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
