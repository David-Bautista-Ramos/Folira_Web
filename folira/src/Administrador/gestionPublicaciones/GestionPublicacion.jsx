import { useState } from "react";
import { FaRegComment } from "react-icons/fa";
import { BiShow, BiEdit, BiPlus, BiPowerOff, BiReset } from "react-icons/bi";
import { Link } from "react-router-dom";
import Nav from "../../components/common/Nav";
import banner_publicaciones from "../../assets/img/gestionPublicaciones.jpeg"; 
import ComentariosModal from "./ComentarioPublicidad";
import ModalActivarPublicacion from "./ModalActivarPublicacion";
import ModalInactivarPublicacion from "./ModalInactivarPublicacion";
import ModalCrearPublicacion from "./ModalCrearPublicacion";
import ModalActualizarPublicacion from "./ModalActualizarPublicacion";
import ModalFiltroPublicaciones from "../../components/common/FiltroPublicacion";

const publicaciones = [
    {
        _id: "1",
        contenido: "¡Estoy disfrutando de 'Cien años de soledad' de Gabriel García Márquez! Es una obra maestra de la literatura.",
        fotoPublicacion: "https://example.com/cien-anos-soledad.jpg",
        postOwner: {
            _id: "1",
            nombreCompleto: "Juan Pérez",
            nombre: "juanp",
            fotoPerfil: "https://example.com/perfil-juan.jpg"
        },
        comentarios: [
            {
                _id: "c1",
                user: {
                    nombreCompleto: "María López",
                    nombre: "mari",
                    fotoPerfil: "https://example.com/perfil-maria.jpg"
                },
                text: "¡Es uno de mis favoritos! La forma en que García Márquez narra la historia es increíble."
            },
            {
                _id: "c2",
                user: {
                    nombreCompleto: "Pedro González",
                    nombre: "pedro",
                    fotoPerfil: "https://example.com/perfil-pedro.jpg"
                },
                text: "Lo leí hace años y me dejó una profunda impresión."
            }
        ],
        estado: "Activo"
    },
    {
        _id: "2",
        contenido: "Recomiendo 'El túnel' de Ernesto Sabato. Es una lectura intensa y profunda.",
        fotoPublicacion: "https://example.com/el-tunel.jpg",
        postOwner: {
            _id: "2",
            nombreCompleto: "Ana Martínez",
            nombre: "ana_martinez",
            fotoPerfil: "https://example.com/perfil-ana.jpg"
        },
        comentarios: [
            {
                _id: "c3",
                user: {
                    nombreCompleto: "Luis Pérez",
                    nombre: "luis",
                    fotoPerfil: "https://example.com/perfil-luis.jpg"
                },
                text: "¡Qué gran recomendación! Lo leí hace poco y me encantó."
            }
        ],
        estado: "Activo"
    },
    {
        _id: "3",
        contenido: "Acabo de terminar '1984' de George Orwell. Una novela muy poderosa y relevante.",
        fotoPublicacion: "https://example.com/1984.jpg",
        postOwner: {
            _id: "3",
            nombreCompleto: "Carla Gómez",
            nombre: "carlag",
            fotoPerfil: "https://example.com/perfil-carla.jpg"
        },
        comentarios: [],
        estado: "Activo"
    },
    {
        _id: "4",
        contenido: "No puedo dejar de recomendar 'El amor en los tiempos del cólera'. Es una hermosa historia de amor. Espero que todos estén teniendo un gran día.",
        fotoPublicacion: "https://example.com/amores.jpg",
        postOwner: {
            _id: "4",
            nombreCompleto: "Miguel Rodríguez",
            nombre: "miguelito",
            fotoPerfil: "https://example.com/perfil-miguel.jpg"
        },
        comentarios: [
            {
                _id: "c4",
                user: {
                    nombreCompleto: "Laura Fernández",
                    nombre: "laura",
                    fotoPerfil: "https://example.com/perfil-laura.jpg"
                },
                text: "Es una historia tan conmovedora, me encanta."
            }
        ],
        estado: "Activo"
    },
    {
        _id: "5",
        contenido: "Esta es una publicación solo de texto, sin imágenes. Espero que todos estén teniendo un gran día.",
        postOwner: {
            _id: "5",
            nombreCompleto: "Sofía Castillo",
            nombre: "sofia_c",
            fotoPerfil: "https://example.com/perfil-sofia.jpg"
        },
        comentarios: [],
        estado: "Inactivo" // Publicación inactiva
    },
    {
        _id: "6",
        contenido: "Esta es una publicación inactiva para mostrar el estado.",
        postOwner: {
            _id: "6",
            nombreCompleto: "Carlos Pérez",
            nombre: "carlosp",
            fotoPerfil: "https://example.com/perfil-carlos.jpg"
        },
        comentarios: [],
        estado: "Inactivo" // Publicación inactiva
    }
];

function GestionLibro() {
    const [isComentariosModalOpen, setIsComentariosModalOpen] = useState(false);
    const [comentarios, setComentarios] = useState([]);
    const [expandedPost] = useState(null);
    const [publicacionSeleccionada, setPublicacionSeleccionada] = useState(null); 
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filteredState, setFilteredState] = useState("Todos"); // Estado para el filtro de estado

    // Estados para los modales
    const [isActivarModalOpen, setIsActivarModalOpen] = useState(false);
    const [isInactivarModalOpen, setIsInactivarModalOpen] = useState(false);
    const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
    const [isActualizarModalOpen, setIsActualizarModalOpen] = useState(false);

    const handleShowComentarios = (libroComentarios) => {
        setComentarios(libroComentarios);
        setIsComentariosModalOpen(true);
    };

    // const toggleExpandPost = (postId) => {
    //     setExpandedPost(expandedPost === postId ? null : postId);
    // };

    const handleActualizarClick = (libro) => {
        setPublicacionSeleccionada(libro); // Selecciona el libro
        setIsActualizarModalOpen(true);
    };

    const [expandedPosts, setExpandedPosts] = useState({});

    const toggleExpandPost = (postId) => {
        setExpandedPosts((prev) => ({
        ...prev,
        [postId]: !prev[postId],
        }));
    };

    const isPostExpanded = (postId) => expandedPosts[postId] || false;


    const handleUpdatePublicacion = (nuevaPublicacion) => {
        // Lógica para actualizar la publicación
        // Actualizar los datos de la publicación con nuevaPublicacion
        console.log("Publicación actualizada:", nuevaPublicacion);
        setIsActualizarModalOpen(false); // Cierra el modal después de actualizar
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
                        <img className="w-full h-[269px] rounded-t-2xl" src={banner_publicaciones} alt="banner" />
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
                                <div className="flex gap-4 mb-2">
                                    <div className="avatar">
                                        <Link to={`/profile/${libro.postOwner._id}`} className="w-8 rounded-full overflow-hidden">
                                            <img src={libro.postOwner.fotoPerfil} alt="Profile" />
                                        </Link>
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <div className="flex gap-2 items-center">
                                            <Link to={`/profile/${libro.postOwner._id}`} className="font-bold">
                                                {libro.postOwner.nombreCompleto}
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Contenido de la publicación (texto e imagen) */}
                                <div className="flex flex-col flex-1">
                                    <span className="text-left max-w-full overflow-hidden text-ellipsis whitespace-normal break-all">
                                        {expandedPost === libro._id
                                            ? libro.contenido
                                            : libro.contenido.length > 50
                                            ? `${libro.contenido.substring(0, 50)}...`
                                            : libro.contenido}
                                    </span>

                                    {/* Texto de la publicación (Descripción) */}
                                    <p className="text-gray-700 mb-2">{contenidoMostrado}</p>

                                    <button onClick={() => toggleExpandPost(libro._id)} className="flex items-center">
                                        <BiShow className="text-xl" />
                                        <span className="ml-1">{expandedPost === libro._id ? "Ocultar" : "Ver más"}</span>
                                    </button>
                                    
                                    {/* Aquí la imagen se coloca si existe */}
                                    {libro.fotoPublicacion && (
                                        <img
                                            src={libro.fotoPublicacion}
                                            className="h-[300px] object-contain rounded-lg border border-blue-950 mt-2 "
                                            alt="Post"
                                        />
                                    )}
                                </div>

                                {/* Contenedor para íconos de comentarios y acciones en la parte inferior */}
                                <div className="flex justify-between items-center mt-2">
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1 items-center cursor-pointer" onClick={() => handleShowComentarios(libro.comentarios)}>
                                            <FaRegComment className="text-slate-500 hover:text-primary" />
                                            <span className="text-sm">{libro.comentarios.length} Comentarios</span>
                                        </div>
                                    </div>
                                    {/* Íconos de acción a la derecha */}
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

                                {/* Mostrar el modal de comentarios */}
                                {expandedPost === libro._id && (
                                    <div className="mt-2">
                                        <ComentariosModal
                                            isOpen={isComentariosModalOpen && comentarios.length > 0}
                                            onClose={() => {
                                                setIsComentariosModalOpen(false);
                                                setComentarios([]);
                                            }}
                                            comentarios={comentarios}
                                        />
                                    </div>
                                )}
                            </div>
                          );
                    })}

                    </div>



                    {/* Modales para activar, inactivar, crear y actualizar publicaciones */}
                    <ModalActivarPublicacion 
                        isOpen={isActivarModalOpen} 
                        onClose={() => setIsActivarModalOpen(false)}
                    />

                    <ModalInactivarPublicacion 
                        isOpen={isInactivarModalOpen} 
                        onClose={() => setIsInactivarModalOpen(false)} 
                    />

                    <ModalCrearPublicacion 
                        isOpen={isCrearModalOpen} 
                        onClose={() => setIsCrearModalOpen(false)} 
                    />

                    <ModalActualizarPublicacion
                        isOpen={isActualizarModalOpen}
                        onClose={() => setIsActualizarModalOpen(false)}
                        onUpdate={handleUpdatePublicacion}
                        publicacion={publicacionSeleccionada}
                    />

                    <ModalFiltroPublicaciones
                        isOpen={isFilterModalOpen}
                        onClose={() => setIsFilterModalOpen(false)}
                        onFilter={handleFilterSelect}
                        onRestore={handleRestore}
                    />
                </main>
            </div>

            {/* Solo el modal de comentarios */}
            <ComentariosModal
                isOpen={isComentariosModalOpen}
                onClose={() => {
                    setIsComentariosModalOpen(false);
                    setComentarios([]);
                }}
                comentarios={comentarios}
            />
        </div>
    );
}

export default GestionLibro;
