const FiltroTipoModal = ({ isOpen, onClose, onFilter, selectedTipo, setSelectedTipo }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Filtrar por Tipo de Denuncia</h2>
        
        <div className="mb-4">
          <label className="block mb-2">Selecciona un tipo:</label>
          <select
            value={selectedTipo}
            onChange={(e) => setSelectedTipo(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full"
          >
            <option value="">Seleccionar Tipo</option>
            <option value="Denuncia de Publicación">Denuncia de Publicación</option>
            <option value="Denuncia de Comentario">Denuncia de Comentario</option>
            <option value="Denuncia de Comunidad">Denuncia de Comunidad</option>
            <option value="Denuncia de Usuario">Denuncia de Usuario</option>
          </select>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={onFilter}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Filtrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiltroTipoModal;
