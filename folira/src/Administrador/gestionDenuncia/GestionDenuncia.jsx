import { useState } from "react";
import ModalActivarDenuncia from "./ModalActivarDenuncia";
import ModalActualizarDenuncia from "./ModalActualizarDenuncia";
import ModalInactivarDenuncia from "./ModalInactivarDenuncia";
import banner_denuncia from "../../assets/img/gestionDenuncia.jpeg";
import { BiEdit, BiPowerOff, BiReset, BiShow, BiHide } from "react-icons/bi";
import Nav from "../../components/common/Nav";
import ModalFiltroEstado from "../../components/common/ModalListarDenuncia"

const denuncias = [
    {
        tipo: "usuario",
        denunciante: {
            nombreCompleto: "Juan Pérez",
            fotoPerfil: "https://example.com/perfil-juan.jpg"
        },
        denunciado: {
            nombreCompleto: "Carlos López",
            motivo: "Comportamiento inapropiado",
        },
        estado: "activo", 
    },
    {
        tipo: "publicacion",
        denunciante: {
            nombreCompleto: "Maria García",
            fotoPerfil: "https://example.com/perfil-maria.jpg"
        },
        denunciado: {
            nombreCompleto: "Luis Martínez",
            contenido: "¡Estoy disfrutando de 'Cien años de soledad' de Gabriel García Márquez!",
            fotoPublicacion: "https://example.com/cien-anos-soledad.jpg",
            motivo: "Contenido ofensivo"
        },
        estado: "inactivo", 
    },
    {
        tipo: "comunidad",
        denunciante: {
            nombreCompleto: "Ana Torres",
            fotoPerfil: "https://example.com/perfil-ana.jpg"
        },
        denunciado: {
            nombreCompleto: "Comunidad Literaria",
            motivo: "Spam"
        },
        estado: "activo", 
    },
    {
        tipo: "resena",
        denunciante: {
            nombreCompleto: "Carlos Díaz",
            fotoPerfil: "https://example.com/perfil-carlos.jpg"
        },
        denunciado: {
            nombreCompleto: "Maria García",
            contenido: "Una reseña muy mal escrita y sin fundamento.",
            motivo: "Falsedad"
        },
        estado: "inactivo", 
    },
];

function GestionDenuncias() {
    const [modalUsuarioOpen, setModalUsuarioOpen] = useState(false);
    const [modalPublicacionOpen, setModalPublicacionOpen] = useState(false);
    const [modalInactivarOpen, setModalInactivarOpen] = useState(false); 
    const [expandedPosts, setExpandedPosts] = useState({}); 
    const [selectedDenuncia, setSelectedDenuncia] = useState(null); 
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [estadoFiltrado, setEstadoFiltrado] = useState(null);

    const handleActivar = (denuncia) => {
        setSelectedDenuncia(denuncia);
        setModalUsuarioOpen(true);
    };

    const handleInactivar = (denuncia) => {
        setSelectedDenuncia(denuncia);
        setModalInactivarOpen(true);
    };

    const handleActualizar = (denuncia) => {
        setSelectedDenuncia(denuncia);
        setModalPublicacionOpen(true);
    };

    const toggleExpandPost = (postId) => {
        setExpandedPosts((prev) => ({
            ...prev,
            [postId]: !prev[postId],
        }));
    };

    
    const handleFilterEstado = (estado) => {
        setEstadoFiltrado(estado);
        setFilterModalOpen(false);
    };

    const denunciasFiltradas = estadoFiltrado ? denuncias.filter(d => d.estado === estadoFiltrado) : denuncias;

    return (
        <div>
            <Nav />
            

            <div className="flex justify-center items-center mt-10">
                <main className="bg-white w-[100%] max-w-[1600px] mx-2 mt-10 rounded-t-2xl border border-gray-500 shadow-lg">
                    {/* Banner */}
                    <div>
                        <img className="w-full h-64 rounded-t-2xl" src={banner_denuncia} alt="banner" />
                    </div>

                    <div className="flex justify-center mt-4">
                {/* Botón para abrir el modal de estado, con estilos similares al Nav */}
                <button 
                    className="px-4 py-2 border rounded bg-primary mb-2.5 ml-[890px] text-white hover:bg-blue-950"
                    onClick={() => setFilterModalOpen(true)} 
                >
                         Estado
                    </button>
                </div>
        
                 
                    <div>
                    {/* Modal de Filtro justo debajo del banner */}
                    {filterModalOpen && (
                        <ModalFiltroEstado
                            isOpen={filterModalOpen}
                            onClose={() => setFilterModalOpen(false)}
                            onFilter={handleFilterEstado}
                        />
                    )}

                    </div>
                    

                    
                    <div className="flex flex-wrap justify-center gap-10 p-2">
                        {denunciasFiltradas.map((denuncia, index) => {
                            const isExpanded = expandedPosts[index];
                            return (
                                <div key={index} className="bg-white shadow-lg rounded-lg w-[320px] p-2 mb-4 border border-gray-300 flex flex-col">
                                    <div className="flex gap-4 mb-2">
                                        <img
                                            src={denuncia.denunciante.fotoPerfil}
                                            alt="Perfil Denunciante"
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <span className="font-bold">{denuncia.denunciante.nombreCompleto}</span>
                                    </div>
                                    <div className="flex-grow"> {/* Permite que el contenido ocupe el espacio restante */}
                                        <span className="font-semibold">Denunciado: {denuncia.denunciado.nombreCompleto}</span>
                                        <p className="text-gray-700 mb-2">Motivo: {denuncia.denunciado.motivo}</p>
                                        <p className="text-gray-700 mb-2">Estado: {denuncia.estado}</p>
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
                                    </div>
                                    <div className="flex justify-end items-center gap-3 mt-3">
                                        <button onClick={() => handleActivar(denuncia)}>
                                            <BiPowerOff className="text-xl" />
                                        </button>
                                        <button onClick={() => handleInactivar(denuncia)}>
                                            <BiReset className="text-xl" />
                                        </button>
                                        <button onClick={() => handleActualizar(denuncia)}>
                                            <BiEdit className="text-xl" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </main>
            </div>

            {/* Modales para gestionar denuncias */}
            <ModalActivarDenuncia
                isOpen={modalUsuarioOpen}
                onClose={() => setModalUsuarioOpen(false)}
                denuncia={selectedDenuncia}
            />
            <ModalInactivarDenuncia
                isOpen={modalInactivarOpen}
                onClose={() => setModalInactivarOpen(false)}
                denuncia={selectedDenuncia}
            />
            <ModalActualizarDenuncia
                isOpen={modalPublicacionOpen}
                onClose={() => setModalPublicacionOpen(false)}
                denuncia={selectedDenuncia}
            />
        </div>
    );
}

export default GestionDenuncias;
