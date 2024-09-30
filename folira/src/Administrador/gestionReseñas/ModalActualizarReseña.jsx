import  { useEffect, useState } from 'react';

const ModalActualizarReseña = ({ isOpen, onClose, reseña }) => {
    const [contenido, setContenido] = useState('');
    const [fotoLibro, setFotoLibro] = useState('');

    // Cargar datos de la reseña cuando el modal se abra
    useEffect(() => {
        if (isOpen && reseña) {
            setContenido(reseña.contenido);
            setFotoLibro(reseña.fotoLibro || ''); // Si no hay imagen, establece como cadena vacía
        }
    }, [isOpen, reseña]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí podrías manejar la actualización de la reseña
        console.log("Actualizando reseña:", { contenido, fotoLibro });
        // Luego puedes cerrar el modal
        onClose();
    };

    if (!isOpen) return null; // Si el modal no está abierto, no mostrar nada

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Actualizar Reseña</h2>
                    
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="contenido" className="block text-sm font-medium text-gray-700">Contenido</label>
                        <textarea
                            id="contenido"
                            rows="4"
                            value={contenido}
                            onChange={(e) => setContenido(e.target.value)}
                            className="mt-1 block w-full p-2 border border-primary rounded-md"
                            required
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="fotoLibro" className="block text-sm font-medium text-gray-700">URL de la imagen del libro (opcional)</label>
                        <input
                            type="url"
                            id="fotoLibro"
                            value={fotoLibro}
                            onChange={(e) => setFotoLibro(e.target.value)}
                            className="mt-1 block w-full p-2 border border-primary rounded-md"
                        />
                    </div>
                    <div className="flex justify-end gap-4 mt-4">
                        <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md  hover:bg-gray-400" onClick={onClose}>
                            Cancelar
                        </button>
                        <button className="px-4 py-2 border rounded bg-primary text-white hover:bg-blue-950">
                            Actualizar
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ModalActualizarReseña;
