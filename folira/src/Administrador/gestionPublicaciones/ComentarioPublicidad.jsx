import PropTypes from 'prop-types';
import { useState } from 'react';
import { BiPlus, BiEdit, BiTrash } from 'react-icons/bi';
import ModalActualizarComentario from './ModalActualizarComentario';
import ModalCrearComentario from './ModalCrearComentario';
import ModalEliminarComentario from './ModalEliminarComentario';

const ComentariosModal = ({ isOpen, onClose, comentarios, publicacionId, obtenerPublicaciones }) => {
  const [selectedComentarioId, setSelectedComentarioId] = useState(null);
  const [modalActivo, setModalActivo] = useState(null);

  const handleOpenEliminarModal = (comentarioId) => {
    setSelectedComentarioId(comentarioId);
    setModalActivo('eliminar');
  };

  const handleOpenActualizarModal = (comentarioId) => {
    setSelectedComentarioId(comentarioId);
    setModalActivo('actualizar');
  };

  const handleOpenCrearModal = () => {
    setModalActivo('crear');
  };

  const closeModal = () => {
    setModalActivo(null);
    setSelectedComentarioId(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Comentarios</h2>
        {comentarios.length > 0 ? (
          <ul className="space-y-4">
            {comentarios.map((comentario) => (
              <div key={comentario._id} className="flex items-start mb-3">
                <img 
                  src={comentario.user.fotoPerfil} 
                  alt="Perfil" 
                  className="w-10 h-10 rounded-full mr-3" 
                />
                <div className="flex-1">
                  <strong className="block">{comentario.user.nombreCompleto}</strong>
                  <p className="text-gray-700">{comentario.text}</p>

                  <div className="flex gap-2 mt-2">
                    <button
                      title="Actualizar"
                      onClick={() => handleOpenActualizarModal(comentario._id)}
                    >
                      <BiEdit className="text-xl" />
                    </button>
                    <button 
                      onClick={() => handleOpenEliminarModal(comentario._id)} 
                      title="Eliminar"
                    >
                      <BiTrash className="text-xl" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </ul>
        ) : (
          <p>No hay comentarios disponibles</p>
        )}
        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cerrar
          </button>
          <button
            onClick={handleOpenCrearModal}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-slate-400"
          >
            <BiPlus className="inline" /> Crear Comentario
          </button>
        </div>
      </div>

      {/* Modales para activar, inactivar, actualizar y crear comentario */}
      {modalActivo === 'actualizar' && (
        <ModalActualizarComentario
          isOpen={true}
          comentarioId={selectedComentarioId}
          publicacionId={publicacionId}
          obtenerPublicaciones={obtenerPublicaciones} // Asegúrate de pasar esta función 
          onClose={closeModal}
        />
      )}
      {modalActivo === 'crear' && (
        <ModalCrearComentario 
        isOpen={true}
        publicacionId={publicacionId}
        obtenerPublicaciones={obtenerPublicaciones} // Asegúrate de pasar esta función 
        onClose={closeModal} 
        />
      )}
      {modalActivo === 'eliminar' && (
        <ModalEliminarComentario 
          isOpen={true}
          comentarioId={selectedComentarioId}
          publicacionId={publicacionId}
          obtenerPublicaciones={obtenerPublicaciones} // Asegúrate de pasar esta función
          onClose={closeModal}
        />
      )}
    </div>
  );
};

ComentariosModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  comentarios: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      user: PropTypes.shape({
        nombreCompleto: PropTypes.string.isRequired,
        fotoPerfil: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
  publicacionId: PropTypes.string.isRequired,
  obtenerPublicaciones: PropTypes.func.isRequired, // Asegúrate de que esto esté en PropTypes
};

export default ComentariosModal;
