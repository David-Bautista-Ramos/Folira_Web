function ModalActivarComunidad({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg relative text-center" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-4 text-2xl text-primary">Activar Comunidad</h2>
        <p className="mb-6 text-gray-600">¿Estás seguro de que deseas activar esta comunidad?</p>
        <div className="
flex justify-end gap-4 mt-4">
          <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md  hover:bg-gray-400
" onClick={onClose}>
            Cancelar
          </button>
          <button className="px-4 py-2 border rounded bg-primary text-white hover:bg-blue-950">
            Activar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalActivarComunidad;
