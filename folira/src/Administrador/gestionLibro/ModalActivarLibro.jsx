import { useState } from "react";

function ModalActivarLibro({ isOpen, onClose, libroId, obetnerLibros }) {

  const [loading, setLoading] = useState(false); // Estado para mostrar el loading

  if (!isOpen) return null;

  const handleOpenActivarModal = async () => {
    setLoading(true);  
    try {
      const response = await fetch(`/api/libro/actlibro/${libroId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error("Error al activar el libro");
      }

      const data = await response.json();
      console.log(data.message); // Mensaje de éxito o error
      obetnerLibros(); // Vuelve a obtener los usuarios actualizados
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
        
        
        <h2 className="mb-4 text-2xl text-primary">Activar Libro</h2>
        <p className="mb-5 text-gray-600 text-base">¿Estás seguro de que deseas activar este libro?</p>

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
            {loading ? "Activando..." : "Activar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalActivarLibro;
