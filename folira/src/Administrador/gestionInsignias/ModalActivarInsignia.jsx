import React, { useState } from 'react';

function ModalActivarInsignia({ isOpen, onClose, insignia, onActivate }) {
  const [loading, setLoading] = useState(false); // Estado para mostrar el loading

  if (!isOpen) return null;

  const handleActivate = async () => {
    setLoading(true);
    try {
      // Lógica para activar la insignia (puedes llamar a tu API aquí)
      await onActivate(insignia._id); // Asumiendo que tienes una función para activar la insignia
      onClose(); // Cierra el modal después de la activación
    } catch (error) {
      console.error("Error al activar la insignia:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Activar Insignia</h2>
        <p className="text-gray-600 mb-6">¿Estás seguro de que deseas activar la insignia "{insignia.nombre}"?</p>
        
        <div className="flex justify-end gap-4 mt-4">
          <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400" onClick={onClose}>
            Cancelar
          </button>
          <button
            className={`px-4 py-2 border rounded bg-primary text-white hover:bg-blue-950 ${loading ? 'opacity-50' : ''}`}
            onClick={handleActivate}
            disabled={loading}
          >
            {loading ? "Activando..." : "Activar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalActivarInsignia;
