import PropTypes from 'prop-types';

const ModalFiltroEstado = ({ isOpen, onClose, onFilter }) => {
    if (!isOpen) return null; // No muestra el modal si no está abierto

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-4 w-1/3">
                <h2 className="text-lg font-semibold mb-4">Filtrar Denuncias por Estado</h2>
                {/* Cambiado el contenedor a 'flex-col' para alinear verticalmente */}
                <div className="flex flex-col gap-2">
                    <button 
                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                        onClick={() => onFilter('Activo')} // Filtra por activo
                    >
                        Activo
                    </button>
                    <button 
                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                        onClick={() => onFilter('Inactivo')} // Filtra por inactivo
                    >
                        Inactivo
                    </button>
                    <button 
                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                        onClick={() => onFilter('Restaurar')} // Restaura la lista sin filtros
                    >
                        Restaurar
                    </button>
                </div>

                <button 
                    className="mt-4 ml-[340px] bg-gray-300 px-4 py-2 rounded"
                    onClick={onClose} // Cierra el modal
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
};

// Define las propiedades del componente
ModalFiltroEstado.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onFilter: PropTypes.func.isRequired,
};

export default ModalFiltroEstado;