import {useState} from 'react';

function ModalInactivarComunidad({ isOpen, onClose, comunidadId, obtenerComunidades }) {

  const [loading, setLoading] = useState(false); // Estado para mostrar el loading
  const [error, setError] = useState(null); // Estado para manejar errores

  if (!isOpen) return null;

  const handleOpenDesactiveModal = async () => {
    setLoading(true);
    setError(null); // Limpiar errores previos
    try {
      const response = await fetch(`/api/autror/autoresdes/${comunidadId}`, {
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
      await obtenerComunidades();
      onClose(); // Cerrar el modal después de la actualización
    } catch (error) {
      setError('Hubo un problema al inactivar el autor.');
      console.error('Error al inactivar el autor:', error);
    } finally {
      setLoading(false); // Deja de mostrar loading
    }
  };

  return ( 
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg relative text-center" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-4 text-2xl text-primary">Inactivar Comunidad</h2>
        <p className="mb-6 text-gray-600">¿Estás seguro de que deseas inactivar esta comunidad?</p>

        {error && <p className="text-red-500">{error}</p>} {/* Mostrar error si existe */}

        <div className="flex justify-end gap-4 mt-4">
          <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md  hover:bg-gray-400" onClick={onClose}>
            Cancelar
          </button>
          <button className="px-4 py-2 border rounded bg-primary text-white hover:bg-blue-950"
            onClick={handleOpenDesactiveModal}
            disabled={loading}
          >
            {loading ? 'Inactivando...' : 'Inactivar'}
            </button>
        </div>
      </div>
    </div>
  );
}

export default ModalInactivarComunidad;
