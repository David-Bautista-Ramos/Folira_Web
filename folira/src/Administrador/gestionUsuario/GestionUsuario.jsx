import { useState, useEffect } from "react";
import Nav from "../../components/common/Nav";
import ModalActivarUsuario from "../gestionUsuario/ModalActivarUsuario";
import ModalInactivarUsuario from "../gestionUsuario/ModalInactivarUsuario"
import ModalCrearUsuario from "../gestionUsuario/ModalCrearUsuario";
import ModalActualizarUsuario from "../gestionUsuario/ModalActualizarUsuario";
import { BiEdit, BiPlus, BiPowerOff, BiReset } from "react-icons/bi";
import banner_usua from "../../assets/img/admi_banners_usua.jpeg";
import FiltrarUsuarioEstado from "../../components/common/FiltrarUsuarioEstado";
import GestionSkeleton from "../../components/skeletons/GestionSkeleton";

function GestionUsuario() {
  const [usuarios, setUsuarios] = useState([]); // Estado para todos los usuarios
  const [selectedUserId, setSelectedUserId] = useState(null); // ID del usuario seleccionado
  const [isInactivarModalOpen, setIsInactivarModalOpen] = useState(false);
  const [isActivarModalOpen, setIsActivarModalOpen] = useState(false);
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isActualizarModalOpen, setIsActualizarModalOpen] = useState(false);
  const [isFiltroModalOpen, setIsFiltroModalOpen] = useState(false); 
  const [filteredUsuarios, setFilteredUsuarios] = useState([]); 
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar la carga

  // Función para obtener usuarios
  const obtenerUsuarios = async () => {
    setIsLoading(true); // Inicia la carga
    try {
      const response = await fetch('/api/users/allUsers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios');
      }
  
      const data = await response.json();
      
      // Asegúrate de que data sea un array
      if (Array.isArray(data)) {
        setUsuarios(data); // Asigna los usuarios obtenidos al estado
        setFilteredUsuarios(data); // También asigna a usuarios filtrados
      } else {
        console.error('La respuesta de usuarios no es un array:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    }finally {
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
        // Obtener usuarios activos
        response = await fetch('/api/users/useract', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else if (filter === "Inactivo") {
        // Obtener usuarios inactivos
        response = await fetch('/api/users/userdes', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else if (filter === "Restaurar") {
        setFilteredUsuarios(usuarios); // Restaurar la lista completa de usuarios
        setIsFiltroModalOpen(false); // Cerrar el modal
        setIsLoading(false); // Inicia la carga al filtrar
        return;
      }
  
      if (!response.ok) {
        throw new Error('Error al filtrar los usuarios');
      }
  
      const data = await response.json();
      
      // Ajusta el código para acceder al array de usuarios
      if (data && Array.isArray(data.user)) {
        setFilteredUsuarios(data.user); // Asignar el array de usuarios filtrados
      } else {
        console.error('La respuesta no contiene un array de usuarios:', data);
      }
    } catch (error) {
      console.error('Error al filtrar usuarios:', error);
    }finally {
      setIsLoading(false); // Finaliza la carga
    }
  
    setIsFiltroModalOpen(false); // Cerrar el modal después de aplicar el filtro
  };
  
  useEffect(() => {
    obtenerUsuarios(); // Llama a la función cuando el componente se monta
  }, []);

  const handleRestore = () => {
    setFilteredUsuarios(usuarios); // Restaurar todos los usuarios
    setIsFiltroModalOpen(false); // Cerrar el modal después de restaurar
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

  // Función para convertir estado booleano a texto
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
              src={banner_usua}
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

          {/* Contenedor para las tarjetas */}
          <div className="flex flex-wrap justify-center gap-6 p-6">
          {isLoading ? (
              <GestionSkeleton /> // Muestra el componente de carga mientras se obtienen los datos
            ) : (
              Array.isArray(filteredUsuarios) && filteredUsuarios.length > 0 ? (
                filteredUsuarios.map((usuario, index) => (
                  <div key={index} className="flex flex-col w-[45%] bg-white border border-primary p-4 rounded-md">
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
                          <h2 className="font-semibold">Nombre Usuario: {usuario.nombre}</h2>
                        </div>
                        <div className="mb-1">
                          <p>Nombre: {usuario.nombreCompleto}</p>
                        </div>
                        <p>Estado: {obtenerEstadoTexto(usuario.estado)}</p>
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
                    </div>
                  </div>
                ))
              ) : (
                <p>No hay usuarios disponibles.</p>
              )
            )}
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

          {/* Modal para Crear Usuario */}
          <ModalCrearUsuario
            isOpen={isCrearModalOpen}
            onClose={() => {setIsCrearModalOpen(false);obtenerUsuarios()}}
            obtenerUsuarios={obtenerUsuarios} // Para refrescar la lista de usuarios
          />

          {/* Modal para Actualizar Usuario */}
          <ModalActualizarUsuario
            isOpen={isActualizarModalOpen}
            onClose={() => {setIsActualizarModalOpen(false);obtenerUsuarios()}}
            userId={selectedUserId} // Pasa el ID del usuario seleccionado
            obtenerUsuarios={obtenerUsuarios} // Para refrescar la lista de usuarios después de actualizar
          />

          <FiltrarUsuarioEstado
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

export default GestionUsuario;
