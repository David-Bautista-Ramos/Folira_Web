import PropTypes from 'prop-types';
import { useState } from 'react';
import { BiPowerOff, BiReset, BiPlus, BiEdit } from 'react-icons/bi';
import ModalActivarComentario from './ModalActivarComentario';
import ModalInactivarComentario from './ModalInactivarComentario';
import ModalActualizarComentario from './ModalActualizarComentario';
import ModalCrearComentario from './ModalCrearComentario';

const ComentariosModal = ({ isOpen, onClose, comentarios }) => {
    const [modalActivo, setModalActivo] = useState(null);
    const [comentarioSeleccionado, setComentarioSeleccionado] = useState(null); // Estado para el comentario seleccionado

    const abrirModal = (tipo, comentario) => {
        setModalActivo(tipo);
        setComentarioSeleccionado(comentario); // Guarda el comentario seleccionado
    };

    const cerrarModal = () => {
        setModalActivo(null);
        setComentarioSeleccionado(null); // Reinicia el comentario seleccionado al cerrar
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
                <h2 className="text-lg font-bold mb-4">Comentarios</h2>
                {comentarios.length > 0 ? (
                    comentarios.map((comentario) => (
                        <div key={comentario._id} className="flex items-start mb-3">
                            <img 
                                src={comentario.user.fotoPerfil} 
                                alt="Perfil" 
                                className="w-10 h-10 rounded-full mr-3" 
                            />
                            <div className="flex-1">
                                <strong className="block">{comentario.user.nombreCompleto}</strong>
                                <p className="text-gray-700">{comentario.text}</p>
                                
                                {/* Contenedor de íconos */}
                                <div className="flex gap-2 mt-2">
                                    <button title="Activar" onClick={() => abrirModal('activar')}>
                                        <BiPowerOff className="text-xl" />  
                                    </button>
                                    <button title="Inactivar" onClick={() => abrirModal('inactivar')}>
                                        <BiReset className="text-xl" />
                                    </button>
                                    <button title="Crear" onClick={() => abrirModal('crear')}>
                                        <BiPlus className="text-xl" />
                                    </button>
                                    <button title="Actualizar" onClick={() => abrirModal('actualizar', comentario)}>
                                        <BiEdit className="text-xl" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No hay comentarios.</p>
                )}

                <div className="flex justify-end gap-4 mt-4">
                    <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md  hover:bg-gray-400" onClick={onClose}>
                        Cancelar
                    </button>
                   
                </div>
            </div>

            {/* Renderiza el modal correspondiente basado en el estado */}
            {modalActivo === 'activar' && <ModalActivarComentario isOpen={true} onClose={cerrarModal} />}
            {modalActivo === 'inactivar' && <ModalInactivarComentario isOpen={true} onClose={cerrarModal} />}
            {modalActivo === 'actualizar' && (
                <ModalActualizarComentario 
                    isOpen={true} 
                    onClose={cerrarModal} 
                    comentario={comentarioSeleccionado} // Pasa el comentario seleccionado
                />
            )}
            {modalActivo === 'crear' && <ModalCrearComentario isOpen={true} onClose={cerrarModal} />}
        </div>
    );
};

ComentariosModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    comentarios: PropTypes.array.isRequired
};

export default ComentariosModal;
