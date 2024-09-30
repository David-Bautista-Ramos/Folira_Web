import PropTypes from 'prop-types';

const ModalFiltroEstado = ({ isOpen, onClose, onFilter }) => {
    if (!isOpen) return null; // No muestra el modal si no está abierto

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-md shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Filtrar Denuncias por Estado</h2>
                <div className="flex gap-4">
                    <button 
                        className="bg-green-500 text-white px-4 py-2 rounded-md"
                        onClick={() => onFilter('activo')} // Filtra por activo
                    >
                        Activo
                    </button>
                    <button 
                        className="bg-red-500 text-white px-4 py-2 rounded-md"
                        onClick={() => onFilter('inactivo')} // Filtra por inactivo
                    >
                        Inactivo
                    </button>
                </div>

                {/* Botón para restaurar todas las denuncias */}
                <div className="mt-4">
                    <button 
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        onClick={() => onFilter(null)} // Restaura la lista sin filtros
                    >
                        Restaurar
                    </button>
                </div>

                <button 
                    className="mt-4 text-gray-600 underline"
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
