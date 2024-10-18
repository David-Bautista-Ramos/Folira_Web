import { useState, useEffect } from 'react';
import useCreateNotificacion from '../../hooks/useCreateNotificacion.jsx';

const ModalCrearNotificacion = ({ isOpen, onClose }) => {
  const [notificationDetails, setNotificationDetails] = useState({
    de: '',
    para: '',
    tipo: '',
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const {createNotificacion, isCreatingNotificacion} = useCreateNotificacion();

  // Fetch users when the modal opens
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/api/notifications/allUsers')
        .then((response) => {
          if (!response.ok) throw new Error("Failed to fetch users");
          return response.json();
        })
        .then((data) => {
          setUsers(data.usuarios || []);
          setError('');
        })
        .catch((error) => {
          console.error("Error al obtener usuarios:", error);
          setError("No se pudieron cargar los usuarios.");
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle form input changes
  const handleInputChange = (event) => {
    setNotificationDetails({
      ...notificationDetails,
      [event.target.name]: event.target.value,
    });
  };

  // Handle create notification confirmation
  const handleCreateConfirm = () => {
    if (!notificationDetails.de || !notificationDetails.para || !notificationDetails.tipo) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    setError('');
    createNotificacion(notificationDetails)
      .then(() => {
        onClose();
      })
      .catch((error) => {
        console.error("Error al crear la notificación:", error);
        setError("No se pudo crear la notificación.");
      });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-lg font-bold">
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">Crear Notificación</h2>

        {loading ? (
          <p>Cargando usuarios...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <label className="block mb-2">De:</label>
            <select
              name="de"
              value={notificationDetails.de}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-2 mb-4"
            >
              <option value="">Seleccionar usuario</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>{user.nombre}</option>
              ))}
            </select>

            <label className="block mb-2">Para:</label>
            <select
              name="para"
              value={notificationDetails.para}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-2 mb-4"
            >
              <option value="">Seleccionar usuario</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>{user.nombre}</option>
              ))}
            </select>

            <label className="block mb-2">Tipo de Notificación:</label>
            <select
              name="tipo"
              value={notificationDetails.tipo}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-2 mb-4"
            >
              <option value="">Seleccionar tipo</option>
              <option value="seguidor">Seguidor</option>
              <option value="like">Like</option>
              <option value="insignia">Insignia</option>
              <option value="denuncia">Denuncia</option>
              <option value="comentario">Comentario</option>
            </select>

            <div className="flex justify-end">
              <button
                onClick={handleCreateConfirm}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                disabled={isCreatingNotificacion}
              >
                {isCreatingNotificacion ? "Creando..." : "Crear"}
              </button>
              <button
                onClick={onClose}
                className="bg-gray-300 text-black px-4 py-2 rounded"
                disabled={isCreatingNotificacion}
              >
                Cancelar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ModalCrearNotificacion;
