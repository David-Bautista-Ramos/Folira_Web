import { useEffect, useState } from 'react';
import useUpdateReseña from '../../hooks/useUpdateReseña'; // Custom hook for updating review

const ModalActualizarReseña = ({ isOpen, onClose, reseña, obtenerReseñasLiterarias }) => {
    const [contenido, setContenido] = useState('');
    const [fotoLibro, setFotoLibro] = useState('');
    const [isUpdatingReseña, setIsUpdatingReseña] = useState(false); // State for loading indicator

    const { updateReseña } = useUpdateReseña(); // Use your custom hook for updating the review

    // Load review data when the modal opens
    useEffect(() => {
        if (isOpen && reseña) {
            setContenido(reseña.contenido);
            setFotoLibro(reseña.fotoLibro || ''); // If no image, set as empty string
        }
    }, [isOpen, reseña]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdatingReseña(true);
        
        try {
            await updateReseña({ contenido, fotoLibro });
            // You might want to refresh the list of reviews
            obtenerReseñasLiterarias();
            onClose(); // Close the modal after successful update
        } catch (error) {
            console.error("Error updating review:", error);
        } finally {
            setIsUpdatingReseña(false);
        }
    };

    const handleImgChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setFotoLibro(reader.result);
            reader.readAsDataURL(file);
        }
    };

    if (!isOpen) return null; // If the modal is not open, do not show anything

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
                        <label className="block text-sm font-medium text-gray-700">Foto del libro (opcional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImgChange}
                            className="mt-1 block w-full p-2 border border-primary rounded-md"
                        />
                        {fotoLibro && (
                            <img
                                src={fotoLibro}
                                alt="Preview"
                                className="w-24 h-24 rounded-full object-cover mx-auto mt-3" // Circular style
                            />
                        )}
                    </div>

                    <div className="flex justify-end gap-4 mt-4">
                        <button
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 border rounded bg-primary text-white hover:bg-blue-950"
                            disabled={isUpdatingReseña} // Disable button during updating
                        >
                            {isUpdatingReseña ? "Actualizando..." : "Actualizar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalActualizarReseña;
