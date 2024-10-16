import { useEffect, useState } from "react";
import ModalActivarDenuncia from "./ModalActivarDenuncia";
import ModalActualizarDenuncia from "./ModalActualizarDenuncia";
import ModalInactivarDenuncia from "./ModalInactivarDenuncia";
import banner_denuncia from "../../assets/img/gestionDenuncia.jpeg";
import { BiEdit, BiPlus, BiPowerOff, BiReset } from "react-icons/bi";
import Nav from "../../components/common/Nav";
import ModalFiltroEstadoDenuncias from "../../components/common/ModalListarDenuncia";
import ModalCrearDenuncia from "./ModalCrearDenuncia";

function GestionDenuncias() {
  const [denuncias, setDenuncias] = useState([]); // Correctly set state for complaints
  const [selectedDenuncia, setSelectedDenuncia] = useState(null); // ID of the selected complaint
  const [isInactivarModalOpen, setIsInactivarModalOpen] = useState(false);
  const [isActivarModalOpen, setIsActivarModalOpen] = useState(false);
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isActualizarModalOpen, setIsActualizarModalOpen] = useState(false);
  const [isFiltroModalOpen, setIsFiltroModalOpen] = useState(false);
  const [filteredDenucias, setfilteredDenucias] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // State to control loading

  // Function to fetch complaints
  const obtenerDenuncias = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/denuncias/denuncia", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener las denuncias");
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setDenuncias(data); // Assign fetched complaints to state
      } else {
        console.error("La respuesta de las denuncias no es un array:", data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch complaints when component mounts
  useEffect(() => {
    obtenerDenuncias();
  }, []);

  const handleOpenInactivarModal = (denunciaId) => {
    setSelectedDenuncia(denunciaId); // Store the selected complaint ID
    setIsInactivarModalOpen(true); // Open the deactivate modal
  };

  const handleOpenActivarModal = (denunciaId) => {
    setSelectedDenuncia(denunciaId); // Store the selected complaint ID
    setIsActivarModalOpen(true); // Open the activate modal
  };

  const handleOpenActualizarModal = (denunciaId) => {
    setSelectedDenuncia(denunciaId); // Store the selected complaint ID
    setIsActualizarModalOpen(true); // Open the update modal
  };

  // Assuming handleFilter and handleRestore functions are defined for filtering
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
        setfilteredDenucias(denuncias); // Restaurar la lista completa de usuarios
        setIsFiltroModalOpen(false); // Cerrar el modal
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Error al filtrar los usuarios");
      }

      const data = await response.json();

      if (data && Array.isArray(data.user)) {
        setfilteredDenucias(data.user); // Asignar el array de usuarios filtrados
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
    // Implement restore logic here
  };

  const obtenerEstadoTexto = (estado) => {
    return estado ? "Activo" : "Inactivo";
  };
  const determinarTipoDenuncia = (denuncia) => {
    if (denuncia.idUsuario && !denuncia.idResena && !denuncia.idPublicacion) {
      return "Denuncia de usuario";
    } else if (denuncia.idResena && !denuncia.idUsuario && !denuncia.idPublicacion) {
      return "Denuncia de reseña";
    } else if (denuncia.idPublicacion && !denuncia.idUsuario && !denuncia.idResena) {
      return "Denuncia de publicación";
    } else {
      return "Denuncia general"; // O puedes devolver un mensaje más específico si es necesario
    }
  };
  return (
    <div>
      <Nav />
      <div className="flex justify-center items-center mt-10">
        <main className="bg-white w-full max-w-4xl mx-4 mt-20 rounded-t-2xl border border-gray-500 shadow-lg">
          <div>
            <img
              className="w-full h-[269px] rounded-t-2xl"
              src={banner_denuncia}
              alt="banner"
            />
          </div>

          <div className="flex justify-end mt-4 mr-4">
            <button onClick={() => setIsCrearModalOpen(true)} title="Crear">
              <BiPlus className="text-xl" />
            </button>
            <button
              onClick={() => setIsFiltroModalOpen(true)}
              className="bg-primary text-white px-4 py-2 rounded mr-3 hover:bg-blue-950"
            >
              Filtrar
            </button>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="p-6 text-center">Cargando...</div>
          ) : (
                    <div className="flex flex-wrap justify-center gap-6 p-6">
             {filteredDenucias.map((denuncia) => (
    <div
      key={denuncia._id}
      className="flex flex-col w-[45%] bg-white border border-primary p-4 rounded-md"
    >
      <div className="flex items-center mb-4">
        <div className="w-24 h-24 bg-gray-300 rounded-full border border-primary overflow-hidden mr-4">
          <img
            className="object-cover w-full h-full"
            src={"url_de_la_imagen_denuncia"} // Cambia esto por la URL real de la imagen
            alt="Denuncia"
          />
        </div>
        <div className="relative">
          <h2 className="font-semibold">
            Título: {denuncia.titulo}
            <p>Descripción: {denuncia.motivo}</p>
            <p>Tipo: {determinarTipoDenuncia(denuncia)}</p> {/* Corregido aquí */}
            <p>Estado: {obtenerEstadoTexto(denuncia.estado)}</p>
          </h2>
        </div>
      </div>
      <div className="flex justify-center gap-3">
        <button
          onClick={() => handleOpenActivarModal(denuncia._id)}
          title="Activar"
        >
          <BiPowerOff className="text-xl" />
        </button>
        <button
          onClick={() => handleOpenInactivarModal(denuncia._id)}
          title="Inactivar"
        >
          <BiReset className="text-xl" />
        </button>
        <button
          onClick={() => handleOpenActualizarModal(denuncia._id)}
          title="Actualizar"
        >
          <BiEdit className="text-xl" />
        </button>
      </div>
    </div>
  ))}
            </div>
          )}

          {/* Modals for actions */}
          <ModalInactivarDenuncia
            isOpen={isInactivarModalOpen}
            onClose={() => setIsInactivarModalOpen(false)}
            denunciaId={selectedDenuncia}
            obtenerDenuncias={obtenerDenuncias} // Refresh the list
          />
          <ModalCrearDenuncia
            isOpen={isCrearModalOpen}
            onClose={() => setIsCrearModalOpen(false)}
            obtenerUsuarios={obtenerDenuncias} // Para refrescar la lista de usuarios
          />
          <ModalActivarDenuncia
            isOpen={isActivarModalOpen}
            onClose={() => setIsActivarModalOpen(false)}
            denunciaId={selectedDenuncia}
            obtenerDenuncias={obtenerDenuncias} // Refresh the list
          />

          <ModalActualizarDenuncia
            isOpen={isActualizarModalOpen}
            onClose={() => setIsActualizarModalOpen(false)}
            denunciaId={selectedDenuncia}
            obtenerDenuncias={obtenerDenuncias} // Refresh the list
          />

          {/* Modal for filtering complaints */}
          <ModalFiltroEstadoDenuncias
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

export default GestionDenuncias;
