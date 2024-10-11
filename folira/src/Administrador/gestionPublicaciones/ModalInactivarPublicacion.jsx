import {useState} from 'react';

function ModalInactivarPublicacion  ({ isOpen, onClose, publicacionId, obtenerPublicaciones  }) {
    const [loading, setLoading] = useState(false); // Estado para mostrar el loading
    const [error, setError] = useState(null); // Estado para manejar errores
  
    if (!isOpen) return null;
  
    const handleInactivarAutores = async () => {
      setLoading(true);
      setError(null); // Limpiar errores previos
      try {
        const response = await fetch(`/api/autror/autoresdes/${publicacionId}`, {
          method: 'PUT', // Cambia el método según sea necesario (PUT/POST)
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer token`, // Si es necesario agregar un token de autorización
          }
        });
  
        if (!response.ok) {
          throw new Error('Error al inactivar el autor');
        }
  
        // Si la inactivación es exitosa, actualiza la lista de usuarios
        await obtenerPublicaciones();
        onClose(); // Cerrar el modal después de la actualización
      } catch (error) {
        setError('Hubo un problema al inactivar el autor.');
        console.error('Error al inactivar el autor:', error);
      } finally {
        setLoading(false); // Deja de mostrar loading
      }
    };

  return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="bg-white rounded-lg p-6 z-60">
              <h2 className="text-lg font-semibold">Inactivar Publicación</h2>
              <p>¿Estás seguro de que deseas inactivar esta publicación?</p>
              {error && <p className="text-red-500">{error}</p>} {/* Mostrar error si existe */}

              <div className="flex justify-end mt-4">
                  <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md  hover:bg-gray-400" onClick={onClose}>
                      Cancelar
                  </button>
                    <button className="px-4 py-2 border rounded bg-primary text-white hover:bg-blue-950"
                        onClick={handleInactivarAutores}
                        disabled={loading}
                        >
                        {loading ? 'Inactivando...' : 'Inactivar'}
                    </button>
              </div>
          </div>
      </div>
  );
};

export default ModalInactivarPublicacion;
