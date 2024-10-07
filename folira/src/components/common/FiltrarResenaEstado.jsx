
const FiltrarResenaEstado = ({ isOpen, onClose, onFilter, onRestore }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-4 w-1/3">
          <h2 className="text-lg font-semibold mb-4">Filtrar por Estado</h2>
          <button
            onClick={() => onFilter("Activo")}
            className="block w-full text-left px-4 py-2 hover:bg-gray-200"
          >
            Activos
          </button>
          <button
            onClick={() => onFilter("Inactivo")}
            className="block w-full text-left px-4 py-2 hover:bg-gray-200"
          >
            Inactivos
          </button>
  
          {/* Botón de restaurar */}
          <button
            onClick={onRestore}
            className="block w-full text-left px-4 py-2 hover:bg-gray-200"
          >
            Restaurar
          </button>
  
          <button onClick={onClose} className="mt-4 ml-[320px]  bg-gray-300 px-4 py-2 rounded">
            Cerrar
          </button>
        </div>
      </div>
    );
  };
  
  export default FiltrarResenaEstado;
