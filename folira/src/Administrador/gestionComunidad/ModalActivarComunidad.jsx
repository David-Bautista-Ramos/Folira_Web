import { useState } from "react";

function ModalActivarComunidad({ isOpen, onClose, comunidadId, obtenerComunidades }) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleOpenActivarModal = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/comunidad/comunidadact/${comunidadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error("Error al activar el autor");
      }

      const data = await response.json();
      
      console.log(data.message); // Mensaje de éxito o error
      obtenerComunidades(); // Vuelve a obtener los usuarios actualizados
      onClose(); // Cierra el modal después de la activación
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg relative text-center" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-4 text-2xl text-primary">Activar Comunidad</h2>
        <p className="mb-6 text-gray-600">¿Estás seguro de que deseas activar esta comunidad?</p>
        <div className="flex justify-end gap-4 mt-4"> 
          <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md  hover:bg-gray-400" onClick={onClose}>
            Cancelar
          </button>
          <button className={`px-4 py-2 border rounded bg-primary text-white hover:bg-blue-950" ${loading ? 'opacity-50' : ''}`}
                onClick={handleOpenActivarModal}
                disabled={loading}
            >
             {loading ? "Activando..." : "Activar"}
            </button>
        </div>
      </div>
    </div>
  );
}

export default ModalActivarComunidad;
