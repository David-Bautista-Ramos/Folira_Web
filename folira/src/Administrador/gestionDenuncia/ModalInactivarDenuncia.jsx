import { useState, useEffect } from "react";

const ModalInactivarDenuncia = ({ isOpen, onClose, denunciasId, obtenerDenuncias }) => {
    const [denuncia, setDenuncia] = useState(null); // Estado para la denuncia
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // Estado para errores

    useEffect(() => {
        if (isOpen && denunciasId) {
            // Cargar la denuncia específica al abrir el modal
            fetch(`/api/denuncias/denuncia/${denunciasId}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Error al obtener la denuncia");
                    }
                    return response.json();
                })
                .then((data) => setDenuncia(data.denuncia)) // Accede a denuncia
                .catch((err) => setError(err.message));
        }
    }, [isOpen, denunciasId]);

    const handleDesactivarDenuncia = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/denuncias/denunciades/${denunciasId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error("Error al activar la denuncia");
            }

            const data = await response.json();
            console.log(data.message); // Mensaje de éxito o error
            obtenerDenuncias(); // Actualizar la lista de denuncias
            onClose(); // Cerrar el modal
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Desactivar Denuncia</h2>

                {error && <p className="text-red-500">Error: {error}</p>}

                {denuncia ? (
                    <>
                        <p className="mb-2">
                            <strong>Denunciado:</strong> {denuncia.idUsuario?.nombre || "No disponible"}
                        </p>
                        <p className="mb-2">
                            <strong>Motivo:</strong> {denuncia.motivo}
                        </p>
                    </>
                ) : (
                    <p>Cargando datos de la denuncia...</p>
                )}

                <div className="flex justify-end gap-4 mt-4">
                    <button
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button
                        className={`px-4 py-2 border rounded bg-primary text-white hover:bg-blue-950 ${loading ? 'opacity-50' : ''}`}
                        onClick={handleDesactivarDenuncia}
                        disabled={loading}
                    >
                        {loading ? "Desactivando..." : "Desactivar"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalInactivarDenuncia;