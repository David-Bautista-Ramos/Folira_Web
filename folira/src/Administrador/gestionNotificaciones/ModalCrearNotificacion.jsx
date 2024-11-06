import { useState, useEffect } from 'react';
import useCreateNotificacion from '../../hooks/useCreateNotificacion.jsx';
import Select from 'react-select';

const ModalCrearNotificacion = ({ isOpen, onClose }) => {
  const [notificationDetails, setNotificationDetails] = useState({
    de: '',
    para: '',
    tipo: '',
    mensaje:'',
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

  const handleCreateConfirm = () => {
    if (!notificationDetails.de || !notificationDetails.para || !notificationDetails.tipo) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    setError('');
  
    // Llamada a la función `createNotificacion` y manejo de la promesa
    createNotificacion(notificationDetails)
      .then(() => {
        console.log("Notificación creada con éxito, cerrando modal...");
        onClose(); // Cerrar el modal después de que se complete la creación
      })
      .catch((error) => {
        console.error("Error al crear la notificación:", error);
        setError("No se pudo crear la notificación.");
      });
  };
  

  return (
<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
  <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
    <h2 className="text-xl font-semibold mb-4">Crear Notificación</h2>

    {loading ? (
      <p>Cargando usuarios...</p>
    ) : error ? (
      <p className="text-red-500">{error}</p>
    ) : (
      <>
        <label className="block mb-2 text-primary">De:</label>
        <Select
  name="de"
  value={
    users
      .map(user => ({
        value: user._id,
        label: user.nombre,
        imgURL: user.fotoPerfil, // La URL de la imagen del usuario
      }))
      .find(user => user.value === notificationDetails.de) || null
  }
  onChange={option => handleInputChange({ target: { name: 'de', value: option.value } })}
  options={users.map(user => ({
    value: user._id,
    label: user.nombre,
    imgURL: user.fotoPerfil, // La URL de la imagen del usuario
  }))}
  className="w-full mb-3"
  classNamePrefix="select"
  formatOptionLabel={option => (
    <div className="flex items-center">
      <img
        src={option.imgURL}  // Fuente de la imagen
        alt="Perfil"
        className="w-8 h-8 rounded-full mr-2"  // Tamaño de la imagen y el margen
      />
      <span>{option.label}</span>  {/* Nombre del usuario */}
    </div>
  )}
  styles={{
    control: (provided) => ({
      ...provided,
      borderColor: 'gray',
      boxShadow: 'none',
      '&:hover': { borderColor: 'blue' },
      minHeight: '38px',
    }),
    menu: (provided) => ({
      ...provided,
      overflowY: 'auto',  // Habilita el scroll si hay muchas opciones
    }),
  }}
  placeholder="Seleccione un usuario"
/>

<label className="block mb-1 text-primary">Para:</label>
<Select
  name="para"
  value={ 
    users
      .map(user => ({
        value: user._id,          // ID del usuario, se utiliza para comparar con 'para'
        label: user.nombre,       // Nombre del usuario
        imgURL: user.fotoPerfil,  // URL de la foto de perfil
      }))
      .find(user => user.value === notificationDetails.para) || null // Se busca el usuario seleccionado por su ID
  }
  onChange={option => handleInputChange({ target: { name: 'para', value: option.value } })} // Actualiza el estado con el nuevo ID
  options={users.map(user => ({
    value: user._id,          // ID del usuario
    label: user.nombre,       // Nombre del usuario
    imgURL: user.fotoPerfil,  // Foto de perfil del usuario
  }))}
  className="w-full mb-3" // Estilos del contenedor del select
  classNamePrefix="select" 
  formatOptionLabel={option => (
    <div className="flex items-center">
      <img
        src={option.imgURL}  // Muestra la imagen del perfil
        alt="Perfil"
        className="w-8 h-8 rounded-full mr-2" // Estilo de la imagen (tamaño y borde redondeado)
      />
      <span>{option.label}</span> {/* Muestra el nombre del usuario */}
    </div>
  )}
  styles={{
    control: (provided) => ({
      ...provided,
      borderColor: 'gray',
      boxShadow: 'none',
      '&:hover': { borderColor: 'blue' },
      minHeight: '38px',
    }),
    menu: (provided) => ({
      ...provided,
      overflowY: 'auto',  // Habilita el scroll si hay muchas opciones
    }),
  }}
  placeholder="Seleccione un usuario" // Texto del placeholder
/>


          <label className='block mb-2'>Mensaje</label>
            <input
             type="text"
             name='mensaje'
             onChange={handleInputChange}
             value={notificationDetails.mensaje}
             placeholder="Puedes dejar un mesaje para el usuario"
             className="w-full p-2 mb-2 border rounded focus:border-primary focus:outline-none text-sm"
          />

        <label className="block mb-2">Tipo de Notificación:</label>
        <Select
          name="tipo"
          value={notificationDetails.tipo ? { value: notificationDetails.tipo, label: notificationDetails.tipo } : null}
          onChange={option => handleInputChange({ target: { name: 'tipo', value: option.value } })}
          options={[
            { value: 'seguidor', label: 'Seguidor' },
            { value: 'like', label: 'Like' },
            { value: 'comunidad', label: 'Comunidad' },
            { value: 'denuncia', label: 'Denuncia' },
            { value: 'comentario', label: 'Comentario' },
          ]}
          className="w-full mb-4"
          classNamePrefix="select" // Esto permite un estilo más personalizado
          styles={{
            control: (provided) => ({
              ...provided,
              borderColor: 'gray',
              boxShadow: 'none',
              '&:hover': { borderColor: 'blue' }, // Cambiar color al pasar el ratón
              minHeight: '38px', // Asegúrate de que el control tenga suficiente altura
            }),
            menu: (provided) => ({
              ...provided,
              overflowY: 'hidden', // Evita el scroll
            }),
          }}
        />

        <div className="flex justify-end">
          <button
            onClick={handleCreateConfirm}
            className="bg-primary mt-3 text-white px-4 py-2 rounded-md ml-2 hover:bg-blue-950"
            disabled={isCreatingNotificacion}
          >
            {isCreatingNotificacion ? "Creando..." : "Crear"}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md mt-3 ml-4 hover:bg-gray-400"
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