import { useState } from "react";

function ModalActivarPublicacion  ({ isOpen, onClose, publicacionId, obtenerPublicaciones })  {
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;
  
    const handleActivarAutor = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/posts/actpost/${publicacionId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error("Error al activar al publicacion");
        }
  
        const data = await response.json();
        
        console.log(data.message); // Mensaje de éxito o error
        obtenerPublicaciones(); // Vuelve a obtener los usuarios actualizados
        onClose(); // Cierra el modal después de la activación
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

  return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="bg-white rounded-lg p-6 z-60">
              <h2 className="text-lg font-semibold">Activar Publicación</h2>
              <p>¿Estás seguro de que deseas activar esta publicación?</p>
              <div className="flex justify-end mt-4">
                  <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md  hover:bg-gray-400" onClick={onClose}>
                      Cancelar
                  </button>
                  <button className={`px-4 py-2 border rounded bg-primary text-white hover:bg-blue-950" ${loading ? 'opacity-50' : ''}`}
                    onClick={handleActivarAutor}
                    disabled={loading}
                    >
                    {loading ? "Activando..." : "Activar"}
                    </button>
              </div>
          </div>
      </div>
  );
};

export default ModalActivarPublicacion;
