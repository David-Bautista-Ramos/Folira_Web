import { useState, useEffect } from 'react';
import Select from 'react-select';
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
  const { createNotificacion, isCreatingNotificacion } = useCreateNotificacion();

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

  const handleInputChange = (name, value) => {
    setNotificationDetails({
      ...notificationDetails,
      [name]: value,
    });
  };

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

  const userOptions = users.map((user) => ({ value: user._id, label: user.nombre }));

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
            <Select
              options={userOptions}
              value={userOptions.find((option) => option.value === notificationDetails.de)}
              onChange={(option) => handleInputChange('de', option.value)}
              placeholder="Seleccionar usuario"
              styles={{
                menu: (base) => ({
                  ...base,
                  maxHeight: '150px', // O puedes quitar esta propiedad
                  overflowY: 'hidden', // Esto elimina el scroll
                }),
              }}
            
            />

            <label className="block mb-2">Para:</label>
            <Select
              options={userOptions}
              value={userOptions.find((option) => option.value === notificationDetails.para)}
              onChange={(option) => handleInputChange('para', option.value)}
              placeholder="Seleccionar usuario"
              styles={{
                menu: (base) => ({
                  ...base,
                  maxHeight: '150px', // O puedes quitar esta propiedad
                  overflowY: 'hidden', // Esto elimina el scroll
                }),
              }}
              
            />

            <label className="block mb-2">Tipo de Notificación:</label>
            <Select
              options={[
                { value: 'seguidor', label: 'Seguidor' },
                { value: 'like', label: 'Like' },
                { value: 'insignia', label: 'Insignia' },
                { value: 'denuncia', label: 'Denuncia' },
                { value: 'comentario', label: 'Comentario' },
              ]}
              value={[
                { value: 'seguidor', label: 'Seguidor' },
                { value: 'like', label: 'Like' },
                { value: 'insignia', label: 'Insignia' },
                { value: 'denuncia', label: 'Denuncia' },
                { value: 'comentario', label: 'Comentario' },
              ].find((option) => option.value === notificationDetails.tipo)}
              onChange={(option) => handleInputChange('tipo', option.value)}
              placeholder="Seleccionar tipo"
              styles={{
                menu: (base) => ({
                  ...base,
                  maxHeight: '150px',
                  overflowY: 'auto',
                }),
              }}
              
            />

            <div className="flex justify-end mt-4">
              <button
                onClick={handleCreateConfirm}
                className="px-4 py-2 border rounded bg-primary text-white hover:bg-blue-950 mr-4"
                disabled={isCreatingNotificacion}
              >
                {isCreatingNotificacion ? "Creando..." : "Crear"}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md  hover:bg-gray-400"
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
