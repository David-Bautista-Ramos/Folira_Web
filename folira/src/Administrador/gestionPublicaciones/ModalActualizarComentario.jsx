import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ModalEditarComentario = ({
    isOpen,
    onClose,
    publicacionId,
    comentarioId,
    obtenerPublicaciones,
}) => {
    const [text, setText] = useState('');
    const [usuario, setUsuario] = useState(null); // Guardar la información del usuario
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComentario = async () => {
            try {
                const response = await fetch(`/api/posts/commenxID/${publicacionId}/${comentarioId}`);
                if (!response.ok) throw new Error("Error al cargar el comentario");

                const data = await response.json();
                setText(data.comentario.text); // Cargar el texto del comentario
                setUsuario(data.comentario.user); // Guardar la información del usuario del comentario
                setLoading(false);
            } catch (err) {
                console.error("Error al obtener el comentario:", err);
                setError("No se pudo cargar el comentario.");
                setLoading(false);
            }
        };

        if (isOpen) fetchComentario(); // Llamar solo si el modal está abierto
    }, [isOpen, publicacionId, comentarioId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) {
            setError("El comentario no puede estar vacío.");
            return;
        }

        try {
            const response = await fetch(`/api/posts/editarcomen/${publicacionId}/${comentarioId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nuevoTexto: text }),
            });

            if (!response.ok) throw new Error("Error al actualizar el comentario");
            
            toast.success("Comentario actualizado con éxito");
            obtenerPublicaciones(); // Refrescar las publicaciones
            onClose(); // Cerrar el modal
        } catch (err) {
            console.error("Error al actualizar el comentario:", err);
            setError("Ocurrió un error al enviar el comentario.");
        }
    };

    if (!isOpen) return null;
    if (loading) return <div>Cargando comentario...</div>;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
                <h2 className="text-lg font-bold mb-4">Editar Comentario</h2>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSubmit}>
                    {usuario && (
                        <div className="mb-4 flex items-center">
                            <img
                                src={usuario.fotoPerfil}
                                alt="Perfil"
                                className="w-10 h-10 rounded-full mr-3"
                            />
                            <p className="border border-gray-300 p-2 rounded">
                                {usuario.nombre}
                            </p>
                        </div>
                    )}
                    <textarea
                        className="w-full p-2 border border-primary rounded mb-4"
                        rows="4"
                        placeholder="Escribe tu comentario aquí..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
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
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

ModalEditarComentario.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    publicacionId: PropTypes.string.isRequired,
    comentarioId: PropTypes.string.isRequired,
    obtenerPublicaciones: PropTypes.func.isRequired,
};

export default ModalEditarComentario;
