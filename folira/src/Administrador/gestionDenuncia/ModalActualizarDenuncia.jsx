import { useState, useEffect } from "react";

const ModalInactivarDenuncia = ({ isOpen, onClose, denunciasId, obtenerDenuncias, token }) => {
    const [denuncia, setDenuncia] = useState(null); // Estado para la denuncia
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // Estado para errores
    const [usuarios, setUsuarios] = useState([]); // Estado para la lista de usuarios
    const [denunciadoSeleccionado, setDenunciadoSeleccionado] = useState(''); // Denunciado seleccionado

    // Fetch usuarios
    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await fetch('/api/users/allUsers', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const usuarios = await response.json();
                setUsuarios(usuarios || []);
            } catch (error) {
                console.error("Error al obtener los usuarios:", error);
            }
        };
        fetchUsuarios();
    }, [token]);


    // Cargar la denuncia específica al abrir el modal
    useEffect(() => {
        const fetchDenuncia = async () => {
            if (isOpen && denunciasId) {
                try {
                    const response = await fetch(`/api/denuncias/denuncia/${denunciasId}`);
                    if (!response.ok) {
                        throw new Error("Error al obtener la denuncia");
                    }
                    const data = await response.json();
                    setDenuncia(data.denuncia);
                    setDenunciadoSeleccionado(data.denuncia.denunciado?._id || '');
                } catch (error) {
                    setError(error.message);
                }
            }
        };
        fetchDenuncia();
    }, [isOpen, denunciasId]);

    const handleActualizarDenuncia = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/denuncias/denuncia/${denunciasId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Asegúrate de incluir el token si es necesario
                },
                body: JSON.stringify({
                    solucion: denuncia.solucion,
                    motivo: denuncia.motivo, // Incluir el motivo actualizado
                    idUsuario: denunciadoSeleccionado,
                }),
            });

            if (!response.ok) {
                throw new Error("Error al desactivar la denuncia");
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
                        <div className="mb-4">
                            <label className="block mb-1"><strong>Motivo:</strong></label>
                            <textarea
                                value={denuncia.motivo}
                                onChange={(e) => setDenuncia({ ...denuncia, motivo: e.target.value })}
                                className="w-full border rounded p-2"
                                rows={4} // Puedes ajustar la cantidad de filas según sea necesario
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1"><strong>Solucion:</strong></label>
                            <textarea
                                value={denuncia.solucion}
                                onChange={(e) => setDenuncia({ ...denuncia, solucion: e.target.value })}
                                className="w-full border rounded p-2"
                                rows={4} // Puedes ajustar la cantidad de filas según sea necesario
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1"><strong>Selecciona el Denunciado:</strong></label>
                            <select
                                value={denunciadoSeleccionado}
                                onChange={(e) => setDenunciadoSeleccionado(e.target.value)}
                                className="w-full border rounded p-2"
                            >
                                <option value="">-- Selecciona un denunciado --</option>
                                {Array.isArray(usuarios) && usuarios.map((usuario) => (
                                    <option key={usuario._id} value={usuario._id}>
                                        {usuario.nombreCompleto}
                                    </option>
                                ))}
                            </select>
                        </div>
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
                        onClick={handleActualizarDenuncia}
                        disabled={loading || !denunciadoSeleccionado} // Desactivar si no hay usuario seleccionado
                    >
                        {loading ? "Actualizando..." : "Actualizar"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalInactivarDenuncia;
