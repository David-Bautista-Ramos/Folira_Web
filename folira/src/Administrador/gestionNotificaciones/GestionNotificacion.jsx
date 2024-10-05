import { useState } from "react";
import {
  BiHeart, BiPowerOff, BiReset, BiPlus, BiEdit, BiHide, BiShow,
} from "react-icons/bi";
import Nav from "../../components/common/Nav";
import ModalLikes from "./ModalLikesNotificacion";
import ModalActivarNotificacion from "./ModalActivarNotificacion";
import ModalActualizarNotificacion from "./ModalActualizarNotificacion";
import ModalCrearNotificacion from "./ModalCrearNotificacion";
import ModalInactivarNotificacion from "./ModalInactivarNotificacion";
import banner_notificacion from "../../assets/img/gestionNotificacion.jpeg"; 
import ModalFiltrarEstado from '../../components/common/FiltrarNotificacionEstado'; // Importamos el nuevo modal

const publicaciones = [
  {
    _id: "1",
    contenido:
      "¡Estoy disfrutando de 'Cien años de soledad' de Gabriel García Márquez! Es una obra maestra de la literatura.",
    fotoPublicacion: "https://example.com/cien-anos-soledad.jpg",
    postOwner: {
      _id: "1",
      nombreCompleto: "Juan Pérez",
      nombre: "juanp",
      fotoPerfil: "https://example.com/perfil-juan.jpg",
    },
    likes: [
      {
        user: {
          nombreCompleto: "Tata",
          fotoPerfil: "https://example.com/perfil-tata.jpg",
        },
      },
      {
        user: {
          nombreCompleto: "Luis",
          fotoPerfil: "https://example.com/perfil-luis.jpg",
        },
      },
    ],
    comentarios: [],
    estado: "Activo"
  },
  {
    _id: "2",
    contenido:
      "Recién terminé de leer '1984' de George Orwell. ¡Qué obra tan impactante! ¡Qué obra tan impactante! ¡Qué obra tan impactante! ¡Qué obra tan impactante!",
    fotoPublicacion: "", // Publicación sin imagen
    postOwner: {
      _id: "2",
      nombreCompleto: "Maria García",
      nombre: "mariag",
      fotoPerfil: "https://example.com/perfil-maria.jpg",
    },
    likes: [
      {
        user: {
          nombreCompleto: "Carlos",
          fotoPerfil: "https://example.com/perfil-carlos.jpg",
        },
      },
      {
        user: {
          nombreCompleto: "Ana",
          fotoPerfil: "https://example.com/perfil-ana.jpg",
        },
      },
    ],
    comentarios: [],
    estado: "Inactivo"
  },
  {
    _id: "3", // Cambié el ID para que sea único
    contenido:
      "¡Estoy disfrutando de 'Cien años de soledad' de Gabriel García Márquez! Es una obra maestra de la literatura.",
    fotoPublicacion: "https://example.com/cien-anos-soledad.jpg",
    postOwner: {
      _id: "1",
      nombreCompleto: "Juan Pérez",
      nombre: "juanp",
      fotoPerfil: "https://example.com/perfil-juan.jpg",
    },
    likes: [
      {
        user: {
          nombreCompleto: "Tata",
          fotoPerfil: "https://example.com/perfil-tata.jpg",
        },
      },
      {
        user: {
          nombreCompleto: "Luis",
          fotoPerfil: "https://example.com/perfil-luis.jpg",
        },
      },
    ],
    comentarios: [],
    estado: "Inactivo"
  },
  {
    _id: "6", // Cambié el ID para que sea único
    contenido:
      "Recién terminé de leer '1984' de George Orwell. ¡Qué obra tan impactante! ¡Qué obra tan impactante! ¡Qué obra tan impactante! ¡Qué obra tan impactante!",
    fotoPublicacion: "", // Publicación sin imagen
    postOwner: {
      _id: "2",
      nombreCompleto: "Maria García",
      nombre: "mariag",
      fotoPerfil: "https://example.com/perfil-maria.jpg",
    },
    likes: [
      {
        user: {
          nombreCompleto: "Carlos",
          fotoPerfil: "https://example.com/perfil-carlos.jpg",
        },
      },
      {
        user: {
          nombreCompleto: "Ana",
          fotoPerfil: "https://example.com/perfil-ana.jpg",
        },
      },
    ],
    comentarios: [],
    estado: "Inactivo"
  },
  {
      _id: "5", // Cambié el ID para que sea único
      contenido:
        "¡Estoy disfrutando de 'Cien años de soledad' de Gabriel García Márquez! Es una obra maestra de la literatura.",
      fotoPublicacion: "https://example.com/cien-anos-soledad.jpg",
      postOwner: {
        _id: "1",
        nombreCompleto: "Juan Pérez",
        nombre: "juanp",
        fotoPerfil: "https://example.com/perfil-juan.jpg",
      },
      likes: [
        {
          user: {
            nombreCompleto: "Tata",
            fotoPerfil: "https://example.com/perfil-tata.jpg",
          },
        },
        {
          user: {
            nombreCompleto: "Luis",
            fotoPerfil: "https://example.com/perfil-luis.jpg",
          },
        },
      ],
      comentarios: [],
      estado : "Inactivo"
    },
    {
      _id: "4", // Cambié el ID para que sea único
      contenido:
        "¡Estoy disfrutando de 'Cien años de soledad' de Gabriel García Márquez! Es una obra maestra de la literatura.",
      fotoPublicacion: "https://example.com/cien-anos-soledad.jpg",
      postOwner: {
        _id: "1",
        nombreCompleto: "Juan Pérez",
        nombre: "juanp",
        fotoPerfil: "https://example.com/perfil-juan.jpg",
      },
      likes: [
        {
          user: {
            nombreCompleto: "Tata",
            fotoPerfil: "https://example.com/perfil-tata.jpg",
          },
        },
        {
          user: {
            nombreCompleto: "Luis",
            fotoPerfil: "https://example.com/perfil-luis.jpg",
          },
        },
      ],
      comentarios: [],
      estado: "Inactivo"
    },
];

function GestionNotificacion() {
  const [publicacionSeleccionada, setPublicacionSeleccionada] = useState(null);
  const [isActivarModalOpen, setIsActivarModalOpen] = useState(false);
  const [isInactivarModalOpen, setIsInactivarModalOpen] = useState(false);
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isActualizarModalOpen, setIsActualizarModalOpen] = useState(false);
  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false); // Nuevo estado para modal de filtro
  const [filteredState, setFilteredState] = useState("Todos"); // Estado para el filtro de estado

  const [expandedPosts, setExpandedPosts] = useState({});

  const toggleExpandPost = (postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const isPostExpanded = (postId) => expandedPosts[postId] || false;

  const handleActualizarClick = (libro) => {
    setPublicacionSeleccionada(libro);
    setIsActualizarModalOpen(true);
  };

  const handleUpdatePublicacion = (nuevaPublicacion) => {
    console.log("Publicación actualizada:", nuevaPublicacion);
    setIsActualizarModalOpen(false);
  };

  // Filtrar publicaciones por estado
  const filteredPublicaciones = publicaciones.filter((libro) =>
    filteredState === "Todos" || libro.estado === filteredState
  );

  // Lógica para abrir el modal de filtro
  const handleFilterClick = () => {
    setIsFilterModalOpen(true);
  };

  // Lógica para aplicar el filtro
  const handleFilterSelect = (estado) => {
    setFilteredState(estado);
    setIsFilterModalOpen(false); // Cerrar el modal después de seleccionar un estado
  };

  // Lógica para restaurar la vista completa de publicaciones
  const handleRestore = () => {
    setFilteredState("Todos");
    setIsFilterModalOpen(false);  // Cerrar el modal
  };

  

  return (
    <div>
      <Nav />
      <div className="flex justify-center items-center mt-10">
        <main className="bg-white w-[100%] max-w-[1600px] mx-2 mt-20 rounded-t-2xl border border-gray-500 shadow-lg">
          <div>
            <img className="w-full h-64 rounded-t-2xl" src={banner_notificacion} alt="banner" />
          </div>

          <div className="flex justify-end mt-4 mr-[70px]">
            <button
              onClick={handleFilterClick}
              className="bg-primary text-white px-4 py-2 rounded mr-3 hover:bg-blue-950"
            >
              Estado
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-10 p-2">
            {filteredPublicaciones.map((libro) => {
              const isExpanded = isPostExpanded(libro._id);
              const contenidoMostrado = isExpanded
                ? libro.contenido
                : `${libro.contenido.substring(0, 100)}...`;

              return (
                <div key={libro._id} className="bg-white shadow-lg rounded-lg w-[320px] p-2 mb-4 border border-gray-300 flex flex-col">
                  {/* Sección del usuario */}
                  <div className="flex gap-4 mb-2">
                    <img
                      src={libro.postOwner.fotoPerfil}
                      alt="Perfil"
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="font-bold">{libro.postOwner.nombreCompleto}</span>
                  </div>

                  {/* Texto de la publicación (Descripción) */}
                  <p className="text-gray-700 mb-2">{contenidoMostrado}</p>

                  {/* Botón "Ver más" / "Ver menos" */}
                  <button
                    className="text-blue-500 mt-1 flex items-center gap-1"
                    onClick={() => toggleExpandPost(libro._id)}
                  >
                    {isExpanded ? (
                      <>
                        <BiHide className="text-xl" />
                        <span>Ver menos</span>
                      </>
                    ) : (
                      <>
                        <BiShow className="text-xl" />
                        <span>Ver más</span>
                      </>
                    )}
                  </button>

                  {/* Imagen de la publicación */}
                  {libro.fotoPublicacion && (
                    <img
                      src={libro.fotoPublicacion}
                      className="h-[300px] object-contain rounded-lg border mb-2 border-blue-950 mt-2"
                      alt="Post"
                    />
                  )}

                  {/* Sección de íconos y botones */}
                  <div className="mt-auto flex justify-between items-center">
                  <button
                            onClick={() => {
                            setPublicacionSeleccionada(libro);
                            setIsLikesModalOpen(true);
                            }}
                            title="Me gusta"
                        >
                            <BiHeart className="text-xl" />
                        </button>
                        {/* Mostrar la cantidad de likes */}
                        <span className="text-gray-700 mr-[100px]">
                            {libro.likes.length} {libro.likes.length === 1 ? 'like' : 'likes'}
                        </span>

                    <div className="flex items-center gap-3">
                      <button onClick={() => setIsActivarModalOpen(true)} title="Activar">
                        <BiPowerOff className="text-xl" />
                      </button>
                      <button onClick={() => setIsInactivarModalOpen(true)} title="Inactivar">
                        <BiReset className="text-xl" />
                      </button>
                      <button onClick={() => setIsCrearModalOpen(true)} title="Crear">
                        <BiPlus className="text-xl" />
                      </button>
                      <button onClick={() => handleActualizarClick(libro)} title="Actualizar">
                        <BiEdit className="text-xl" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modales para gestionar notificaciones */}
          <ModalActivarNotificacion
            isOpen={isActivarModalOpen}
            onClose={() => setIsActivarModalOpen(false)}
          />
          <ModalInactivarNotificacion
            isOpen={isInactivarModalOpen}
            onClose={() => setIsInactivarModalOpen(false)}
          />
          <ModalCrearNotificacion
            isOpen={isCrearModalOpen}
            onClose={() => setIsCrearModalOpen(false)}
          />
          <ModalActualizarNotificacion
            isOpen={isActualizarModalOpen}
            onClose={() => setIsActualizarModalOpen(false)}
            publicacion={publicacionSeleccionada}
            onUpdate={handleUpdatePublicacion}
          />
           <ModalLikes
            isOpen={isLikesModalOpen}
            onClose={() => setIsLikesModalOpen(false)}
            likes={publicacionSeleccionada ? publicacionSeleccionada.likes : []}
          />

          {/* Modal de filtro por estado */}
          <ModalFiltrarEstado
            isOpen={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
            onFilter={handleFilterSelect}
            onRestore={handleRestore}
          />
        </main>
      </div>
    </div>
  );
}

export default GestionNotificacion;
