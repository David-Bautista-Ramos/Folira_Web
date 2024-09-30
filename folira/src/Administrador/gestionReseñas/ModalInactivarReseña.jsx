function ModalInactivarReseña({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Inactivar Reseña</h2>
        <p className="text-gray-600 mb-6">¿Estás seguro de que deseas inactivar esta reseña?</p>
        <div className="flex justify-end gap-4 mt-4">
          <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md  hover:bg-gray-400" onClick={onClose}>
            Cancelar
          </button>
          <button className="px-4 py-2 border  rounded bg-primary text-white hover:bg-blue-950">
            Inactivar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalInactivarReseña;


