const ModalActivarNotificacion = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null; // Si no está abierto, no renderizar

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <button onClick={onClose} className="absolute top-2 right-2 text-lg font-bold">
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">Activar Notificaciones</h2>
        <p className="mb-4">¿Estás seguro de que deseas activar las notificaciones?</p>
        
        <div className="flex justify-end">
          <button 
            onClick={onConfirm} 
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            Confirmar
          </button>
          <button 
            onClick={onClose} 
            className="bg-gray-300 text-black px-4 py-2 rounded"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalActivarNotificacion;
