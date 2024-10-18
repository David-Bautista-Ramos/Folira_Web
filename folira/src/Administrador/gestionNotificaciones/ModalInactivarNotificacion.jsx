import { useState } from "react";

const ModalInactivarNotificacion = ({  isOpen, onClose, NotificacionId, obtenerNotificaciones }) => {
  const [loading, setLoading] = useState(false); // Estado para mostrar el loading

  if (!isOpen) return null; // Si no está abierto, no renderizar

  const handleOpenActivarModal = async () => {
    setLoading(true);  
    try {
      const response = await fetch(`/api/notifications/notifino/${NotificacionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error("Error al leer la notificacion");
      }

      const data = await response.json();
      console.log(data.message); // Mensaje de éxito o error
      obtenerNotificaciones(); // Vuelve a obtener los usuarios actualizados
      onClose(); // Cierra el modal después de la activación
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50" 
      onClick={onClose}
      >
          <div 
          className="bg-white p-5 rounded-lg max-w-md w-full shadow-lg relative z-50 text-center" 
          onClick={(e) => e.stopPropagation()}
        >
        <h2 className="text-xl font-semibold mb-4">Inactivar Notificaciones</h2>
        <p className="mb-4">¿Estás seguro de que deseas inactivar las notificaciones?</p>
        
        <div className="flex justify-end gap-4 mt-4">
          <button 
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md  hover:bg-gray-400 " 
            onClick={onClose}
          >
            Cancelar
          </button>   
          <button
            className={`px-4 py-2 border rounded bg-primary text-white hover:bg-blue-950 ${loading ? 'opacity-50' : ''}`}
            onClick={handleOpenActivarModal}
            disabled={loading}
          >
            {loading ? "Inactivando..." : "Inactivar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalInactivarNotificacion
