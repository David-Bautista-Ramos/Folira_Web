import PropTypes from 'prop-types';
import { useState } from 'react';

const ModalCrearComentario = ({ isOpen, onClose }) => {
    const [comentario, setComentario] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí puedes agregar la lógica para enviar el comentario
        console.log("Comentario creado:", comentario);
        setComentario(''); // Reiniciar el campo de comentario
        onClose(); // Cerrar el modal después de enviar
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
                <h2 className="text-lg font-bold mb-4">Crear Comentario</h2>
                <form onSubmit={handleSubmit}>
                    <textarea
                        className="w-full p-2 border border-primary rounded mb-4"
                        rows="4"
                        placeholder="Escribe tu comentario aquí..."
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
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
                            type="submit"
                            className="px-4 py-2 border rounded bg-primary text-white hover:bg-blue-950"
                        >
                            Crear 
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

ModalCrearComentario.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

export default ModalCrearComentario;
