import { useState, useEffect } from "react";

const ModalActualizarPublicacion = ({ isOpen, onClose, onUpdate, publicacion }) => {
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [imagen, setImagen] = useState(null);

    useEffect(() => {
        if (publicacion) {
            setTitulo(publicacion.titulo);
            setDescripcion(publicacion.descripcion);
        }
    }, [publicacion]);

    if (!isOpen) return null;

    const handleImageUpload = (e) => {
        setImagen(e.target.files[0]);
    };

    const handleSubmit = () => {
        const publicacionActualizada = {
            ...publicacion, // Mantenemos el resto de los datos de la publicación (ID, etc.)
            titulo,
            descripcion,
            imagen: imagen || publicacion.imagen, // Si no se selecciona nueva imagen, mantener la existente
        };
        onUpdate(publicacionActualizada);
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4">Actualizar Publicación</h2>
                
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Subir Nueva Imagen (Opcional)</label>
                    <input
                        type="file"
                        className="w-full border h-13 border-primary p-2 rounded"
                        onChange={handleImageUpload}
                    />
                    {publicacion.imagen && (
                        <p className="text-sm text-gray-500 mt-2">
                            Imagen actual: {publicacion.imagen.name || "imagen subida anteriormente"}
                        </p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Descripción</label>
                    <textarea
                        className="w-full p-2 border border-primary rounded"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        placeholder="Escribe una descripción"
                    ></textarea>
                </div>
                
                <div className="flex justify-end mt-4">
                    <button
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md  hover:bg-gray-400"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button
                        className="px-4 py-2 ml-4 border rounded bg-primary text-white hover:bg-blue-950"
                        onClick={handleSubmit}
                    >
                        Actualizar 
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalActualizarPublicacion;
