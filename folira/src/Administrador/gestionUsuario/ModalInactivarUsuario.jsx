import { useState } from 'react';

function ModalInactivarUsuario({ isOpen, onClose, userId, obtenerUsuarios }) {
  const [loading, setLoading] = useState(false); // Estado para mostrar el loading
  const [error, setError] = useState(null); // Estado para manejar errores

  if (!isOpen) return null;

  const handleInactivarUsuario = async () => {
    setLoading(true);
    setError(null); // Limpiar errores previos
    try {
      const response = await fetch(`/api/users/estados/${userId}`, {
        method: 'POST', // Cambia el método según sea necesario (PUT/POST)
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer token`, // Si es necesario agregar un token de autorización
        },
        body: JSON.stringify({ nuevoEstado: false }), // Envía el estado actualizado
      });

      if (!response.ok) {
        throw new Error('Error al inactivar el usuario');
      }

      // Si la inactivación es exitosa, actualiza la lista de usuarios
      await obtenerUsuarios();
      onClose(); // Cerrar el modal después de la actualización
    } catch (error) {
      setError('Hubo un problema al inactivar el usuario.');
      console.error('Error al inactivar el usuario:', error);
    } finally {
      setLoading(false); // Deja de mostrar loading
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Inactivar Usuario</h2>
        <p className="text-gray-600 mb-6">¿Estás seguro de que deseas inactivar este usuario?</p>

        {error && <p className="text-red-500">{error}</p>} {/* Mostrar error si existe */}
        
        <div className="flex justify-end gap-4 mt-4">
          <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button
            className="px-4 py-2 border rounded bg-primary text-white hover:bg-blue-950"
            onClick={handleInactivarUsuario}
            disabled={loading}
          >
            {loading ? 'Inactivando...' : 'Inactivar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalInactivarUsuario;
