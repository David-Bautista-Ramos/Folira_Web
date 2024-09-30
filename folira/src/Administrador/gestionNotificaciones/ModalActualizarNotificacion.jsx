
import { useState } from 'react';

const ModalActualizarNotificacion = ({ isOpen, onClose, onUpdate }) => {
  const [notificationDetails, setNotificationDetails] = useState('');

  if (!isOpen) return null; // Si no está abierto, no renderizar

  const handleUpdateChange = (event) => {
    setNotificationDetails(event.target.value);
  };

  const handleUpdateConfirm = () => {
    onUpdate(notificationDetails);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <button onClick={onClose} className="absolute top-2 right-2 text-lg font-bold">
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">Actualizar Notificaciones</h2>
        <p className="mb-2">Introduce los nuevos detalles de la notificación:</p>
        
        <textarea
          value={notificationDetails}
          onChange={handleUpdateChange}
          className="w-full border border-gray-300 rounded p-2 mb-4"
          rows="4"
        />

        <div className="flex justify-end">
          <button 
            onClick={handleUpdateConfirm} 
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            Actualizar
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

export default ModalActualizarNotificacion

