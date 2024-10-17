import { useEffect, useState } from "react";
import Nav from "../../components/common/Nav";
import GestionSkeleton from "../../components/skeletons/GestionSkeleton";
import { BiEdit, BiPowerOff, BiReset, BiShow, BiHide,BiTrash } from "react-icons/bi";
import banner_denuncia from "../../assets/img/gestionDenuncia.jpeg";
import ModalFiltroDenuncias from "../../components/common/ModalListarDenuncia";
import { formatMemberSinceDate } from "../../utils/date";
import ModalInactivarDenuncia from "./ModalInactivarDenuncia";
import ModalActivarDenuncia from "./ModalActivarDenuncia";
import ModalActualizarDenuncia from "./ModalActualizarDenuncia";
import ModalEliminarDenuncia from "./ModalEliminarDenuncia";


function GestionDenuncia() {
  const [denuncias, setDenuncias] = useState([]); // Lista completa de denuncias
  const [filteredDenuncias, setFilteredDenuncias] = useState([]); // Denuncias filtradas
  const [isFiltroModalOpen, setIsFiltroModalOpen] = useState(false); // Modal de filtro
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const [expandedPosts, setExpandedPosts] = useState({});
  const [selectedDenunciaId, setSelectedDenunciaId] = useState(null); 
  const [isInactivarModalOpen, setIsInactivarModalOpen] = useState(false);
  const [isActivarModalOpen, setIsActivarModalOpen] = useState(false);
  const [isActualizarModalOpen, setIsActualizarModalOpen] = useState(false);
  const [isEliminarModalOpen, setIsEliminarModalOpen] = useState(false);


  // Obtener todas las denuncias
  const obtenerDenuncias = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/denuncias/denuncia", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Error al obtener las denuncias");

      const data = await response.json();
      if (Array.isArray(data)) {
        setDenuncias(data);
        setFilteredDenuncias(data); // Mostrar todas inicialmente
      } else {
        console.error("La respuesta no es un array:", data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    obtenerDenuncias();
  }, []);

  // Manejo del filtrado
  const handleFilter = async (filter) => {
    console.log(`Filtro seleccionado: ${filter}`);
    setIsLoading(true);

    try {
      let response;
      if (filter === "Activo") {
        response = await fetch("/api/denuncias/denunciaact", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
      } else if (filter === "Inactivo") {
        response = await fetch("/api/denuncias/denunciades", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
      } else if (filter === "Restaurar") {
        setFilteredDenuncias(denuncias);
        setIsFiltroModalOpen(false);
        setIsLoading(false);
        return;
      }

      if (!response.ok) throw new Error("Error al filtrar denuncias");

      const data = await response.json();
      if (Array.isArray(data.denuncias)) {
        setFilteredDenuncias(data.denuncias);
      } else {
        console.error("La respuesta no es un array de denuncias:", data);
      }
    } catch (error) {
      console.error("Error al filtrar denuncias:", error);
    } finally {
      setIsLoading(false);
      setIsFiltroModalOpen(false);
    }
  };

  const obtenerTipoDenuncia = (denuncia) => {
    if (denuncia.idPublicacion && denuncia.idUsuario) return "Denuncia de Publicación";
    if (denuncia.idComentario && denuncia.idUsuario) return "Denuncia de Comentario";
    if (denuncia.idComunidad && denuncia.idUsuario) return "Denuncia de Comunidad";
    if (denuncia.idUsuario) return "Denuncia de Usuario";
    return "Tipo Desconocido";
  };

  const toggleExpandPost = (postId) => {
    setExpandedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };
  

  // Restaurar todas las denuncias
  const handleRestore = () => {
    setFilteredDenuncias(denuncias);
    setIsFiltroModalOpen(false);
  };
  // Función para abrir diferentes modales
  const handleOpenActivarModal = (denunciasId) => {
    setSelectedDenunciaId(denunciasId); 
    setIsActivarModalOpen(true);
  };
  const handleOpenDesactiveModal = (denunciasId) =>{
    setSelectedDenunciaId(denunciasId);
    setIsInactivarModalOpen(true);
  };
  const handleOpenActualizarModal = (denunciasId) => {
    setSelectedDenunciaId(denunciasId); 
    setIsActualizarModalOpen(true);
  };

  const handleOpenDeleteModal = (denunciasId) => {
    setSelectedDenunciaId(denunciasId); // Guardar el ID del usuario seleccionado
    setIsEliminarModalOpen(true); // Abrir el modal
  }
  return (
    <div>
      <Nav />
      <div className="flex justify-center items-center mt-10">
        <main className="bg-white w-[100%] max-w-[1600px] mx-4 mt-20 rounded-t-2xl border border-gray-500 shadow-lg">
          <div>
            <img className="w-full h-[269px] rounded-t-2xl" src={banner_denuncia} alt="banner" />
          </div>

          <div className="flex justify-end mt-4 mr-[70px]">
            <button
              onClick={() => setIsFiltroModalOpen(true)}
              className="bg-primary text-white px-4 py-2 rounded mr-3 hover:bg-blue-950"
            >
              Filtrar
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 p-6">
            {isLoading ? (
              <GestionSkeleton />
            ) : filteredDenuncias.length > 0 ? (
              filteredDenuncias.map((denuncia, index) => {
                const isExpanded = expandedPosts[index];
                return (
                  <div key={index} className="bg-white shadow-lg rounded-lg w-[320px] p-2 mb-4 border">
                    <div className="flex gap-4 mb-2">
                      <img
                        src={denuncia.idUsuario.fotoPerfil}
                        alt="Perfil Denunciante"
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="font-bold">{denuncia.idUsuario.nombreCompleto}</span>
                    </div>
                    <h2 className="font-semibold">Motivo: {obtenerTipoDenuncia(denuncia)}</h2>
                    <p>Fecha: {formatMemberSinceDate(denuncia.updatedAt)}</p>
                    <p>Estado: {denuncia.estado ? "Activo" : "Inactivo"}</p>
                    <p>Motivo: {denuncia.motivo}</p>
                    {denuncia.tipo === "publicacion" && (
                                            <>
                                                <p className="text-gray-700 mb-2">
                                                    Contenido: {isExpanded ? denuncia.denunciado.contenido : denuncia.denunciado.contenido.slice(0, 50) + '...'}
                                                    {denuncia.denunciado.contenido.length > 50 && (
                                                        <button onClick={() => toggleExpandPost(index)} className="inline ml-2 text-gray-600">
                                                            {isExpanded ? <BiHide className="inline" /> : <BiShow className="inline" />}
                                                        </button>
                                                    )}
                                                </p>
                                            </>
                                        )}
                                        {denuncia.tipo === "publicacion" && denuncia.denunciado.fotoPublicacion && (
                                            <img 
                                                src={denuncia.denunciado.fotoPublicacion} 
                                                alt="Publicación" 
                                                className="h-[300px] object-contain rounded-lg border mb-2 border-blue-950 mt-2"
                                            />
                                        )}
                                        {denuncia.tipo === "resena" && (
                                            <p className="text-gray-700 mb-2">Contenido de la reseña: {denuncia.denunciado.contenido}</p>
                                        )}
                    <div className="flex justify-center gap-3 mt-2">
                    <button onClick={() => handleOpenActivarModal(denuncia._id)}>
                          <BiPowerOff className="text-xl" />
                      </button>
                      <button onClick={() => handleOpenDesactiveModal(denuncia._id)}>
                          <BiReset className="text-xl" />
                      </button>
                      <button onClick={() => handleOpenActualizarModal(denuncia._id)}>
                          <BiEdit className="text-xl" />
                      </button>
                      <button
                      onClick={() => handleOpenDeleteModal(denuncia._id)}
                      title="Eliminar"
                    >
                      <BiTrash className="text-xl" />
                    </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No hay denuncias disponibles.</p>
            )}
          </div>

             {/* Modales */}
             <ModalInactivarDenuncia
              isOpen={isInactivarModalOpen}
              onClose={() => setIsInactivarModalOpen(false)}
              denunciasId={selectedDenunciaId}
              obtenerDenuncias={obtenerDenuncias}
            />
            <ModalActivarDenuncia
              isOpen={isActivarModalOpen}
              onClose={() => setIsActivarModalOpen(false)}
              denunciasId={selectedDenunciaId}
              obtenerDenuncias={obtenerDenuncias}
            />
            <ModalActualizarDenuncia
              isOpen={isActualizarModalOpen}
              onClose={() => { setIsActualizarModalOpen(false); obtenerDenuncias(); }} // Cambia a setIsActualizarModalOpen
              denunciasId={selectedDenunciaId}
              obtenerDenuncias={obtenerDenuncias}
            />
             <ModalEliminarDenuncia
                isOpen={isEliminarModalOpen}
                onClose={() => setIsEliminarModalOpen(false)}
                denunciasId={selectedDenunciaId} // Pasar el ID del usuario seleccionado
                obtenerDenuncias={obtenerDenuncias} // Para refrescar la lista de usuarios
              />
            <ModalFiltroDenuncias
              isOpen={isFiltroModalOpen}
              onClose={() => setIsFiltroModalOpen(false)}
              onFilter={handleFilter} // Pass the filter handler
              onRestore = {handleRestore}
            />
        </main>
      </div>
    </div>
  );
}

export default GestionDenuncia;
