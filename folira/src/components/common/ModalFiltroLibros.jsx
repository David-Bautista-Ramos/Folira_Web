

const ModalFiltroLibros = ({ isOpen, onClose, onFilter }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-4 w-1/3">
        <h2 className="text-lg font-semibold mb-4">Filtrar Libros</h2>
        <button
          onClick={() => onFilter("Activar")}
          className="block w-full text-left px-4 py-2 hover:bg-gray-200"
        >
          Disponible
        </button>
        <button
          onClick={() => onFilter("Inactivar")}
          className="block w-full text-left px-4 py-2 hover:bg-gray-200"
        >
          No disponible
        </button>
        <button
          onClick={() => onFilter("Restaurar")}
          className="block w-full text-left px-4 py-2 hover:bg-gray-200"
        >
          Restaurar
        </button>
        <button onClick={onClose} className="mt-4 ml-[320px] bg-gray-300 px-4 py-2 rounded">
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ModalFiltroLibros;
