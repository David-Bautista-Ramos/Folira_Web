import { useState, useEffect } from 'react';

const ModalActualizarDenuncia = ({ isOpen, onClose, denuncia }) => {
    const [nombreDenunciante, setNombreDenunciante] = useState('');
    const [nombreDenunciado, setNombreDenunciado] = useState('');
    const [motivo, setMotivo] = useState('');
    const [estado, setEstado] = useState('');

    // Cargar los datos de la denuncia en los estados cuando el modal se abre
    useEffect(() => {
        if (isOpen && denuncia) {
            setNombreDenunciante(denuncia.denunciante.nombreCompleto);
            setNombreDenunciado(denuncia.denunciado.nombreCompleto);
            setMotivo(denuncia.denunciado.motivo);
            setEstado(denuncia.estado); // Cargar el estado de la denuncia
        }
    }, [isOpen, denuncia]);

    const handleConfirm = () => {
        // Aquí puedes agregar la lógica para actualizar la denuncia
        const updatedDenuncia = {
            ...denuncia,
            denunciante: { ...denuncia.denunciante, nombreCompleto: nombreDenunciante },
            denunciado: { ...denuncia.denunciado, nombreCompleto: nombreDenunciado, motivo: motivo },
            estado: estado, // Actualizar el estado
        };
        console.log('Denuncia actualizada:', updatedDenuncia);
        // Aquí podrías llamar a una función para enviar los datos actualizados a tu API o estado global
        onClose(); // Cerrar el modal
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-5 w-96 z-10">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Actualizar Denuncia</h2>
                </div>
                <div className="mb-4">
                    <label className="block mb-1"><strong>Denunciante:</strong></label>
                    <input 
                        type="text" 
                        value={nombreDenunciante} 
                        onChange={(e) => setNombreDenunciante(e.target.value)} 
                        className="w-full border rounded p-2" 
                        disabled // Deshabilitado para no modificar el nombre del denunciante
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1"><strong>Denunciado:</strong></label>
                    <input 
                        type="text" 
                        value={nombreDenunciado} 
                        onChange={(e) => setNombreDenunciado(e.target.value)} 
                        className="w-full border rounded p-2" 
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1"><strong>Motivo:</strong></label>
                    <input 
                        type="text" 
                        value={motivo} 
                        onChange={(e) => setMotivo(e.target.value)} 
                        className="w-full border rounded p-2" 
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1"><strong>Estado:</strong></label>
                    <select 
                        value={estado} 
                        onChange={(e) => setEstado(e.target.value)} 
                        className="w-full border rounded p-2"
                    >
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                        <option value="en revisión">En Revisión</option>
                        {/* Agrega más opciones según sea necesario */}
                    </select>
                </div>
                <div className="flex justify-end mt-4">
                    <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md mr-4 hover:bg-gray-400" onClick={onClose}>
                        Cancelar
                    </button>
                    <button className="px-4 py-2 border rounded bg-primary text-white hover:bg-blue-950" onClick={handleConfirm}>
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalActualizarDenuncia;
