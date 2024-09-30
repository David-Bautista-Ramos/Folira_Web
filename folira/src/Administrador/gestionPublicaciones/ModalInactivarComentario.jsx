import PropTypes from 'prop-types';

const ModalInactivarComentario = ({ isOpen, onClose, comentario }) => {
    const handleInactivate = () => {
        // Aquí puedes agregar la lógica para inactivar el comentario
        console.log("Comentario inactivado:", comentario);
        onClose(); // Cerrar el modal después de inactivar
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
                <h2 className="text-lg font-bold mb-4">Inactivar Comentario</h2>
                <p>¿Estás seguro de que deseas inactivar este comentario?</p>
                <div className="flex justify-end mt-4">
                    <button
                        type="button"
                        className="bg-gray-300 text-black rounded px-4 py-2 mr-2 hover:bg-gray-400"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className= "px-4 py-2 border rounded bg-primary text-white hover:bg-blue-950"
                        onClick={handleInactivate}
                    >
                        Inactivar
                    </button>
                </div>
            </div>
        </div>
    );
};

ModalInactivarComentario.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    comentario: PropTypes.object.isRequired, // El comentario que se está inactivando
};

export default ModalInactivarComentario;