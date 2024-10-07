import { useState } from "react";
import { BiEdit, BiPlus, BiPowerOff, BiReset, BiShow,  } from "react-icons/bi"; // Importa los íconos de ver más y ver menos
import { Link } from "react-router-dom";
import Nav from "../../components/common/Nav";
import banner_usua from "../../assets/img/admi_banners_usua.jpeg";
import ModalActivarReseña from "./ModalActivarReseña";
import ModalInactivarReseña from "./ModalInactivarReseña";
import ModalCrearReseña from "./ModalCrearReseña";
import ModalActualizarReseña from "./ModalActualizarReseña";
import FiltrarResenaEstado from "../../components/common/FiltrarResenaEstado";

const reseñas = [
    {
        _id: "7",
        contenido: "¡Estoy disfrutando de 'Cien años de soledad' de Gabriel García Márquez! Es una obra maestra de la literatura.",
        fotoLibro: "https://example.com/cien-anos-soledad.jpg",
        usuario: {
            _id: "7",
            nombreCompleto: "Juan Pérez",
            nombreUsuario: "juanp",
            fotoPerfil: "https://example.com/perfil-juan.jpg"
        },
        estado: "Activo"
    },
    {
        _id: "5",
        contenido: "Recomiendo 'El túnel' de Ernesto Sabato. Es una lectura intensa y profunda.",
        fotoLibro: "https://example.com/el-tunel.jpg",
        usuario: {
            _id: "5",
            nombreCompleto: "Ana Martínez",
            nombreUsuario: "ana_martinez",
            fotoPerfil: "https://example.com/perfil-ana.jpg"
        },
        estado: "Activo"
    },
    {
        _id: "3",
        contenido: "Me encantó 'Fahrenheit 451' de Ray Bradbury. La temática es muy relevante para los tiempos modernos.",
        fotoLibro: null, // No hay imagen para esta reseña
        usuario: {
            _id: "3",
            nombreCompleto: "Carlos López",
            nombreUsuario: "carlos_lopez",
            fotoPerfil: "https://example.com/perfil-carlos.jpg"
        },
        estado: "Activo"
    },
    {
        _id: "4",
        contenido: "Me encantó 'Fahrenheit 451' de Ray Bradbury. La temática es muy relevante para los tiempos modernos.para los tiempos modernos.para los tiempos modernos.para los tiempos modernos.",
        fotoLibro: null, // No hay imagen para esta reseña
        usuario: {
            _id: "4",
            nombreCompleto: "Carlos López",
            nombreUsuario: "carlos_lopez",
            fotoPerfil: "https://example.com/perfil-carlos.jpg"
        },
        estado: "Activo"
    },
    {
        _id: "1",
        contenido: "¡Estoy disfrutando de 'Cien años de soledad' de Gabriel García Márquez! Es una obra maestra de la literatura.",
        fotoLibro: "https://example.com/cien-anos-soledad.jpg",
        usuario: {
            _id: "1",
            nombreCompleto: "Juan Pérez",
            nombreUsuario: "juanp",
            fotoPerfil: "https://example.com/perfil-juan.jpg"
        },
        estado: "Inactivo"
    },
   
];


function GestionResenas() {
    const [isActivarModalOpen, setIsActivarModalOpen] = useState(false);
    const [isInactivarModalOpen, setIsInactivarModalOpen] = useState(false);
    const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
    const [isActualizarModalOpen, setIsActualizarModalOpen] = useState(false);
    const [reseñaSeleccionada, setReseñaSeleccionada] = useState(null);
    const [expandedPost] = useState(null); 
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filteredState, setFilteredState] = useState("Todos"); // Estado para el filtro de estado


    // const toggleExpandPost = (postId) => {
    //     setExpandedPost(expandedPost === postId ? null : postId);
    // };

    const handleActualizarClick = (reseña) => {
        setReseñaSeleccionada(reseña);
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

      // Filtrar publicaciones por estado
      const filteredPublicaciones = reseñas.filter((libro) =>
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
                        <img className="w-full h-[269px] rounded-t-2xl" src={banner_usua} alt="banner" />
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
                        {filteredPublicaciones.map((reseña) => {  
                            const isExpanded = isPostExpanded(reseña._id);
                            const contenidoMostrado = isExpanded
                            ? reseña.contenido
                            : `${reseña.contenido.substring(0, 100)}...`;

                            return (
                                <div
                                key={reseña._id}
                                className="bg-white shadow-lg rounded-lg w-[320px] min-h-[450px] p-4 mb-4 border border-gray-300 flex flex-col justify-between">
                                    <div className="flex gap-4">
                                        <div className="flex flex-col w-full">
                                            <div className="avatar">
                                                <Link to={`/profile/${reseña.usuario._id}`} className="w-8 rounded-full overflow-hidden">
                                                    <img src={reseña.usuario.fotoPerfil} alt="Profile" />
                                                </Link>
                                            </div>
                                            <div className="flex flex-col flex-1">
                                                <div className="flex gap-2 items-center">
                                                    <Link to={`/profile/${reseña.usuario._id}`} className="font-bold">
                                                        {reseña.usuario.nombreCompleto}
                                                    </Link>
                                                </div>

                                                {/* Mostrar contenido truncado o completo */}
                                                <div className="text-left">
                                                    {expandedPost === reseña._id
                                                        ? reseña.contenido
                                                        : reseña.contenido.length > 50
                                                        ? `${reseña.contenido.substring(0, 50)}...`
                                                        : reseña.contenido}
                                                </div>

                                                {/* Texto de la publicación (Descripción) */}
                                                <p className="text-gray-700 mb-2">{contenidoMostrado}</p>

                                                {/* Botón de ver más o ver menos */}
                                                <button
                                                    className="text-primary flex items-center mt-1"
                                                    onClick={() => toggleExpandPost(reseña._id)}
                                                >
                                                    <BiShow className="text-xl" />
                                                    <span className="ml-1">
                                                        {expandedPost === reseña._id ? "Ver menos" : "Ver más"}
                                                    </span>
                                                </button>

                                                {reseña.fotoLibro && (
                                                    <img
                                                        src={reseña.fotoLibro}
                                                        className="h-[300px] object-contain rounded-lg border border-blue-950 mt-2"
                                                        alt="Libro"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-end items-center gap-3 mt-3">
                                        <button onClick={() => setIsActivarModalOpen(true)} title="Activar">
                                            <BiPowerOff className="text-xl" />
                                        </button>
                                        <button onClick={() => setIsInactivarModalOpen(true)} title="Inactivar">
                                            <BiReset className="text-xl" />
                                        </button>
                                        <button onClick={() => setIsCrearModalOpen(true)} title="Crear">
                                            <BiPlus className="text-xl" />
                                        </button>
                                        <button onClick={() => handleActualizarClick(reseña)} title="Actualizar">
                                            <BiEdit className="text-xl" />
                                        </button>
                                    </div>

                                </div>
                            );
                        })}

                    </div>

                    {/* Modales para activar, inactivar, crear y actualizar reseñas */}
                    <ModalActivarReseña isOpen={isActivarModalOpen} onClose={() => setIsActivarModalOpen(false)} />
                    <ModalInactivarReseña isOpen={isInactivarModalOpen} onClose={() => setIsInactivarModalOpen(false)} />
                    <ModalCrearReseña isOpen={isCrearModalOpen} onClose={() => setIsCrearModalOpen(false)} />
                    <ModalActualizarReseña
                        isOpen={isActualizarModalOpen}
                        onClose={() => setIsActualizarModalOpen(false)}
                        reseña={reseñaSeleccionada}
                    />

                    <FiltrarResenaEstado
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

export default GestionResenas;
