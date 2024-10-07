import { useState } from 'react';
import PropTypes from 'prop-types';

const ModalActualizarComentario = ({ isOpen, onClose, comentario }) => {
    const [nuevoComentario, setNuevoComentario] = useState(comentario.text);

    const handleUpdate = () => {
        // Aquí puedes agregar la lógica para actualizar el comentario en tu base de datos o estado global
        console.log("Comentario actualizado:", nuevoComentario);
        onClose(); // Cerrar el modal después de actualizar
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
                <h2 className="text-lg font-bold mb-4">Actualizar Comentario</h2>
                <textarea
                    className="w-full p-2 border border-primary rounded mb-4"
                    rows="4"
                    value={nuevoComentario}
                    onChange={(e) => setNuevoComentario(e.target.value)}
                />
                <div className="flex justify-end">
                    <button
                        type="button"
                        className="bg-gray-300 text-black rounded px-4 py-2 mr-2 hover:bg-gray-400"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 border rounded bg-primary text-white hover:bg-blue-950"
                        onClick={handleUpdate}
                    >
                        Actualizar 
                    </button>
                </div>
            </div>
        </div>
    );
};

ModalActualizarComentario.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    comentario: PropTypes.object.isRequired
};

export default ModalActualizarComentario;
