// import { useState } from "react";

const ModalActivarDenuncia = ({ isOpen, onClose, denuncia, onConfirm }) => {
    if (!isOpen) return null; // No renderizar el modal si no está abierto

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-5 w-96">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Activar Denuncia</h2>
                </div>

                {denuncia && (
                    <>
                        <p className="mb-2"><strong>Denunciante:</strong> {denuncia.denunciante.nombreCompleto}</p>
                        <p className="mb-2"><strong>Denunciado:</strong> {denuncia.denunciado.nombreCompleto}</p>
                        <p className="mb-2"><strong>Motivo:</strong> {denuncia.denunciado.motivo}</p>
                    </>
                )}

                <div className="flex justify-end gap-4 mt-4">
                       
                    <button
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md  hover:bg-gray-400"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>

                    <button
                        className="px-4 py-2 border rounded bg-primary text-white hover:bg-blue-950
"
                        onClick={() => {
                            if (denuncia) onConfirm(denuncia); // Llama a la función de confirmación
                            onClose(); // Cierra el modal después de confirmar
                        }}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalActivarDenuncia;
