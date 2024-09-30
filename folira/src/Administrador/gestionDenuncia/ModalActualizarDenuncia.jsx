

const ModalActualizarDenuncia = ({ isOpen, onClose, denuncia }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-5 w-96 z-10">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Actualizar Denuncia</h2>
                </div>
                <p className="mb-2"><strong>Denunciante:</strong> {denuncia.denunciante.nombreCompleto}</p>
                <p className="mb-2"><strong>Denunciado:</strong> {denuncia.denunciado.nombreCompleto}</p>
                <p className="mb-2"><strong>Motivo:</strong> {denuncia.denunciado.motivo}</p>
                <div className="flex justify-end mt-4"> {/* Alinea los botones a la derecha */}
                <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md mr-4 hover:bg-gray-400" onClick={onClose}>
                        Cancelar
                    </button>
                    <button className="px-4 py-2 border rounded bg-primary text-white hover:bg-blue-950">
                    Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalActualizarDenuncia;
