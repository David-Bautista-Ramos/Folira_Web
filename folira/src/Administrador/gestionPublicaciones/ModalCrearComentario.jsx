import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ModalCrearComentario = ({
    isOpen,
    onClose,
    publicacionId,
    obtenerPublicaciones,
}) => {
    const [text, setText] = useState('');
    const [usuarios, setUsuarios] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        // Función para obtener usuarios
        const fetchUsuarios = async () => {
            try {
                const response = await fetch('/api/users/allUsers'); // Asegúrate de tener esta ruta en tu backend
                const data = await response.json();
                setUsuarios(data);
            } catch (err) {
                console.error("Error al obtener usuarios:", err);
            }
        };

        fetchUsuarios();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) {
            setError("El comentario no puede estar vacío.");
            return;
        }

        if (!selectedUser) {
            setError("Debes seleccionar un usuario.");
            return;
        }

        try {
            const response = await fetch(`/api/posts/commentAd/${publicacionId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    userId: selectedUser, // Incluye el ID del usuario seleccionado
                }),
            });

            if (!response.ok) {
                throw new Error("Error en la creación del comentario");
            }

            const data = await response.json();
            console.log("Comentario creado:", data);
            setText(''); // Limpiar el campo de texto
            setSelectedUser(''); // Limpiar la selección del usuario
            toast.success("Comentario creado con éxito");
            obtenerPublicaciones(); // Refrescar las publicaciones
            onClose(); // Cerrar el modal
        } catch (err) {
            console.error("Error al crear el comentario:", err);
            setError("Ocurrió un error al enviar el comentario.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
                <h2 className="text-lg font-bold mb-4">Crear Comentario</h2>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="usuario" className="block mb-1">Seleccionar Usuario</label>
                        <select
                            id="usuario"
                            className="w-full p-2 border border-primary rounded"
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                        >
                            <option value="">Cargando Usuarios.....</option>
                            {usuarios.map((usuario) => (
                                <option key={usuario._id} value={usuario._id}>
                                    {usuario.nombre} {usuario.apellido}
                                </option>
                            ))}
                        </select>
                    </div>
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
    onClose: PropTypes.func.isRequired,
    publicacionId: PropTypes.string.isRequired,
    obtenerPublicaciones: PropTypes.func.isRequired,
};

export default ModalCrearComentario;
